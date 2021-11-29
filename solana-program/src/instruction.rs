use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
    msg
};
use std::convert::TryInto;
use crate::error::VisionError;

pub struct Amount {
    /// SOURCE amount to transfer, output to DESTINATION is based on the exchange rate
    pub amount_in: u64,
    /// Minimum amount of DESTINATION token to output, prevents excessive slippage
    pub minimum_amount_out: u64,
}

pub struct Fee {
    /// Fee from 0 - 50000.(0-50%). Will be divided by 100000 to create a precison of 0.001%
    pub fee: u16,
}

pub enum VisionInstruction {
    /// [signer, writable] payer -> Funding token creation.
    /// [signer, writable] mint -> Keypair of Mint
    /// [writable] pda -> Program Derived Address(with mint pubkey) for AMM. Holding AMM infos. [is_initialized, bump_seed of pda, bump seed pda_sol, fee (x/100000), fee_collector_pubkey]
    /// [writable] pda_sol -> Program derived address(with pda) holding sol/collateral.
    /// [writable] pda_token -> Associated Token Address holding at least 1 token for AMM formula to work.
    /// [x] system_program_info
    /// [x] associated_token_program_info
    /// [x] token_program_info
    /// [x] rent_sysvar_info
    /// [x] fee_collector_info -> Pub key of Fee collector saved in pda
    Initialize(),
    /// [signer, writable] payer -> Buyer spending sol and getting token.
    /// [writable] payer_associated_token_address_info
    /// [writable] page_fee_collector_info
    /// [writable] provider_fee_collector_info
    /// [writable] pda_info
    /// [writable] pda_associated_sol_info
    /// [writable] mint_info
    /// [x] system_program_info
    /// [x] associated_token_program_info
    /// [x] token_program_info
    /// [x] rent_sysvar_info
    Buy(Amount),
    /// [signer, writable] seller_info -> Seller, spending token and getting sol.
    /// [writable] seller_associated_token_address_info
    /// [writable] provider_fee_collector_info
    /// [writable] pda_info
    /// [writable] pda_associated_sol_info
    /// [writable] mint_info
    /// [x] system_program_info
    /// [x] token_program_info
    Sell(Amount),
    /// [signer, writable] fee_collector_info -> Current Fee collector saved in pda.
    /// [writable] new_fee_collector_info
    /// [writable] pda_info
    /// [x] mint_info
    /// [x] system_program_info
    ChangeFee(Fee)
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
                Self::Buy(Amount { 
                    amount_in,
                    minimum_amount_out 
                })
            }
            2 => {
                let (amount_in, rest) = Self::unpack_u64(rest)?;
                let (minimum_amount_out, _rest) = Self::unpack_u64(rest)?;
                Self::Sell(Amount { 
                    amount_in,
                    minimum_amount_out 
                })
            }
            3 => {
                let (fee, _rest) = Self::unpack_u16(rest)?;
                Self::ChangeFee(Fee { 
                    fee
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

    fn unpack_u16(input: &[u8]) -> Result<(u16, &[u8]), ProgramError> {
        if input.len() >= 2 {
            let (amount, rest) = input.split_at(2);
            let amount = amount
                .get(..2)
                .and_then(|slice| slice.try_into().ok())
                .map(u16::from_le_bytes)
                .ok_or(VisionError::InvalidInstruction)?;
            Ok((amount, rest))
        } else {
            Err(VisionError::InvalidInstruction.into())
        }
    }
}