use solana_program::{
    account_info::{next_account_info, AccountInfo},
    decode_error::DecodeError,
    entrypoint::ProgramResult,
    system_instruction,
    msg,
    program::invoke_signed,
    program_error::{PrintProgramError, ProgramError},
    program_option::COption,
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_instruction::create_account
};
use num_traits::FromPrimitive;
use crate::{
    state::PageTokenSwap,
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
        program_id: &Pubkey,
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError> {
        msg!("It worked1");
        let account_info_iter = &mut accounts.iter();

        /// Payer
        let payer_info = next_account_info(account_info_iter)?;

        /// Mint Public Key
        let new_mint_info = next_account_info(account_info_iter)?;

        /// PDA
        let pda_info = next_account_info(account_info_iter)?;
        
        /// Check PDA
        if pda_info.lamports() > 0 {
            return Err(VisionError::AlreadyInUse.into());
        }

        let (pda, bump_seed) = Pubkey::find_program_address(&[&new_mint_info.key.to_bytes()], program_id);

        if *pda_info.key != pda {
            return Err(VisionError::InvalidProgramAddress.into());
        }

        /// Fee collector Pub Key
        let fee_collector_info = next_account_info(account_info_iter)?;

        /// Program Info of this Program id -> Needed for invoke_signed
        let system_program_info = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;

        /// Create PDA Account to store State in it
        invoke_signed(
            &create_account(
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

        // let mut pda_swap_info = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        // if pda_swap_info.is_initialized {
        //     return Err(VisionError::AlreadyInUse.into());
        // }
        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;

        swap_state.is_initialized = true;
        swap_state.bump_seed = bump_seed;
        swap_state.fee = 5000;
        swap_state.fee_collector_pubkey = *fee_collector_info.key;

        PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;
        
        msg!("It worked 2: {:?}", pda_info.key);

    /// OLD
    //     // let account_info_iter = &mut accounts.iter();
    //     // let payer_info = next_account_info(account_info_iter)?;
    //     // let new_mint_account_info = next_account_info(account_info_iter)?;
    //     // let token_program_info = next_account_info(account_info_iter)?;
    //     // let new_hodler_account_info = next_account_info(account_info_iter)?;
    //     // let system_program_info = next_account_info(account_info_iter)?;
    //     // let rent_info = next_account_info(account_info_iter)?;
        
    // /// Create Mint Account
    //     /// ! Check if funding amount == min rent balance
    //     let required_mint_lamports = Rent::get()?.minimum_balance(Mint::LEN);
    //     msg!("Transfer {} lamports to the new account", required_mint_lamports);
    //     invoke(
    //         &create_account(
    //             payer_info.key,
    //             new_mint_account_info.key,
    //             required_mint_lamports,
    //             Mint::LEN as u64,
    //             token_program_info.key,
    //         ),
    //         &[
    //             payer_info.clone(),
    //             new_mint_account_info.clone(),
    //             system_program_info.clone(),
    //             token_program_info.clone()
    //         ]
    //     )?;

    //     /// !!!--> INSERT -> Amm PDA that holds tokens

    // /// Create Hodler account / Initiator Account

    //     let required_account_mint_hodler_lamports = Rent::get()?.minimum_balance(Account::LEN);

    //     invoke(
    //         &create_account(
    //             payer_info.key,
    //             new_hodler_account_info.key,
    //             required_account_mint_hodler_lamports,
    //             Account::LEN as u64,
    //             token_program_info.key,
    //         ),
    //         &[
    //             payer_info.clone(),
    //             new_hodler_account_info.clone(),
    //             system_program_info.clone(),
    //             token_program_info.clone()
    //         ]
    //     )?;

    // /// Mint token & to account

    //     invoke(
    //         &initialize_mint(
    //             token_program_info.key,
    //             new_mint_account_info.key,
    //             payer_info.key,
    //             None,
    //             18
    //         )?,
    //         &[
    //             token_program_info.clone(),
    //             new_mint_account_info.clone(),
    //             payer_info.clone(),
    //             rent_info.clone()
    //         ]
    //     )?;

    //     invoke(
    //         &initialize_account(
    //             token_program_info.key,
    //             new_hodler_account_info.key,
    //             new_mint_account_info.key,
    //             payer_info.key
    //         )?,
    //         &[
    //             token_program_info.clone(),
    //             new_hodler_account_info.clone(),
    //             new_mint_account_info.clone(),
    //             payer_info.clone(),
    //             rent_info.clone()
    //         ]
    //     )?;

    //     invoke(
    //         &mint_to(
    //             token_program_info.key,
    //             new_mint_account_info.key,
    //             new_hodler_account_info.key,
    //             payer_info.key,
    //             &[],
    //             6900420000 as u64
    //         )?,
    //         &[
    //             token_program_info.clone(),
    //             new_mint_account_info.clone(),
    //             new_hodler_account_info.clone(),
    //             payer_info.clone()
    //         ]
    //     )?;

    //     msg!("MINTING FINISHED {:?}", new_mint_account_info);

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
            }
        }
    }
}