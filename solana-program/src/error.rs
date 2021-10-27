//! Error types

use num_derive::FromPrimitive;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

/// Errors that may be returned by the Token program.
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum VisionError {
    // Invalid instruction number passed in.
    #[error("Invalid instruction")]
    InvalidInstruction,
}
impl From<VisionError> for ProgramError {
    fn from(e: VisionError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for VisionError {
    fn type_of() -> &'static str {
        "VisionError"
    }
}
