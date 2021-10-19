use solana_program::{
    program_error::ProgramError
};

use crate::utils::fee::validateFee;
use crate::error::SwapError;




pub struct InitializeStruct{
    //Fee owner receives
    pub fee: u64
}

pub enum SwapInstruction {
    /// Saves Parameters in token_swap_account and initializes to true
    /// 
    /// Accounts expected:
    /// 
    /// 0. `[writable, signer]` Token Swap Account holding the informations about token Swap
    /// 
    InitSwap(InitializeStruct)

}

impl SwapInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(SwapError::InvalidInstruction)?;
        Ok(match tag {
            0 => Self::InitSwap {
                fee: Self::unpack_fee(rest)?
            }
            ,
            _ => return Err(SwapError::InvalidInstruction.into())
        })
    }

    fn unpack_fee(input: &[u8]) -> Result<u64, ProgramError>{
        if input.len() >= 8 {
            let amount = amount
                .get(..8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(SwapError::InvalidInstruction)?;
            Ok((amount))
        }else{
            Err(SwapError::InvalidInstruction.into())
        }
    }
}