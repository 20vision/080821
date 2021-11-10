use solana_program::{
    msg,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::{Pubkey, PUBKEY_BYTES},
};
use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
pub struct PageTokenSwap {
    pub is_initialized: bool,

    /// PDA with Bump Seed -> Save Bump seed in Account and use it in subsequent public Key validation
    /// with "create_program_address([-Mint PubKey-, bump_seed], programId)"; 
    /// bump_seed -> client side "findProgramAddress([-Mint PublicKey-], programId)"
    pub bump_seed: u8,

    /// Fee from 0 - 50000.(0-50%). Will be divided by 100000 to create a precison of 0.001%
    pub fee: u16,

    /// Page Creator/Fee collector that will receive fee
    pub fee_collector_pubkey: Pubkey
}

impl Sealed for PageTokenSwap {}
impl IsInitialized for PageTokenSwap {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for PageTokenSwap {
    const LEN: usize = 36;

    fn pack_into_slice(&self, output: &mut [u8]) {
        let output = array_mut_ref![output, 0, PageTokenSwap::LEN];
        let(
            is_initialized_dst,
            bump_seed_dst,
            fee_dst,
            fee_collector_pubkey_dst
        ) = mut_array_refs![output, 1, 1, 2, 32];

        let PageTokenSwap {
            is_initialized,
            bump_seed,
            fee,
            fee_collector_pubkey
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        bump_seed_dst[0] = *bump_seed;
        *fee_dst = fee.to_le_bytes();
        fee_collector_pubkey_dst.copy_from_slice(fee_collector_pubkey.as_ref());
    }

    fn unpack_from_slice(input: &[u8]) -> Result<Self, ProgramError> {
        let input = array_ref![input, 0, PageTokenSwap::LEN];
        let(
            is_initialized,
            bump_seed,
            fee,
            fee_collector_pubkey
        ) = array_refs![input, 1, 1, 2, 32];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        Ok(PageTokenSwap{
            is_initialized,
            bump_seed: bump_seed[0],
            fee: u16::from_le_bytes(*fee),
            fee_collector_pubkey: Pubkey::new_from_array(*fee_collector_pubkey)
        })
    }
}