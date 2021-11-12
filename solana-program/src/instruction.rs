use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
    msg
};
use std::convert::TryInto;
use crate::error::VisionError;

pub struct Swap {
    /// SOURCE amount to transfer, output to DESTINATION is based on the exchange rate
    pub amount_in: u64,
    /// Minimum amount of DESTINATION token to output, prevents excessive slippage
    pub minimum_amount_out: u64,
}

pub enum VisionInstruction {
    Initialize(),
    Swap(Swap)
}

impl VisionInstruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError>{
        let (&tag, rest) = instruction_data.split_first().ok_or(VisionError::InvalidInstruction)?;
        msg!("Checking insturctions");
        Ok(match tag {
            0 => {
                Self::Initialize()
            }
            1 => {
                let (amount_in, rest) = Self::unpack_u64(rest)?;
                let (minimum_amount_out, _rest) = Self::unpack_u64(rest)?;
                Self::Swap(Swap { 
                    amount_in,
                    minimum_amount_out 
                })
            }
            _ => return Err(VisionError::InvalidInstruction.into()),
        })
    }

    fn unpack_u64(input: &[u8]) -> Result<(u64, &[u8]), ProgramError> {
        if input.len() >= 8 {
            let (amount, rest) = input.split_at(8);
            let amount = amount
                .get(..8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(VisionError::InvalidInstruction)?;
            Ok((amount, rest))
        } else {
            Err(VisionError::InvalidInstruction.into())
        }
    }
}