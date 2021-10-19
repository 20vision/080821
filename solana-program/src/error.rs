use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum SwapError{
    /// Invalid instruction
    #[error("Invalid instruction")]
    InvalidInstruction,
}

impl From<SwapError> fro ProgramError{
    fn from(e: SwapError) -> Self {
        ProgramError::Custom(e as u32)
    }
}