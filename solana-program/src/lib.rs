pub mod error;
pub mod processor;
pub mod instruction;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;

solana_program::declare_id!("APgk4nmtQ12zC94aosTHku2YDqDbo8HV9tChFRyNsVhr");