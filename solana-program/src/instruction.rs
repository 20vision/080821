use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
    msg
};
use crate::error::VisionError;

pub enum VisionInstruction {
    Initialize()
}

impl VisionInstruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError>{
        let (&tag, rest) = instruction_data.split_first().ok_or(VisionError::InvalidInstruction)?;
        msg!("Checking insturctions");
        Ok(match tag {
            0 => {
                Self::Initialize()
            }
            _ => return Err(VisionError::InvalidInstruction.into()),
        })
    }
}