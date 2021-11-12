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
    system_instruction::create_account
};
use num_traits::FromPrimitive;
use crate::{
    state::PageTokenSwap,
    error::VisionError,
    instruction::{VisionInstruction, Swap},
};
use spl_token::{
    state::{Account, Mint},
    instruction::{initialize_mint, initialize_account, mint_to, set_authority, AuthorityType}
};
use spl_associated_token_account::{create_associated_token_account, get_associated_token_address};

pub struct Processor {}
impl Processor {

    pub fn initialize_page_token(
        program_id: &Pubkey,
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError> {
        msg!("It worked1");
        let account_info_iter = &mut accounts.iter();

        let payer_info = next_account_info(account_info_iter)?;
        let new_mint_info = next_account_info(account_info_iter)?;
        let pda_mint_account_info = next_account_info(account_info_iter)?;
        let pda_info = next_account_info(account_info_iter)?;
        let fee_collector_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let associated_token_program_info = next_account_info(account_info_iter)?;
        let rent_info = next_account_info(account_info_iter)?;
        
        /// Check PDA
        if pda_info.lamports() > 0 {
            return Err(VisionError::AlreadyInUse.into());
        }

        let (pda, bump_seed) = Pubkey::find_program_address(&[&new_mint_info.key.to_bytes()], program_id);

        if *pda_info.key != pda {
            return Err(VisionError::InvalidProgramAddress.into());
        }

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

        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;

        swap_state.is_initialized = true;
        swap_state.bump_seed = bump_seed;
        swap_state.fee = 5000;
        swap_state.fee_collector_pubkey = *fee_collector_info.key;

        PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;
        
        msg!("It worked 2: {:?}", pda_info.key);
        
        /// Mint Page Token

        invoke(
            &create_account(
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

        invoke_signed(
            &initialize_mint(
                token_program_info.key,
                new_mint_info.key,
                pda_info.key,
                None,
                18
            )?,
            &[
                token_program_info.clone(),
                new_mint_info.clone(),
                pda_info.clone(),
                rent_info.clone()
            ],
            &[&[
                &new_mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
        )?;
        
// Check if Token Program and associated token client infos program all fit with On chain ID's

        /// Mint to pda
        let associated_token_address = get_associated_token_address(pda_info.key,new_mint_info.key);
        if associated_token_address != *pda_mint_account_info.key {
            return Err(VisionError::InvalidAssociatedPdaTokenAddress.into());
        }

        invoke_signed(
            &create_associated_token_account(
                payer_info.key,
                pda_info.key,
                new_mint_info.key
            ),
            &[
                payer_info.clone(),
                pda_info.clone(),
                new_mint_info.clone(),
                pda_mint_account_info.clone()
            ],
            &[&[
                &new_mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
        )?;

        invoke(
            &initialize_account(
                token_program_info.key,
                pda_mint_account_info.key,
                new_mint_info.key,
                pda_info.key
            )?,
            &[
                token_program_info.clone(),
                pda_mint_account_info.clone(),
                new_mint_info.clone(),
                pda_info.clone(),
                rent_info.clone()
            ]
        )?;

        invoke_signed(
            &mint_to(
                token_program_info.key,
                new_mint_info.key,
                pda_mint_account_info.key,
                pda_info.key,
                &[],
                6900420000 as u64
            )?,
            &[
                token_program_info.clone(),
                new_mint_info.clone(),
                pda_mint_account_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &new_mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
        )?;

        invoke_signed(
            &set_authority(
                token_program_info.key,
                new_mint_info.key,
                None,
                AuthorityType::MintTokens,
                pda_info.key,
                &[]
            )?,
            &[
                token_program_info.clone(),
                new_mint_info.clone(),
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
        let user_info = next_account_info(account_info_iter)?;
        let user_token_account_info = next_account_info(account_info_iter)?;
        let pda_info = next_account_info(account_info_iter)?;
        let pda_token_account_info = next_account_info(account_info_iter)?;
        let mint_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;

        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;

        let pda = Pubkey::create_program_address(&[
            &mint_info.key.to_bytes(),
            &[swap_state.bump_seed]
        ], program_id)?;

        if *pda_info.key != pda {
            return Err(VisionError::InvalidProgramAddress.into());
        }

        invoke_signed(
            &spl_token::instruction::transfer(
                &spl_token::id(),
                pda_token_account_info.key,
                user_token_account_info.key,
                pda_info.key,
                &[],
                50
            )?,
            &[
                token_program_info.clone(),
                pda_token_account_info.clone(),
                user_token_account_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &mint_info.key.to_bytes(),
                &[swap_state.bump_seed]
            ]]
        )?;

        invoke(
            &solana_program::system_instruction::transfer(
                user_info.key,
                pda_info.key,
                500000 as u64,
            ),
            &[
                system_program_info.clone(),
                user_info.clone(),
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
            }
        }
    }
}