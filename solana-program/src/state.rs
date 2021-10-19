use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};

pub struct Swap {
    pub is_initialized: bool,
    pub bump_seed: u8,
    pub token_program_id: Pubkey,
    pub page_token_mint: Pubkey,
    pub fee_account: Pubkey,
    pub fees: u8
}

impl SwapState fro Swap{
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }

    fn bump_seed(&self) -> u8 {
        self.bump_seed
    }

    fn token_program_id(&self) -> &Pubkey {
        &self.token_program_id
    }

    fn page_token_mint(&self) -> &Pubkey {
        &self.page_token_mint
    }

    fn fee_account(&self) -> &Pubkey {
        &self.fee_account
    }

    fn fees(&self) -> &u8 {
        &self.fees
    }
}

impl Sealed for Swap {}

impl IsInitialized for Swap {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Swap {
    const LEN: usize = 106;

    fn pack_into_slice(&self, output: &mut [u8]) {
        let output = array_mut_ref![output, 0, 106];
        let (
            is_initialized,
            bump_seed,
            token_program_id,
            page_token_mint,
            fee_account,
            fees
        ) = mut_array_refs![output, 1, 1, 32, 32, 32, 8];
        is_initialized[0] = self.is_initialized as u8;
        bump_seed[0] = self.bump_seed;
        token_program_id.copy_from_slice(self.token_program_id.as_ref());
        page_token_mint.copy_from_slice(self.page_token_mint.as_ref());
        fee_account.copy_from_slice(self.fee_account.as_ref());
        fees = self.fees.to_le_bytes();
    }

    fn unpack_from_slice(input: &[u8]) -> Result<Self, ProgramError> {
        let input = array_ref![input, 0, 106];
        let (
            is_initialized,
            bump_seed,
            token_program_id,
            page_token_mint,
            fee_account,
            fees
        ) = array_refs![input, 1, 1, 32, 32, 32, 8];
        Ok(Self {
            is_initialized: match is_initialized {
                [0] => false,
                [1] => true,
                _ => return Err(ProgramError::InvalidAccountData),
            },
            bump_seed: bump_seed[0],
            token_program_id: Pubkey::new_from_array(*token_program_id),
            token_program_id: Pubkey::new_from_array(*token_program_id),
            page_token_mint: Pubkey::new_from_array(*token_program_id),
            fee_account: Pubkey::new_from_array(*token_program_id),
            fees: u64::from_le_bytes(*fees)
        })
    }
}