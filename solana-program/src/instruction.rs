use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
    msg
};
use crate::error::VisionError;

pub struct Initialize {
    pub space: u64,
    pub owner: &Pubkey
}

pub enum VisionInstruction {
    Initialize(Initialize)
}

impl VisionInstruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError>{
        let (&tag, rest) = instruction_data.split_first().ok_or(VisionError::InvalidInstruction)?;
        Ok(match tag {
            0 => {
                Self::Initialize(Initialize{ space, owner })
            }
            _ => return Err(VisionError::InvalidInstruction.into()),
        })
    }
}