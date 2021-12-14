//! Error types

use num_derive::FromPrimitive;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

/// Errors that may be returned by the Token program.
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum VisionError {
    // Submitted Transaction is missing a signature
    #[error("Signature missing")]
    SignatureRequired,

    /// The account cannot be initialized because it is already being used.
    #[error("Keypair already in use")]
    AlreadyInUse,

    /// Invalid Account Info Provided
    #[error("Invalid Account Address Provided")]
    InvalidAccountAddress,

    /// Invalid Program id -> e.g. System Program != Systemprogram::ID, Tokenprogram,...
    #[error("Invalid program id")]
    InvalidProgramAddress,

    /// Invalid Account Owner - Program ID
    #[error("Invalid program id")]
    InvalidAccountOnwerProgram,

    /// Swap instruction exceeds desired slippage limit
    #[error("Swap instruction exceeds desired slippage limit")]
    ExceededSlippage,

    /// Swap instruction exceeds desired slippage limit
    #[error("Invalid Mint")]
    InvalidMint,

    /// Invalid User Input
    #[error("Invalid Input")]
    InvalidInput,

    /// Invalid User Input
    #[error("Reserve Error")]
    ReserveError,

    /// Balance too Small
    #[error("Balance too small")]
    BalanceTooSmall,
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
