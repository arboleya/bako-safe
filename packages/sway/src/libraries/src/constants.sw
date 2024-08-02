library;

use std::{
  constants::ZERO_B256,
};

pub const INVALID_ADDRESS = 0x0000000000000000000000000000000000000000000000000000000000000001;

pub const BYTE_WITNESS_TYPE_FUEL: u64 = 0x0000000000000001;
pub const BYTE_WITNESS_TYPE_WEBAUTHN: u64 = 0x0000000000000002;


pub const MAX_SIGNERS: u64 = 10; // if changed, sync with the predicate expected signers
pub const EMPTY_SIGNERS = [
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
        ZERO_B256,
];