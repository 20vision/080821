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

pub struct Processor {}

impl Processor {
    pub fn initialize_page_token(
        program_id: &Pubkey,
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError>{
    // Accounts
        let account_info_iter = &mut accounts.iter();
        let payer_info = next_account_info(account_info_iter)?; // Signer & Writable
        let new_mint_info = next_account_info(account_info_iter)?; // Signer & Writable
        let pda_info = next_account_info(account_info_iter)?; // Writable
        let pda_associated_sol_info = next_account_info(account_info_iter)?; // Writable
        let pda_associated_token_info = next_account_info(account_info_iter)?; // Writable
        let system_program_info = next_account_info(account_info_iter)?; // X
        let associated_token_program_info = next_account_info(account_info_iter)?; // X
        let token_program_info = next_account_info(account_info_iter)?; // X
        let rent_sysvar_info = next_account_info(account_info_iter)?; // X
        let fee_collector_info = next_account_info(account_info_iter)?; // X

    // Variables
        let rent = Rent::get()?;

    // Checks
        if new_mint_info.lamports() > 0{
            return Err(VisionError::AlreadyInUse.into());
        }
        let (pda, bump_seed) = Pubkey::find_program_address(&[&new_mint_info.key.to_bytes()], program_id);
        let (pda_sol, bump_seed_sol) = Pubkey::find_program_address(&[&pda_info.key.to_bytes()], program_id);

        if pda_sol != *pda_associated_sol_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        if *pda_info.key != pda {
            return Err(VisionError::InvalidProgramAddress.into());
        }
        if pda_info.lamports() > 0{
            return Err(VisionError::AlreadyInUse.into());
        }
        if system_program::ID != *system_program_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        if spl_associated_token_account::ID != *associated_token_program_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        if spl_token::ID != *token_program_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        if spl_associated_token_account::get_associated_token_address(pda_info.key, new_mint_info.key) != *pda_associated_token_info.key{
            return Err(VisionError::InvalidAssociatedPdaTokenAddress.into());
        }
    //
    // MAIN
    // 
    //Create PDA Account & store State in it

        // Collateral for one single token is 31 Lamports
        //m*CW*tokenSupply^(1/CW)*10^9 = collateral
        let collateral = 36 as u64;
        msg!("rent: {:?}", rent.minimum_balance(0 as usize));
        let collateral_rent = collateral.checked_add(rent.minimum_balance(0 as usize)).ok_or(VisionError::Overflow)?;
        invoke_signed(
            &system_instruction::create_account(
                payer_info.key,
                pda_info.key,
                rent.minimum_balance(PageTokenSwap::LEN),
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
        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        swap_state.is_initialized = true;
        swap_state.bump_seed = bump_seed;
        swap_state.bump_seed_sol = bump_seed_sol;
        swap_state.fee = 2500;
        // Replace Fee collector with Program that distributes fee % towards multiple accounts
        swap_state.fee_collector_pubkey = *fee_collector_info.key;
        PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;
    // Mint Token
        invoke(
            &system_instruction::create_account(
                payer_info.key,
                new_mint_info.key,
                rent.minimum_balance(Mint::LEN),
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
    // Create and Mint To associated token program address of Pda and Remove Minting authority
        invoke(
            &spl_associated_token_account::create_associated_token_account(
                payer_info.key,
                pda_info.key,
                new_mint_info.key
            ),
            &[
                payer_info.clone(),
                pda_associated_token_info.clone(),
                pda_info.clone(),
                new_mint_info.clone(),
                system_program_info.clone(),
                token_program_info.clone(),
                rent_sysvar_info.clone(),
                associated_token_program_info.clone()
            ]
        )?;
        invoke_signed(
            &spl_token::instruction::mint_to(
                token_program_info.key,
                new_mint_info.key,
                pda_associated_token_info.key,
                pda_info.key,
                &[],
                1000000000 as u64
            )?,
            &[
                token_program_info.clone(),
                new_mint_info.clone(),
                pda_associated_token_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &new_mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
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
        
        let payer_info = next_account_info(account_info_iter)?; // Signer & Writable
        let payer_associated_token_address_info = next_account_info(account_info_iter)?; // Writable
        let page_fee_collector_info = next_account_info(account_info_iter)?; // Writable
        let provider_fee_collector_info = next_account_info(account_info_iter)?; // Writable
        let pda_info = next_account_info(account_info_iter)?; // Writable
        let pda_associated_sol_info = next_account_info(account_info_iter)?; // Writable
        let mint_info = next_account_info(account_info_iter)?; // Writable
        let system_program_info = next_account_info(account_info_iter)?; // X
        let associated_token_program_info = next_account_info(account_info_iter)?; // X
        let token_program_info = next_account_info(account_info_iter)?; // X
        let rent_sysvar_info = next_account_info(account_info_iter)?; // X

        let rent = Rent::get()?;

    // VARIABLES
        let swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        let bump_seed = swap_state.bump_seed as u8;
        let bump_seed_sol = swap_state.bump_seed_sol as u8;

        let pda_info_derived = &Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[bump_seed]], program_id)?;
        if pda_info_derived != pda_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        let pda_sol_info_derived = &Pubkey::create_program_address(&[&pda_info.key.to_bytes(), &[bump_seed_sol]], program_id)?;
        if pda_sol_info_derived != pda_associated_sol_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }

        let swap_state = PageTokenSwap::unpack(&pda_info.data.borrow())?;

// + Check if valid provider fee collector key
        if *page_fee_collector_info.key != swap_state.fee_collector_pubkey {
            return Err(VisionError::InvalidFeeAccount.into());
        }
    // tokenSupply * ((1+(amtPaid/colleteral))^CW -1)

        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;
        let token_supply = mint_state.supply;
        msg!("token_supply {:?}", token_supply);
        let rent_payed = rent.minimum_balance(0 as usize);
        let reserve_balance = pda_associated_sol_info.lamports().checked_sub(rent_payed).ok_or(VisionError::Overflow)?;
        msg!("reserve_balance {:?}", reserve_balance);
        let fee_provider = (0.01f64*(amount_in as f64)).round() as u64;
        msg!("fee_provider {:?}", fee_provider);
        let fee_page = (((swap_state.fee as f64)/ 100000f64)*(amount_in as f64)).round() as u64;
        msg!("fee_page {:?}", fee_page);
        let fee = fee_provider.checked_add(fee_page).ok_or(VisionError::Overflow)?;
        let adjusted_amount_in = amount_in.checked_sub(fee).ok_or(VisionError::Overflow)?;
        msg!("adjusted_amount_in {:?}", adjusted_amount_in);

        // Bancor formula: https://docs.bancor.network/ethereum-contracts/ethereum-api-reference/converter/bancorformula#bancorformula-calculatesalereturn-uint256-uint256-uint32-uint256
        let buy_token_amt = ((token_supply as f64) * ((1f64 + ((adjusted_amount_in as f64) / (reserve_balance as f64))).powf(0.60976f64) - 1f64)).round() as u64;
        msg!("buy_token_amt {:?}", buy_token_amt);

        if buy_token_amt < minimum_amount_out {
            return Err(VisionError::ExceededSlippage.into());
        }

        if spl_associated_token_account::get_associated_token_address(payer_info.key, mint_info.key) != *payer_associated_token_address_info.key{
            return Err(VisionError::InvalidAssociatedSwapperTokenAddress.into());
        }
// If token account does not exist subtract amount needed for rent on calculation
        invoke(
            &spl_associated_token_account::create_associated_token_account(
                payer_info.key,
                payer_info.key,
                mint_info.key
            ),
            &[
                payer_info.clone(),
                payer_associated_token_address_info.clone(),
                payer_info.clone(),
                mint_info.clone(),
                system_program_info.clone(),
                token_program_info.clone(),
                rent_sysvar_info.clone(),
                associated_token_program_info.clone()
            ]
        )?;

        invoke_signed(
            &spl_token::instruction::mint_to(
                token_program_info.key,
                mint_info.key,
                payer_associated_token_address_info.key,
                pda_info.key,
                &[],
                buy_token_amt as u64
            )?,
            &[
                token_program_info.clone(),
                mint_info.clone(),
                payer_associated_token_address_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
        )?;

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

        invoke(
            &system_instruction::transfer(
                payer_info.key,
                provider_fee_collector_info.key,
                fee_provider as u64
            ),
            &[
                system_program_info.clone(),
                payer_info.clone(),
                provider_fee_collector_info.clone()
            ]
        )?;

        invoke(
            &system_instruction::transfer(
                payer_info.key,
                page_fee_collector_info.key,
                fee_page as u64
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
        
        let seller_info = next_account_info(account_info_iter)?; // Signer & Writable
        let seller_associated_token_address_info = next_account_info(account_info_iter)?; // Writable
        let provider_fee_collector_info = next_account_info(account_info_iter)?; // Writable
        let pda_info = next_account_info(account_info_iter)?; // Writable
        let pda_associated_sol_info = next_account_info(account_info_iter)?; // Writable
        let mint_info = next_account_info(account_info_iter)?; // Writable
        let system_program_info = next_account_info(account_info_iter)?; // X
        let token_program_info = next_account_info(account_info_iter)?; // X

        let rent = Rent::get()?;

        if seller_associated_token_address_info.lamports() == 0 {
            return Err(VisionError::InvalidAssociatedSwapperTokenAddress.into());
        }
        if spl_associated_token_account::get_associated_token_address(seller_info.key, mint_info.key) != *seller_associated_token_address_info.key{
            return Err(VisionError::InvalidAssociatedSwapperTokenAddress.into());
        }

        let swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        let bump_seed = swap_state.bump_seed as u8;
        let bump_seed_sol = swap_state.bump_seed_sol as u8;

        let pda_info_derived = &Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[bump_seed]], program_id)?;
        if pda_info_derived != pda_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        let pda_sol_info_derived = &Pubkey::create_program_address(&[&pda_info.key.to_bytes(), &[bump_seed_sol]], program_id)?;
        if pda_sol_info_derived != pda_associated_sol_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }

        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;

        if (amount_in as u64) > ((mint_state.supply as u64).checked_sub(1000000000u64).ok_or(VisionError::Overflow)?) {
            return Err(VisionError::InvalidTokenAmount.into());
        }

        msg!("tokenSupply {:?}", mint_state.supply);
        msg!("amount_in {:?}", amount_in);

        let rent_payed = rent.minimum_balance(0 as usize);
        msg!("rent_payed {:?}", rent_payed);
        let reserve_balance = pda_associated_sol_info.lamports().checked_sub(rent_payed).ok_or(VisionError::Overflow)?;
        msg!("reserve_balance {:?}", reserve_balance);

        let sell_sol_amt = ((reserve_balance as f64) * (1f64 - (1f64 - (amount_in as f64) / (mint_state.supply as f64)).powf(1f64 / 0.60976f64))).round() as u64;
        msg!("sell_sol_amt {:?}", sell_sol_amt);

        // let numerator = (1f64 + amount_in as f64).powf(1f64/0.60976f64);
        // msg!("numerator {:?}", numerator);
        // let denominator = (mint_state.supply as f64).powf(1f64/0.60976f64);
        // msg!("denominator {:?}", denominator);
    
        // let result = (((numerator / denominator)- 1f64) * collateral as f64) * (-1f64);
        // msg!("result {:?}", result);
        // let result_u128 = result.round() as u128;
        // msg!("result_u128 {:?}", result_u128);
        if (sell_sol_amt as u64) > ((reserve_balance as u64).checked_sub(36u64).ok_or(VisionError::Overflow)?) {
            return Err(VisionError::InvalidSolAmount.into());
        }

        let fee_provider = (0.01f64*(sell_sol_amt as f64)).round() as u64;

        let adjusted_sell_sol_amt = sell_sol_amt.checked_sub(fee_provider as u64).ok_or(VisionError::Overflow)?;
        msg!("adjusted_sell_sol_amt {:?}", adjusted_sell_sol_amt);

        if adjusted_sell_sol_amt < (minimum_amount_out as u64) {
            return Err(VisionError::ExceededSlippage.into());
        }

        msg!("pda_associated_sol_info: {:?}", pda_associated_sol_info.key);
        msg!("pda_info: {:?}", pda_info.key);

        invoke_signed(
            &system_instruction::transfer(
                pda_associated_sol_info.key,
                provider_fee_collector_info.key,
                fee_provider as u64
            ),
            &[
                system_program_info.clone(),
                pda_associated_sol_info.clone(),
                provider_fee_collector_info.clone()
            ],
            &[&[
                &pda_info.key.to_bytes(),
                &[bump_seed_sol]
            ]]
        )?;

        invoke_signed(
            &system_instruction::transfer(
                pda_associated_sol_info.key,
                seller_info.key,
                adjusted_sell_sol_amt as u64
            ),
            &[
                system_program_info.clone(),
                pda_associated_sol_info.clone(),
                seller_info.clone()
            ],
            &[&[
                &pda_info.key.to_bytes(),
                &[bump_seed_sol]
            ]]
        )?;

        invoke(
            &spl_token::instruction::burn(
                token_program_info.key,
                seller_associated_token_address_info.key,
                mint_info.key,
                seller_info.key,
                &[],
                amount_in as u64
            )?,
            &[
                token_program_info.clone(),
                seller_associated_token_address_info.clone(),
                mint_info.clone(),
                seller_info.clone()
            ]
        )?;

        // if amount_in == (spl_token::state::Account::unpack(&seller_associated_token_address_info.data.borrow())?).amount {
        //     invoke(
        //         &spl_token::instruction::close_account(
        //             token_program_info.key,
        //             seller_associated_token_address_info.key,
        //             seller_info.key,
        //             seller_info.key,
        //             &[],
        //         )?,
        //         &[
        //             token_program_info.clone(),
        //             system_program_info.clone(),
        //             seller_associated_token_address_info.clone(),
        //             seller_info.clone()
        //         ]
        //     )?;
        // }
        invoke(
            &spl_token::instruction::close_account(
                token_program_info.key,
                seller_associated_token_address_info.key,
                seller_info.key,
                seller_info.key,
                &[],
            )?,
            &[
                token_program_info.clone(),
                system_program_info.clone(),
                seller_associated_token_address_info.clone(),
                seller_info.clone()
            ]
        )?;
        

        Ok(())

// Close Spl Account if selling all Tokens

    }

    pub fn change_page_fee(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        fee: u16,
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();

        let fee_collector_info = next_account_info(account_info_iter)?; // Signer & Writable
        let new_fee_collector_info = next_account_info(account_info_iter)?; // Writable
        let pda_info = next_account_info(account_info_iter)?; // Writable
        let mint_info = next_account_info(account_info_iter)?; // X
        let system_program_info = next_account_info(account_info_iter)?; // X

        let rent = Rent::get()?;

        if !fee_collector_info.is_signer {
            return Err(VisionError::InvalidFeeAccount.into());
        }

        if new_fee_collector_info.lamports() == 0 {
            invoke(
                &system_instruction::transfer(
                    fee_collector_info.key,
                    new_fee_collector_info.key,
                    rent.minimum_balance(0 as usize),
                ),
                &[
                    fee_collector_info.clone(),
                    new_fee_collector_info.clone(),
                    system_program_info.clone()
                ]
            )?;
        }

        let mut swap_state = PageTokenSwap::unpack(&pda_info.data.borrow())?;

        let (pda, bump_seed) = Pubkey::find_program_address(&[&mint_info.key.to_bytes()], program_id);

        if *pda_info.key != pda {
            return Err(VisionError::InvalidProgramAddress.into());
        }

        if swap_state.fee_collector_pubkey != *fee_collector_info.key {
            return Err(VisionError::InvalidFeeAccount.into());
        }

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
            VisionError::InvalidInstruction => msg!("Error: InvalidInstruction"),
            VisionError::AlreadyInUse => msg!("Error: Swap account already in use"),
            VisionError::InvalidProgramAddress => {
                msg!("Error: Invalid program address generated from bump seed and key")
            },
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