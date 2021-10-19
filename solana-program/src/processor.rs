use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg,
};
use crate::instruction::SwapInstruction;

use crate::{error::SwapError, instruction::EscrowInstruction}

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = SwapInstruction::unpack(instruction_data)?;

        match instruction{
            SwapInstruction::InitSwap(Initialize {fee} => {
                msg!("Instruction: InitSwap")
                Self::process_init_escrow(accounts, fee, program_id)
            })
        }
    }

    fn process_init_escrow(
        accounts: &[AccountInfo],
        fee: u64,
        program_id: &Pubkey
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let token_swap_account = next_account_info(account_info_iter)?;

        if !token_swap_account.is_signer{
            return Err(ProgramError::MissingRequiredSignature);
        }

        

    }
}