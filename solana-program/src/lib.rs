pub mod error;
pub mod processor;
pub mod instruction;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;

pub use solana_program;
solana_program::declare_id!("4EYSfZxBY9h9JjbuHks75chtTn85ucNRqahsH5YcexVa");