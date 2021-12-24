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

exports.getTokenImpact = function(req, res, next) {

    try{
        pool.getConnection(function(err, conn) {
            if (err){
                res.status(500).send('An error occurred')
                console.log(err)
            }else{
                conn.query(
                    'SELECT p.token_mint_address from Page p where p.unique_pagename = ?',
                    [req.params.type, req.params.root_id],
                    async function(err, mintResults) {
                        if (err){
                            res.status(500).send('An error occurred')
                            console.log(err)
                        }else{
                            if(mintResults && mintResults.length > 0){
                                const mintInfo = await connection.getAccountInfo(mint)
                                if (mintInfo === null || !mintInfo.owner.equals(TOKEN_PROGRAM_ID) || mintInfo.data.length != MINT_LAYOUT.span) {
                                    req.impact = 0
                                    next()
                                }else{
                                    const tokenSupply = (getBigNumber((MINT_LAYOUT.decode(Buffer.from(mintInfo.data))).supply) + 1000000000)
                                    conn.query(
                                        'SELECT p.token_mint_address from Page p where p.unique_pagename = ?',
                                        [req.params.type, req.params.root_id],
                                        async function(err, userResults) {
                                            if(userResults && userResults.length > 0){
                                                const associatedUserPubKey = await PublicKey.findProgramAddress(
                                                    [new PublicKey(userResults[0]).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(mintResults[0]).toBuffer()],
                                                    ASSOCIATED_TOKEN_PROGRAM_ID,
                                                )
                                                const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
                                                const associatedUserAccoutInfo = await connection.getAccountInfo(associatedUserPubKey)
                                                if (
                                                    (associatedUserAccoutInfo === null) 
                                                    || (associatedUserAccoutInfo.lamports == 0) 
                                                    || (!associatedUserAccoutInfo.owner.equals(TOKEN_PROGRAM_ID)) 
                                                    || (associatedUserAccoutInfo.data.length != ACCOUNT_LAYOUT.span)) {
    
                                                        req.impact = 0;
                                                        next();
                                                }else{
                                                    const balance = getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(associatedUserAccoutInfo.data)).amount)
                                                    if(balance > 0){
                                                        req.impact = (balance/tokenSupply)* 10000000000
                                                        next()
                                                    }else{
                                                        req.impact = 0
                                                        next()
                                                    }
                                                }
                                            }else{
                                                req.impact = 0
                                                next()
                                            }
                                        }
                                    );
                                }
                            }else{
                                req.impact = 0;
                            }
                        }
                    }
                );
            }
            pool.releaseConnection(conn);
        })
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured')
        return
    }
}