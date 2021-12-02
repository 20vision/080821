use solana_program::{
    account_info::{next_account_info, AccountInfo},
    decode_error::DecodeError,
    entrypoint::ProgramResult,
    system_instruction,
    msg,
    program::{invoke_signed, invoke},
    program_error::{PrintProgramError, ProgramError},
    program_option::COption,
    program_pack::Pack,
    pubkey,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_program
};
use num_traits::FromPrimitive;
use crate::{
    state::{PageTokenSwap, BuyAmt},
    error::VisionError,
    instruction::{VisionInstruction, Amount, Fee},
};
use spl_token::{
    state::{Account, Mint}
};
use spl_associated_token_account;
use std::convert::TryInto;

static PROVIDER_FEE_COLLECTOR_ID: Pubkey = pubkey!("CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f");

pub struct Processor {}

impl Processor {
    pub fn initialize_page_token(
        program_id: &Pubkey,
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError>{
    
    // Accounts
        let account_info_iter = &mut accounts.iter();

        let payer_info = next_account_info(account_info_iter)?;
        let new_mint_info = next_account_info(account_info_iter)?;
        let pda_info = next_account_info(account_info_iter)?;
        let pda_associated_sol_info = next_account_info(account_info_iter)?;
        let fee_collector_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let rent_sysvar_info = next_account_info(account_info_iter)?;
    // Variables
        let (pda, bump_seed) = Pubkey::find_program_address(&[&new_mint_info.key.to_bytes()], program_id);
        let (pda_sol, bump_seed_sol) = Pubkey::find_program_address(&[&pda_info.key.to_bytes()], program_id);

        // Minimum Collateral(Sol) needed for AMM to Mint the first Token to the Associated Token Account
        let collateral = 36 as u64;
        let collateral_rent = collateral.checked_add((Rent::get()?).minimum_balance(0 as usize)).ok_or(VisionError::Overflow)?;
        msg!("collateral_rent {:?}", collateral_rent);

    // Checks

        // Payer Info
        if !payer_info.is_signer {
            return Err(VisionError::SignatureRequired.into()); 
        }
        if *payer_info.owner != system_program::ID {
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }

        // Mint info
        if new_mint_info.lamports() > 0 {
            return Err(VisionError::AlreadyInUse.into());
        }
        if !new_mint_info.is_signer{
            return Err(VisionError::SignatureRequired.into()); 
        }

        // Pda Info
        if pda_info.lamports() > 0 {
            return Err(VisionError::AlreadyInUse.into());
        }
        if *pda_info.key != pda{
            return Err(VisionError::InvalidAccountAddress.into());
        }

        // Pda Associated Sol Info
        if pda_associated_sol_info.lamports() > 0 {
            return Err(VisionError::AlreadyInUse.into());
        }
        if *pda_associated_sol_info.key != pda_sol{
            return Err(VisionError::InvalidAccountAddress.into());
        }

        // Fee Collector
        if (fee_collector_info.lamports() > 0) && (*fee_collector_info.owner != system_program::ID){
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }

        // System Program
        if *system_program_info.key != system_program::ID{
            return Err(VisionError::InvalidProgramAddress.into());
        }

        // Token Program Id
        if *token_program_info.key != spl_token::ID{
            return Err(VisionError::InvalidProgramAddress.into());
        }
    // EXECUTION

        // AMM
            // Create AMM account
            invoke_signed(
                &system_instruction::create_account(
                    payer_info.key,
                    pda_info.key,
                    (Rent::get()?).minimum_balance(PageTokenSwap::LEN),
                    PageTokenSwap::LEN as u64,
                    program_id,
                ),
                &[
                    payer_info.clone(),
                    pda_info.clone(),
                    system_program_info.clone()
                ],
                &[&[
                    &new_mint_info.key.to_bytes(),
                    &[bump_seed]
                ]]
            )?;
            let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;

            // Save AMM Info
            swap_state.is_initialized = true;
            swap_state.bump_seed = bump_seed;
            swap_state.bump_seed_sol = bump_seed_sol;
            swap_state.fee = 2500;
            // ! Replace Fee collector with Program that distributes fee % towards multiple accounts
            swap_state.fee_collector_pubkey = *fee_collector_info.key;
            PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;

            // Save collateral for one token in Account
            invoke(
                &system_instruction::transfer(
                    payer_info.key,
                    pda_associated_sol_info.key,
                    collateral_rent,
                ),
                &[
                    payer_info.clone(),
                    pda_associated_sol_info.clone(),
                    system_program_info.clone()
                ]
            )?;
            // 1(*10^9) token will be added to calculation without actually ever minting and creating associated token account.
            
        // Mint Token
        invoke(
            &system_instruction::create_account(
                payer_info.key,
                new_mint_info.key,
                (Rent::get()?).minimum_balance(Mint::LEN),
                Mint::LEN as u64,
                token_program_info.key,
            ),
            &[
                payer_info.clone(),
                new_mint_info.clone(),
                token_program_info.clone()
            ]
        )?;
        invoke(
            &spl_token::instruction::initialize_mint(
                token_program_info.key,
                new_mint_info.key,
                pda_info.key,
                None,
                9
            )?,
            &[
                token_program_info.clone(),
                new_mint_info.clone(),
                pda_info.clone(),
                rent_sysvar_info.clone()
            ]
        )?;


        Ok(())

    }

    pub fn buy(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount_in: u64,
        minimum_amount_out: u64
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();
    // Accounts
        let payer_info = next_account_info(account_info_iter)?;
        let payer_associated_token_address_info = next_account_info(account_info_iter)?;    
        let pda_info = next_account_info(account_info_iter)?;
        let pda_associated_sol_info = next_account_info(account_info_iter)?;
        let mint_info = next_account_info(account_info_iter)?;
        let page_fee_collector_info = next_account_info(account_info_iter)?;
        let provider_fee_collector_info = next_account_info(account_info_iter)?;    
        let system_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
    // Variables

        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;

        // AMM state
        let swap_state = PageTokenSwap::unpack(&pda_info.data.borrow())?;
        msg!("swapstatefee: {:?} fee_collector_pubkey {:?}", swap_state.fee, swap_state.fee_collector_pubkey);
        // FEES
        let page_fee = ((amount_in as f64) * ((swap_state.fee as f64) / (100000f64))).round() as u64;
        let provider_fee = ((amount_in as f64) * 0.01f64).round() as u64;

        // Bancor formula "purchaseTargetAmount"
            // Token supply in circulation + initial 1(*10^9) token.
            let token_supply = (((spl_token::state::Mint::unpack(&mint_info.data.borrow())?).supply as u64).checked_add(1000000000u64).ok_or(VisionError::Overflow)?) as f64;
            // Amount In - Fees
            let adjusted_amount_in = (amount_in.checked_sub((page_fee.checked_add(provider_fee).ok_or(VisionError::Overflow)?)).ok_or(VisionError::Overflow)?) as f64;
            // Reserve Balance - Rent payed for Rent exemption
            let reserve_balance = (pda_associated_sol_info.lamports().checked_sub((((Rent::get()?).minimum_balance(0 as usize)) as u64)).ok_or(VisionError::Overflow)?) as f64;
            // Tokens received if input is amount_in
            let token_amt_from_sol_input = (token_supply * (((1f64 + adjusted_amount_in / reserve_balance).powf(0.60976f64)) - 1f64)).round() as u64;

    // Checks

        // Check slippage
            if token_amt_from_sol_input < minimum_amount_out {
                return Err(VisionError::ExceededSlippage.into());
            }
            if amount_in > payer_info.lamports() {
                return Err(VisionError::InvalidInput.into());
            }

        // Accounts
            if !payer_info.is_signer {
                return Err(VisionError::SignatureRequired.into()); 
            }
            if *payer_info.owner != system_program::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            // Create Associated token account off-chain and check everything on-chain
            if *payer_associated_token_address_info.owner != spl_token::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *payer_associated_token_address_info.key != spl_associated_token_account::get_associated_token_address(payer_info.key, mint_info.key){
                return Err(VisionError::InvalidAccountAddress.into());
            }

            if *pda_info.owner != *program_id{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *pda_info.key != (Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[swap_state.bump_seed]], program_id)?) {
                return Err(VisionError::InvalidAccountAddress.into());
            }
            

            if *pda_associated_sol_info.key != (Pubkey::create_program_address(&[&pda_info.key.to_bytes(), &[swap_state.bump_seed_sol]], program_id)?) {
                return Err(VisionError::InvalidAccountAddress.into());
            }
            if *pda_associated_sol_info.owner != system_program::ID{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }

            if *mint_info.owner != spl_token::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if !mint_state.is_initialized {
                return Err(VisionError::InvalidMint.into());
            }
            if COption::Some(*pda_info.key) != mint_state.mint_authority {
                return Err(VisionError::InvalidMint.into());
            }

            if *page_fee_collector_info.owner != system_program::ID{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *page_fee_collector_info.key != swap_state.fee_collector_pubkey{
                return Err(VisionError::InvalidAccountAddress.into());
            }

            if *provider_fee_collector_info.owner != system_program::ID{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *provider_fee_collector_info.key != PROVIDER_FEE_COLLECTOR_ID {
                return Err(VisionError::InvalidAccountAddress.into());
            }

            if *system_program_info.key != system_program::ID{
                return Err(VisionError::InvalidProgramAddress.into());
            }

            if *token_program_info.key != spl_token::ID{
                return Err(VisionError::InvalidProgramAddress.into());
            }
    // EXECUTION
        
        invoke_signed(
            &spl_token::instruction::mint_to(
                token_program_info.key,
                mint_info.key,
                payer_associated_token_address_info.key,
                pda_info.key,
                &[],
                token_amt_from_sol_input as u64
            )?,
            &[
                token_program_info.clone(),
                mint_info.clone(),
                payer_associated_token_address_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &mint_info.key.to_bytes(),
                &[swap_state.bump_seed]
            ]]
        )?;

        // Pay for token
        invoke(
            &system_instruction::transfer(
                payer_info.key,
                pda_associated_sol_info.key,
                adjusted_amount_in as u64
            ),
            &[
                system_program_info.clone(),
                payer_info.clone(),
                pda_associated_sol_info.clone()
            ]
        )?;

        // Pay fee to provider
        invoke(
            &system_instruction::transfer(
                payer_info.key,
                provider_fee_collector_info.key,
                provider_fee as u64
            ),
            &[
                system_program_info.clone(),
                payer_info.clone(),
                provider_fee_collector_info.clone()
            ]
        )?;
        // Pay fee to page fee collector
        invoke(
            &system_instruction::transfer(
                payer_info.key,
                page_fee_collector_info.key,
                page_fee as u64
            ),
            &[
                system_program_info.clone(),
                payer_info.clone(),
                page_fee_collector_info.clone()
            ]
        )?;

        Ok(())

    }


    pub fn sell(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount_in: u64,
        minimum_amount_out: u64
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();
    // Accounts
        let payer_info = next_account_info(account_info_iter)?;
        let payer_associated_token_address_info = next_account_info(account_info_iter)?;    
        let pda_info = next_account_info(account_info_iter)?;
        let pda_associated_sol_info = next_account_info(account_info_iter)?;
        let mint_info = next_account_info(account_info_iter)?;
        let provider_fee_collector_info = next_account_info(account_info_iter)?;    
        let system_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
    // Variables

        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;

        // AMM state
        let swap_state = PageTokenSwap::unpack(&pda_info.data.borrow())?;

        // Bancor formula "saleTargetAmount"
            // Token supply in circulation + initial 1(*10^9) token.
            let token_supply = (((spl_token::state::Mint::unpack(&mint_info.data.borrow())?).supply as u64).checked_add(1000000000u64).ok_or(VisionError::Overflow)?) as f64;
            // Reserve Balance - Rent payed for Rent exemption
            let reserve_balance = (pda_associated_sol_info.lamports().checked_sub((((Rent::get()?).minimum_balance(0 as usize)) as u64)).ok_or(VisionError::Overflow)?) as f64;
            // sol received if input is amount_in
            let sol_amt_from_token_input = (reserve_balance * (1f64 - (1f64 - (amount_in as f64) / token_supply).powf(1f64 / 0.60976f64))).round() as u64;

        // FEES
            let provider_fee = ((sol_amt_from_token_input as f64) * 0.01f64).round() as u64;

        let adjusted_sol_amt_from_token_input = sol_amt_from_token_input.checked_sub(provider_fee).ok_or(VisionError::Overflow)?;
    
    
    // Checks

        // Check output
            if sol_amt_from_token_input > ((reserve_balance as u64).checked_sub(36u64).ok_or(VisionError::Overflow)?){
                return Err(VisionError::ReserveError.into());
            }
            if adjusted_sol_amt_from_token_input < minimum_amount_out {
                return Err(VisionError::ExceededSlippage.into());
            }
            if amount_in > (spl_token::state::Account::unpack(&payer_associated_token_address_info.data.borrow())?).amount {
                return Err(VisionError::InvalidInput.into());
            }
        // Accounts
            if !payer_info.is_signer {
                return Err(VisionError::SignatureRequired.into()); 
            }
            if *payer_info.owner != system_program::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            
            if *payer_associated_token_address_info.owner != spl_token::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *payer_associated_token_address_info.key != spl_associated_token_account::get_associated_token_address(payer_info.key, mint_info.key){
                return Err(VisionError::InvalidAccountAddress.into());
            }

            if *pda_info.owner != *program_id{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *pda_info.key != (Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[swap_state.bump_seed]], program_id)?) {
                return Err(VisionError::InvalidAccountAddress.into());
            }
            

            if *pda_associated_sol_info.key != (Pubkey::create_program_address(&[&pda_info.key.to_bytes(), &[swap_state.bump_seed_sol]], program_id)?) {
                return Err(VisionError::InvalidAccountAddress.into());
            }
            if *pda_associated_sol_info.owner != system_program::ID{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }

            if *mint_info.owner != spl_token::ID {
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if !mint_state.is_initialized {
                return Err(VisionError::InvalidMint.into());
            }
            if COption::Some(*pda_info.key) != mint_state.mint_authority {
                return Err(VisionError::InvalidMint.into());
            }

            if *provider_fee_collector_info.owner != system_program::ID{
                return Err(VisionError::InvalidAccountOnwerProgram.into());
            }
            if *provider_fee_collector_info.key != PROVIDER_FEE_COLLECTOR_ID {
                return Err(VisionError::InvalidAccountAddress.into());
            }

            if *system_program_info.key != system_program::ID{
                return Err(VisionError::InvalidProgramAddress.into());
            }

            if *token_program_info.key != spl_token::ID{
                return Err(VisionError::InvalidProgramAddress.into());
            }

    // EXECUTION

            invoke_signed(
                &system_instruction::transfer(
                    pda_associated_sol_info.key,
                    provider_fee_collector_info.key,
                    provider_fee as u64
                ),
                &[
                    system_program_info.clone(),
                    pda_associated_sol_info.clone(),
                    provider_fee_collector_info.clone()
                ],
                &[&[
                    &pda_info.key.to_bytes(),
                    &[swap_state.bump_seed_sol]
                ]]
            )?;
    
            invoke_signed(
                &system_instruction::transfer(
                    pda_associated_sol_info.key,
                    payer_info.key,
                    adjusted_sol_amt_from_token_input as u64
                ),
                &[
                    system_program_info.clone(),
                    pda_associated_sol_info.clone(),
                    payer_info.clone()
                ],
                &[&[
                    &pda_info.key.to_bytes(),
                    &[swap_state.bump_seed_sol]
                ]]
            )?;
    
            invoke(
                &spl_token::instruction::burn(
                    token_program_info.key,
                    payer_associated_token_address_info.key,
                    mint_info.key,
                    payer_info.key,
                    &[],
                    amount_in as u64
                )?,
                &[
                    token_program_info.clone(),
                    payer_associated_token_address_info.clone(),
                    mint_info.clone(),
                    payer_info.clone()
                ]
            )?;
        Ok(())
    }

    pub fn change_page_fee(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        fee: u16,
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();

    // Accounts

        let fee_collector_info = next_account_info(account_info_iter)?;
        let new_fee_collector_info = next_account_info(account_info_iter)?;
        let pda_info = next_account_info(account_info_iter)?;
        let mint_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;

    // Variables
        let mut swap_state = PageTokenSwap::unpack(&pda_info.data.borrow())?;
        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;
    // Checks
        if !fee_collector_info.is_signer {
            return Err(VisionError::InvalidFeeAccount.into());
        }
        if *fee_collector_info.owner != system_program::ID{
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }
        if *fee_collector_info.key != swap_state.fee_collector_pubkey{
            return Err(VisionError::InvalidAccountAddress.into());
        }

        if (new_fee_collector_info.lamports() > 0) && (*new_fee_collector_info.owner != system_program::ID){
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }

        if *pda_info.owner != *program_id{
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }
        if *pda_info.key != (Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[swap_state.bump_seed]], program_id)?) {
            return Err(VisionError::InvalidAccountAddress.into());
        }

        if *mint_info.owner != spl_token::ID {
            return Err(VisionError::InvalidAccountOnwerProgram.into());
        }
        if !mint_state.is_initialized {
            return Err(VisionError::InvalidMint.into());
        }
        if COption::Some(*pda_info.key) != mint_state.mint_authority {
            return Err(VisionError::InvalidMint.into());
        }

        if *system_program_info.key != system_program::ID{
            return Err(VisionError::InvalidProgramAddress.into());
        }

        if new_fee_collector_info.lamports() == 0 {
            invoke(
                &system_instruction::transfer(
                    fee_collector_info.key,
                    new_fee_collector_info.key,
                    (Rent::get()?).minimum_balance(0 as usize),
                ),
                &[
                    fee_collector_info.clone(),
                    new_fee_collector_info.clone(),
                    system_program_info.clone()
                ]
            )?;
        }

    // EXECUTION
        if (fee_collector_info.key != new_fee_collector_info.key){
            swap_state.fee_collector_pubkey = *new_fee_collector_info.key;
        }

        if (fee != swap_state.fee){
            if (fee > 50000) || (fee < 0){
                return Err(VisionError::InvalidFee.into());
            }else{
                swap_state.fee = fee;
            }
        }

        PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;
    
        Ok(())
    }

    

    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8]
    ) -> ProgramResult {
        let instruction = VisionInstruction::unpack(instruction_data)?;

        match instruction {
            VisionInstruction::Initialize() => {
                Self::initialize_page_token(program_id, accounts)
            }
            VisionInstruction::Buy(Amount { amount_in, minimum_amount_out }) => {
                Self::buy(program_id, accounts, amount_in, minimum_amount_out)
            }
            VisionInstruction::Sell(Amount { amount_in, minimum_amount_out }) => {
                Self::sell(program_id, accounts, amount_in, minimum_amount_out)
            }
            VisionInstruction::ChangeFee(Fee { fee }) => {
                Self::change_page_fee(program_id, accounts, fee)
            }
        }
    }
}

impl PrintProgramError for VisionError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
    {
        match self {
            VisionError::SignatureRequired => {
                msg!("Error: Submitted Transaction is missing a signature")
            },
            VisionError::AlreadyInUse => msg!("Error: Keypair already in use"),
            VisionError::InvalidAccountAddress => msg!("Error: Invalid Account Address Provided"),
            VisionError::InvalidProgramAddress => {
                msg!("Error: Invalid program id")
            },
            VisionError::InvalidAccountOnwerProgram => msg!("Error: Invalid Account Owner Program"),
            VisionError::ExceededSlippage => {
                msg!("Error: Swap instruction exceeds desired slippage limit")
            },
            VisionError::InvalidMint=> {
                msg!("Error: Invalid Mint")
            },
            VisionError::InvalidInput => msg!("Error: Invalid User Input"),
            VisionError::ReserveError => msg!("Error: Reserve error"),
            


            VisionError::InvalidInstruction => msg!("Error: InvalidInstruction"),
            VisionError::InvalidFeeAccount => msg!("Error: Invalid fee account"),
            VisionError::InvalidAssociatedPdaTokenAddress => {
                msg!("Error: Invalid pda associated token address")
            },
            VisionError::InvalidAssociatedSwapperTokenAddress => {
                msg!("Error: Invalid swapper associated token address")
            },
            VisionError::InvalidTokenAmount => {
                msg!("Error: Invalid Token Amount - Contract would hold less than 1 Token")
            },
            VisionError::InvalidSolAmount => {
                msg!("Error: Invalid Token Amount - Contract would hold less than 1 Token(36sol)")
            },
            VisionError::IncorrectSwapAccount => {
                msg!("Error: Address of the provided swap token account is incorrect")
            },
            VisionError::ZeroTradingTokens => {
                msg!("Error: Given pool token amount results in zero trading tokens")
            },
            VisionError::ExceededSlippage => {
                msg!("Error: Swap instruction exceeds desired slippage limit")
            },
            VisionError::InvalidFee => {
                msg!("Error: Invalid Fee provided")
            },
            VisionError::ConversionFailure => msg!("Error: Conversion to or from u64 failed."),
            VisionError::Overflow => msg!("Error: Operation overflowed.")
        }
    }
}