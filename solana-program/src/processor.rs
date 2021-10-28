use solana_program::{
    account_info::{next_account_info, AccountInfo},
    decode_error::DecodeError,
    entrypoint::ProgramResult,
    system_instruction,
    msg,
    program::invoke,
    program_error::{PrintProgramError, ProgramError},
    program_option::COption,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_instruction::create_account
};
use num_traits::FromPrimitive;
use crate::{
    error::VisionError,
    instruction::VisionInstruction,
};
use spl_token::{
    state::{Account, Mint},
    instruction::{initialize_mint, initialize_account, mint_to}
};

pub struct Processor {}
impl Processor {

    pub fn initialize_page_token(
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();
        let payer_info = next_account_info(account_info_iter)?;
        let new_mint_account_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let new_hodler_account_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        let rent_info = next_account_info(account_info_iter)?;
        /// Create Mint Account
        let required_mint_lamports = Rent::get()?.minimum_balance(Mint::LEN);
        msg!("Transfer {} lamports to the new account", required_mint_lamports);
        invoke(
            &create_account(
                payer_info.key,
                new_mint_account_info.key,
                required_mint_lamports,
                Mint::LEN as u64,
                token_program_info.key,
            ),
            &[
                payer_info.clone(),
                new_mint_account_info.clone(),
                system_program_info.clone(),
                token_program_info.clone()
            ]
        )?;

 /// !!!--> INSERT -> Amm PDA that holds tokens

        /// Create Hodler account / Initiator Account

        let required_account_mint_hodler_lamports = Rent::get()?.minimum_balance(Account::LEN);

        invoke(
            &create_account(
                payer_info.key,
                new_hodler_account_info.key,
                required_account_mint_hodler_lamports,
                Account::LEN as u64,
                token_program_info.key,
            ),
            &[
                payer_info.clone(),
                new_hodler_account_info.clone(),
                system_program_info.clone(),
                token_program_info.clone()
            ]
        )?;

        /// Mint token & to account

        invoke(
            &initialize_mint(
                token_program_info.key,
                new_mint_account_info.key,
                payer_info.key,
                None,
                0
            )?,
            &[
                token_program_info.clone(),
                new_mint_account_info.clone(),
                payer_info.clone(),
                rent_info.clone()
            ]
        )?;

        invoke(
            &initialize_account(
                token_program_info.key,
                new_hodler_account_info.key,
                new_mint_account_info.key,
                payer_info.key
            )?,
            &[
                token_program_info.clone(),
                new_hodler_account_info.clone(),
                new_mint_account_info.clone(),
                payer_info.clone(),
                rent_info.clone()
            ]
        )?;

        invoke(
            &mint_to(
                token_program_info.key,
                new_mint_account_info.key,
                new_hodler_account_info.key,
                payer_info.key,
                &[],
                1000000 as u64
            )?,
            &[
                token_program_info.clone(),
                new_mint_account_info.clone(),
                new_hodler_account_info.clone(),
                payer_info.clone()
            ]
        )?;

        msg!("MINTING FINISHED {:?}", new_mint_account_info);

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
                Self::initialize_page_token(accounts)
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
        }
    }
}