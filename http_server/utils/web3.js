let { bool, publicKey, struct, u32, u64, u8 } = require('@project-serum/borsh');
const { Connection, PublicKey } = require("@solana/web3.js");
let pool = require('../config/db');

const ACCOUNT_LAYOUT = struct([
    publicKey('mint'),
    publicKey('owner'),
    u64('amount'),
    u32('delegateOption'),
    publicKey('delegate'),
    u8('state'),
    u32('isNativeOption'),
    u64('isNative'),
    u64('delegatedAmount'),
    u32('closeAuthorityOption'),
    publicKey('closeAuthority')
]);

const MINT_LAYOUT = struct([
    u32('mintAuthorityOption'),
    publicKey('mintAuthority'),
    u64('supply'),
    u8('decimals'),
    bool('initialized'),
    u32('freezeAuthorityOption'),
    publicKey('freezeAuthority')
])

const TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);
  
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

function getBigNumber(num) {
    return num === undefined || num === null ? 0 : parseFloat(num.toString())
}

const getTokenImpact = (conn, req) => new Promise((res, rej) => {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    try{

        conn.query(
            'SELECT token_mint_address from Page where unique_pagename = ?;',
            [req.body.unique_pagename],
            async function(err, mint_id) {
                if (err){
                    rej({
                        status: 500,
                        message: 'An error occurred'
                    })
                    console.log(err)
                }else if(!mint_id || (mint_id.length == 0)){
                    res(0)
                }else{
                    const mint = new PublicKey(mint_id[0].token_mint_address)
                    const mintInfo = await connection.getAccountInfo(mint)
                    if (mintInfo === null || !mintInfo.owner.equals(TOKEN_PROGRAM_ID) || (mintInfo.data.length != MINT_LAYOUT.span)) {
                        res(0)
                    }else{
                        const tokenSupply = (getBigNumber((MINT_LAYOUT.decode(Buffer.from(mintInfo.data))).supply) + 1000000000)
                        conn.query(
                            'SELECT public_key from User where user_id = ?;',
                            [req.user_id],
                            async function(err, result) {
                                if (err){
                                    rej({
                                        status: 500,
                                        message: 'An error occurred'
                                    })
                                    console.log(err)
                                }else{
                                    const [associatedUserPubKey, bump_seed] = await PublicKey.findProgramAddress(
                                        [new PublicKey(result[0].public_key).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
                                        ASSOCIATED_TOKEN_PROGRAM_ID,
                                    )
                                    console.log(associatedUserPubKey)
                                    const associatedUserAccoutInfo = await connection.getAccountInfo(associatedUserPubKey)
                                    console.log(associatedUserAccoutInfo)
                                    if ((associatedUserAccoutInfo === null) || (associatedUserAccoutInfo.lamports == 0) || (!associatedUserAccoutInfo.owner.equals(TOKEN_PROGRAM_ID)) || (associatedUserAccoutInfo.data.length != ACCOUNT_LAYOUT.span)) {
                                        res(0)
                                    }else{
                                        const balance = getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(associatedUserAccoutInfo.data)).amount)
                                        if(balance > 0){
                                            res(Math.floor((balance/tokenSupply)* 1000000000))
                                        }else{
                                            res(0)
                                        }
                                    }

                                }
                            }
                        )
                    }
                }
            }
        )
    }catch(err){
        console.log(err)
        rej({
            status: 500,
            message: 'An error occurred'
        })
    }
})

module.exports = {
    getTokenImpact
}