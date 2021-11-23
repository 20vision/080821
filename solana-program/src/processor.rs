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
    instruction::{VisionInstruction, Swap},
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
        if fee_collector_info.lamports() == 0{
            return Err(VisionError::IncorrectSwapAccount.into());
        }
    //
    // MAIN
    // 
    //Create PDA Account & store State in it

        // Collateral for one single token is 31 Lamports
        //m*CW*tokenSupply^(1/CW)*10^9 = collateral
        let collateral = 31 as u64;
        let collateral_rent = collateral.checked_add(rent.minimum_balance(PageTokenSwap::LEN)).ok_or(VisionError::Overflow)?;
        invoke_signed(
            &system_instruction::create_account(
                payer_info.key,
                pda_info.key,
                collateral_rent,
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
        swap_state.is_initialized = true;
        swap_state.bump_seed = bump_seed;
        swap_state.fee = 5000;
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
                1 as u64
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

    pub fn swap(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount_in: u64,
        minimum_amount_out: u64
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();
        
        let payer_info = next_account_info(account_info_iter)?; // Signer & Writable
        let payer_associated_token_address_info = next_account_info(account_info_iter)?; // Writable
        let pda_info = next_account_info(account_info_iter)?; // Writable
        let mint_info = next_account_info(account_info_iter)?; // Writable
        let system_program_info = next_account_info(account_info_iter)?; // X
        let associated_token_program_info = next_account_info(account_info_iter)?; // X
        let token_program_info = next_account_info(account_info_iter)?; // X
        let rent_sysvar_info = next_account_info(account_info_iter)?; // X

        let rent = Rent::get()?;

    // VARIABLES
        let swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        let bump_seed = swap_state.bump_seed as u8;
        let pda_info_derived = &Pubkey::create_program_address(&[&mint_info.key.to_bytes(), &[bump_seed]], program_id)?;

        if pda_info_derived != pda_info.key{
            return Err(VisionError::InvalidProgramAddress.into());
        }
        
    // tokenSupply * ((1+amtPaid/colleteral)^CW -1)

        let mint_state = spl_token::state::Mint::unpack(&mint_info.data.borrow())?;
        let token_supply = mint_state.supply as u128;
        let rent_payed = rent.minimum_balance(PageTokenSwap::LEN);
        let collateral = pda_info.lamports().checked_sub(rent_payed).ok_or(VisionError::Overflow)?;
        let division = ((((1f64 + amount_in as f64).powf(0.60606f64)) / ((collateral as f64).powf(0.60606f64))) - 1f64).round() as u128;
        let result = division.checked_mul(token_supply).ok_or(VisionError::Overflow)?;
        msg!("result {:?}", result);

        if result < minimum_amount_out as u128 {
            return Err(VisionError::ExceededSlippage.into());
        }

        if spl_associated_token_account::get_associated_token_address(payer_info.key, mint_info.key) != *payer_associated_token_address_info.key{
            return Err(VisionError::InvalidAssociatedSwapperTokenAddress.into());
        }

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
                result as u64
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
                pda_info.key,
                amount_in as u64
            ),
            &[
                system_program_info.clone(),
                payer_info.clone(),
                pda_info.clone()
            ]
        )?;

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
            VisionInstruction::Swap(Swap { amount_in, minimum_amount_out }) => {
                Self::swap(program_id, accounts, amount_in, minimum_amount_out)
            }
        }
    }
}

fn to_u128(val: u64) -> Result<u128, VisionError> {
    val.try_into().map_err(|_| VisionError::ConversionFailure)
}

fn to_f64(val: i32) -> Result<f64, VisionError> {
    val.try_into().map_err(|_| VisionError::ConversionFailure)
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
            VisionError::InvalidAssociatedPdaTokenAddress => {
                msg!("Error: Invalid pda associated token address")
            },
            VisionError::InvalidAssociatedSwapperTokenAddress => {
                msg!("Error: Invalid swapper associated token address")
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
            VisionError::ConversionFailure => msg!("Error: Conversion to or from u64 failed."),
            VisionError::Overflow => msg!("Error: Operation overflowed.")
        }
    }
}