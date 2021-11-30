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




       
    // Invalid instruction number passed in.
    #[error("Invalid instruction")]
    InvalidInstruction,

    // Invalid pda associated token address
    #[error("Invalid pda associated token address")]
    InvalidAssociatedPdaTokenAddress,

    // Invalid pda associated token address
    #[error("Invalid swapper associated token address")]
    InvalidAssociatedSwapperTokenAddress,

    // User provided invalid fee account for swap
    #[error("InvalidFeeAccount")]
    InvalidFeeAccount,

    // User changed Fee to invalid amount. valid:(0 - 50000)
    #[error("InvalidFee")]
    InvalidFee,

    // Invalid Token Amount - Contract would hold less than 1 Token
    #[error("InvalidTokenAmount")]
    InvalidTokenAmount,

    // Invalid Token Amount - Contract would hold less than 36 sol - The equivalent of the last Token
    #[error("InvalidSolAmount")]
    InvalidSolAmount,

    /// Address of the provided swap token account is incorrect.
    #[error("Address of the provided swap token account is incorrect")]
    IncorrectSwapAccount,

    /// Given pool token amount results in zero trading tokens
    #[error("Given pool token amount results in zero trading tokens")]
    ZeroTradingTokens,

    /// Swap instruction exceeds desired slippage limit
    #[error("Swap instruction exceeds desired slippage limit")]
    ExceededSlippage,
    
    /// ConversionFailure
    #[error("Conversion to u64 failed with an overflow or underflow")]
    ConversionFailure,

    /// Operation overflowed
    #[error("Operation overflowed")]
    Overflow,
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
