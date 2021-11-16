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
    state::PageTokenSwap,
    error::VisionError,
    instruction::{VisionInstruction, Swap},
};
use spl_token::{
    state::{Account, Mint}
};
use spl_associated_token_account;

pub struct Processor {}
impl Processor {
    pub fn initialize_page_token(
        program_id: &Pubkey,
        accounts: &[AccountInfo]
    ) -> Result<(), ProgramError>{
    /// Accounts
        let account_info_iter = &mut accounts.iter();
        let payer_info = next_account_info(account_info_iter)?; /// Signer & Writable
        let new_mint_info = next_account_info(account_info_iter)?; /// Signer & Writable
        let pda_info = next_account_info(account_info_iter)?; /// Writable
        let pda_associated_token_info = next_account_info(account_info_iter)?; /// Writable
        let system_program_info = next_account_info(account_info_iter)?; /// X
        let associated_token_program_info = next_account_info(account_info_iter)?; /// X
        let token_program_info = next_account_info(account_info_iter)?; /// X
        let rent_sysvar_info = next_account_info(account_info_iter)?; /// X
        let fee_collector_info = next_account_info(account_info_iter)?; /// X

    /// Variables
        let rent = Rent::get()?;

    /// Checks
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
    ///
    /// MAIN
    /// 
    /// Create PDA Account & store State in it
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
        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        swap_state.is_initialized = true;
        swap_state.bump_seed = bump_seed;
        swap_state.fee = 5000;
        swap_state.fee_collector_pubkey = *fee_collector_info.key;
        PageTokenSwap::pack(swap_state, &mut pda_info.data.borrow_mut())?;
    /// Mint Token
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
    /// Create and Mint To associated token program address of Pda and Remove Minting authority
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
                6900420000000000000 as u64
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
        invoke_signed(
            &spl_token::instruction::set_authority(
                token_program_info.key,
                new_mint_info.key,
                None,
                spl_token::instruction::AuthorityType::MintTokens,
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

    // FINISHED
        Ok(())

    }

    pub fn swap(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount_in: u64,
        minimum_amount_out: u64
    ) -> Result<(), ProgramError> {
        let account_info_iter = &mut accounts.iter();
    /// Accounts
        let wallet_info = next_account_info(account_info_iter)?; /// Signer
        let wallet_associated_token_info = next_account_info(account_info_iter)?; /// Writable
        let pda_info = next_account_info(account_info_iter)?; /// Writable
        let pda_associated_token_info = next_account_info(account_info_iter)?; /// Writable
        let new_mint_info = next_account_info(account_info_iter)?;  /// X
        let system_program_info = next_account_info(account_info_iter)?; /// X
        let associated_token_program_info = next_account_info(account_info_iter)?; /// X
        let token_program_info = next_account_info(account_info_iter)?; /// X
        let rent_sysvar_info = next_account_info(account_info_iter)?; /// X
    
    /// Check
        if spl_associated_token_account::get_associated_token_address(pda_info.key, new_mint_info.key) != *pda_associated_token_info.key{
            return Err(VisionError::InvalidAssociatedPdaTokenAddress.into());
        }

        let mut swap_state = PageTokenSwap::unpack_unchecked(&pda_info.data.borrow())?;
        msg!("Fee collector: {:?}", swap_state.fee_collector_pubkey);
    ///
    /// MAIN
        if wallet_associated_token_info.lamports() == 0 {
            invoke(
                &spl_associated_token_account::create_associated_token_account(
                    wallet_info.key,
                    wallet_info.key,
                    new_mint_info.key
                ),
                &[
                    wallet_info.clone(),
                    wallet_associated_token_info.clone(),
                    wallet_info.clone(),
                    new_mint_info.clone(),
                    system_program_info.clone(),
                    token_program_info.clone(),
                    rent_sysvar_info.clone(),
                    associated_token_program_info.clone()
                ]
            )?;
        }

        let (pda, bump_seed) = Pubkey::find_program_address(&[&new_mint_info.key.to_bytes()], program_id);

        if pda != *pda_info.key{
            return Err(VisionError::IncorrectSwapAccount.into());
        }

        invoke_signed(
            &spl_token::instruction::transfer(
                &spl_token::id(),
                pda_associated_token_info.key,
                wallet_associated_token_info.key,
                pda_info.key,
                &[],
                50000000000 as u64
            )?,
            &[
                token_program_info.clone(),
                pda_associated_token_info.clone(),
                wallet_associated_token_info.clone(),
                pda_info.clone()
            ],
            &[&[
                &new_mint_info.key.to_bytes(),
                &[bump_seed]
            ]]
        )?;

        invoke(
            &solana_program::system_instruction::transfer(
                wallet_info.key,
                pda_info.key,
                5000000000 as u64,
            ),
            &[
                system_program_info.clone(),
                wallet_info.clone(),
                pda_info.clone()
            ]
        )?;


        Ok(())

        
    }

    // pub fn swap(
    //     program_id: &Pubkey,
    //     accounts: &[AccountInfo],
    //     amount_in: u64,
    //     minimum_amount_out: u64
    // ) -> Result<(), ProgramError> {
    //     let account_info_iter = &mut accounts.iter();

    //     let wallet_info = next_account_info(account_info_iter)?;
    //     let wallet_associated_token_info = next_account_info(account_info_iter)?;
    //     let pda_info = next_account_info(account_info_iter)?;
    //     let pda_associated_token_info = next_account_info(account_info_iter)?;
    //     let mint_info = next_account_info(account_info_iter)?;
    //     let token_program_info = next_account_info(account_info_iter)?;
    //     let system_program_info = next_account_info(account_info_iter)?;
    //     let rent_info = next_account_info(account_info_iter)?;

        
    //     let (pda, bump_seed) = Pubkey::find_program_address(&[&mint_info.key.to_bytes()], program_id);

    //     if *pda_info.key != pda {
    //         return Err(VisionError::InvalidProgramAddress.into());
    //     }

    //     let get_wallet_associated_token_info = spl_associated_token_account::get_associated_token_address(wallet_info.key, mint_info.key);

    //     if *wallet_associated_token_info.key != get_wallet_associated_token_info {
    //         return Err(VisionError::IncorrectSwapAccount.into());
    //     }

        
    //     if wallet_associated_token_info.lamports() == 0 {
    //         invoke(
    //             &spl_associated_token_account::create_associated_token_account(
    //                 wallet_info.key,
    //                 wallet_info.key,
    //                 mint_info.key
    //             ),
    //             &[
    //                 wallet_info.clone(),
    //                 wallet_associated_token_info.clone(),
    //                 mint_info.clone(),
    //                 system_program_info.clone(),
    //                 token_program_info.clone(),
    //                 rent_info.clone()
    //             ]
    //         )?;
    //     }

    //     let get_pda_associated_token_info = spl_associated_token_account::get_associated_token_address(pda_info.key, mint_info.key);

    //     if *pda_associated_token_info.key != get_pda_associated_token_info {
    //         return Err(VisionError::IncorrectSwapAccount.into());
    //     }

    //     invoke_signed(
    //         &spl_token::instruction::transfer(
    //             &spl_token::id(),
    //             pda_associated_token_info.key,
    //             wallet_associated_token_info.key,
    //             pda_info.key,
    //             &[],
    //             50
    //         )?,
    //         &[
    //             token_program_info.clone(),
    //             pda_associated_token_info.clone(),
    //             wallet_associated_token_info.clone(),
    //             pda_info.clone()
    //         ],
    //         &[&[
    //             &mint_info.key.to_bytes(),
    //             &[bump_seed]
    //         ]]
    //     )?;

    //     invoke(
    //         &solana_program::system_instruction::transfer(
    //             wallet_info.key,
    //             pda_info.key,
    //             500000 as u64,
    //         ),
    //         &[
    //             system_program_info.clone(),
    //             wallet_info.clone(),
    //             pda_info.clone()
    //         ]
    //     )?;

    //     Ok(())
    // }

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
            },
            VisionError::IncorrectSwapAccount => {
                msg!("Error: Address of the provided swap token account is incorrect")
            }
        }
    }
}