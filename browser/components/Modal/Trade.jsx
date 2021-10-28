import styles from '../../styles/modal/trade.module.css'
import { useState, useEffect } from 'react'
import { useModalStore } from '../../store/modal'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

export default function Trade() {
  const [selectedRoute, setSelectedRoute] = useState(0)
  const setModal = useModalStore(state => state.setModal)
  const [profile, isLoading, setUser] = useUserProfile()

  const {
    wallet,
    connected,
    connect,
    publicKey,
    signTransaction
    // connecting,
    // wallets,
    // autoConnect,
    // wallet,
    // adapter,
    // publicKey,
    // ready,
    // connected,
    // connecting,
    // disconnecting,
    // select,
    // connect,
    // disconnect,
    // sendTransaction,
    // signTransaction,
    // signAllTransactions,
    // signMessage 
  } = useWallet();
  const connectThisWallet = async() => {
    try{
      await connect()
    }catch(err){
      toast.error(err.name)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`noselect ${styles.header}`}>
          <h1 onClick={() => setSelectedRoute(0)} style={{marginRight: '10px'}} className={`${selectedRoute == 0?styles.highlight:null}`}>
              Buy
          </h1>
          <h1 onClick={() => setSelectedRoute(1)} style={{marginLeft: '10px'}} className={`${selectedRoute == 1?styles.highlight:null}`}>
              Sell
          </h1>
      </div>

      {!profile.username || !wallet?
        <a onClick={() => setModal(1)}>
          <div className={styles.connectWallet}>
            <h2>Connect Wallet</h2>
          </div>
        </a>
      :!connected && wallet?
        <a onClick={() => connectThisWallet()}>
          <div className={styles.connectWallet}>
            <h2>Connect Wallet</h2>
          </div>
        </a>
      :
        <a onClick={() => fundPageToken(publicKey, signTransaction)}>
          <div className={styles.connectWallet}>
            <h2>Swap</h2>
          </div>
        </a>
      }
    </div>
  )
}

import { Connection, SYSVAR_RENT_PUBKEY, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { connect } from 'socket.io-client';
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
const VisionProgramId = new PublicKey('64YG9ttAgP9ScjDmEVb5oZVTMdb6ajAiHVJBwjMeGtCz')

// Layout
import * as BufferLayout from "buffer-layout";
const uint64Layout = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
const publicKeyLayout = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

// On Chain Token Funding
const fundPageToken = async(walletPublicKey, signTransaction) => {
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()

  const mintAccount = Keypair.generate();

  // Token Minting
  const MintLayout = BufferLayout.struct([
    BufferLayout.u32('mintAuthorityOption'),
    publicKeyLayout('mintAuthority'),
    uint64Layout('supply'),
    BufferLayout.u8('decimals'),
    BufferLayout.u8('isInitialized'),
    BufferLayout.u32('freezeAuthorityOption'),
    publicKeyLayout('freezeAuthority'),
  ]);
  
  const balanceNeeded = await connection.getMinimumBalanceForRentExemption(MintLayout.span)
  console.log(balanceNeeded)
  const new_mint_account = Keypair.generate();
  const mint_hodler_account = Keypair.generate();
  tx.add(systemProgram_createAccount(walletPublicKey, new_mint_account, mint_hodler_account))
  try{
    tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
    tx.feePayer = walletPublicKey
    tx.partialSign(new_mint_account);
    tx.partialSign(mint_hodler_account);
    const signedTx = await signTransaction(tx)
    await sendAndConfirmRawTransaction(connection, signedTx.serialize())
  }catch(e){
    console.log("error:",e)
  }
}

const systemProgram_createAccount = (walletPublicKey, new_mint_account, mint_hodler_account) => {

  // const dataLayout = BufferLayout.struct([
  //   BufferLayout.u32('instruction'),
  //   BufferLayout.ns64('lamports'),
  //   BufferLayout.ns64('space'),
  //   publicKeyLayout('programId'),
  // ])

  // const toBuffer = (arr) => {
  //   if (Buffer.isBuffer(arr)) {
  //     return arr;
  //   } else if (arr instanceof Uint8Array) {
  //     return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  //   } else {
  //     return Buffer.from(arr);
  //   }
  // };

  // const data = Buffer.alloc(dataLayout.span)
  
  // dataLayout.encode(
  //   {
  //     instruction: 0, // Initialize Page Token
  //     lamports: lamports,
  //     space: space,
  //     programId: toBuffer(ownerProgramId.toBuffer()),
  //   },
  //   data,
  // );

  // console.log(data)
  const dataLayout = BufferLayout.struct([
    BufferLayout.u32('instruction'),
    BufferLayout.ns64('amount'),
  ])

  const data = Buffer.alloc(dataLayout.span)
  
  dataLayout.encode(
    {
      instruction: 0, // Initialize Page Token
      amount: 1000000,
    },
    data,
  );

  return new TransactionInstruction({
    keys: [
      {pubkey: walletPublicKey, isSigner: true, isWritable: true},
      {pubkey: new_mint_account.publicKey, isSigner: true, isWritable: true},
      {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
      {pubkey: mint_hodler_account.publicKey, isSigner: true, isWritable: true},
      {pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false},
      {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    ],
    programId: VisionProgramId,
    data,
  });


}

// Off Chain Token Funding + On Chain initialization
/*const uint64Layout = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
const publicKeyLayout = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

const fundPageToken = async(walletPublicKey) => {
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()
  const pageTokenPoolAccount = Keypair.generate()

  const [authority, bumpSeed] = await PublicKey.findProgramAddress(
    [pageTokenPoolAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );
  
  let tokenMintTransaction

  try{
    tokenMintTransaction = await createLazyMintTransaction(pageTokenPoolAccount, authority, connection, walletPublicKey)
    tx.add(tokenMintTransaction)
  }catch{
    toast.error('Minting Error')
    return
  }
}

const createLazyMintTransaction = (pageTokenPoolAccount, authority, connection, walletPublicKey) => new Promise(async(resolve, reject) => {
  const pageTokenMintKeypair = Keypair.generate()
  const pageTokenMintToAccountKeypair = Keypair.generate()

  const MintTokenLayout = BufferLayout.struct([
    BufferLayout.u32('mintAuthorityOption'),
    publicKeyLayout('mintAuthority'),
    uint64Layout('supply'),
    BufferLayout.u8('decimals'),
    BufferLayout.u8('isInitialized'),
    BufferLayout.u32('freezeAuthorityOption'),
    publicKeyLayout('freezeAuthority'),
  ])

  const balanceForRentExemption = await connection.getMinimumBalanceForRentExemption(
    MintTokenLayout.span
  )

  const balanceNeededForCreateAccount = await Token.getMinBalanceRentForExemptAccount(
    connection,
  );

  resolve([
    SystemProgram.createAccount({
      fromPubkey: walletPublicKey.publicKey,
      lamports: balanceForRentExemption,
      newAccountPubkey: pageTokenMintKeypair.publicKey,
      space: MintTokenLayout.span,
      programId: TOKEN_PROGRAM_ID
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      pageTokenMintKeypair.publicKey,
      18,
      pageTokenPoolAccount.publicKey,
      null
    ),
    SystemProgram.createAccount({
      fromPubkey: walletPublicKey.publicKey,
      newAccountPubkey: pageTokenMintToAccountKeypair.publicKey,
      lamports: balanceNeededForCreateAccount,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      pageTokenMintKeypair.publicKey,
      pageTokenMintToAccountKeypair.publicKey,
      authority,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      pageTokenMintKeypair.publicKey,
      pageTokenMintToAccountKeypair.publicKey,
      pageTokenPoolAccount.publicKey,
      [],
      1000000
    ),
    Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      pageTokenMintKeypair.publicKey,
      null,
      'MintTokens',
      pageTokenPoolAccount.publicKey,
      [],
    )
  ])

})
*/

/*import { Connection, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as BufferLayout from "buffer-layout";
import { connect } from 'socket.io-client';

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

const fundPageToken = async() => {
  const wallet = await getWallet()
  const {connection} = useConnection()

  const tx = new Transaction()
  // Create Account that holds information of Token Swap State
  const tokenSwapAccount = Keypair.generate()

  // Creating a Program derived Address that does not have a private key. This enables the
  // Program that (second argument = id) to "sign". Actually invoke... . Using the bump seed("seed that was used to bump
  // the address off the ed25519 curve") the custom seeds("20Vision") and the program_id. Programs that are being invoked
  // can check if the "signature" is valid, as they are being called by the program id itself. No way to fake it.
  const [authority, bumpSeed] = await PublicKey.findProgramAddress(
    ["20Vision"],
    TOKEN_SWAP_PROGRAM_ID,
  );

  const lazyMintTransaction = await createLazyMintTransaction(authority, connection, tx, wallet)
}


const getWallet = () => new Promise(async(resolve, reject) => {
  const setModal = useModalStore(state => state.setModal)
  const {
    connected,
    wallet,
    publicKey,
    ready,
    connect
    // connecting,
    // wallets,
    // autoConnect,
    // wallet,
    // adapter,
    // publicKey,
    // ready,
    // connected,
    // connecting,
    // disconnecting,
    // select,
    // connect,
    // disconnect,
    // sendTransaction,
    // signTransaction,
    // signAllTransactions,
    // signMessage 
  } = useWallet();

  if(!wallet || !ready){
    setModal(1)
  }else if(!connected || !publicKey){
    connect()
  }
})*/


/*import * as BufferLayout from "buffer-layout";
import { Connection, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import * as BN from "bn.js"
import { toast } from 'react-toastify'

///////// Phantom Wallet ////////

const getProvider = new Promise((resolve, reject) => {
  if ("solana" in window) {
    const anyWindow = window;
    const provider = anyWindow.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
  resolve()
});

const SwapButton = () => {
  const [provider, setProvider] = useState()
  const isConnected = useWalletStore(state => state.isConnected)
  const setWalletIsConnected = useWalletStore(state => state.setWalletIsConnected)

  window.solana.on("connect", () => setWalletIsConnected(true))
  window.solana.on("disconnect", () => setWalletIsConnected(false))



  
  /////// Layout //////////////

  const uint64 = (property = "uint64") => {
    return BufferLayout.blob(8, property);
  };
  const publicKey = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
  };

  const TokenSwapLayout = BufferLayout.struct([
    BufferLayout.u8('isInitialized'),
    BufferLayout.u8('bumpSeed'),
    publicKey('tokenProgramId'),
    publicKey('pageTokenMint'),
    publicKey('feeAccount'),
    uint64('fees')
  ])

  ///////// Swap Program ///////
  const TOKEN_SWAP_PROGRAM_ID = new PublicKey('ALpzDrZtXmEQn35WfmiuyNFB9T1xBjLBpjCGiA6SDgxR')
  const [page, setPage] = useState()

  const createPageToken = new Promise(async(resolve, reject) => {
    if(!provider){
      try{
        await getProvider()
      }catch(e){
        return
      }
    }
      const connection = new Connection('http://localhost:8899', 'confirmed')
      

      const tx = new Transaction()
      // Create Account that holds information of Token Swap State
      const tokenSwapAccount = Keypair.generate();

      // Creating a Program derived Address that does not have a private key. This enables the
      // Program that (second argument = id) to "sign". Actually invoke... . Using the bump seed("seed that was used to bump
      // the address off the ed25519 curve") the custom seeds("20Vision") and the program_id. Programs that are being invoked
      // can check if the "signature" is valid, as they are being called by the program id itself. No way to fake it.
      const [authority, bumpSeed] = await PublicKey.findProgramAddress(
        ["20Vision"],
        TOKEN_SWAP_PROGRAM_ID,
      );
      

      // Minting token manually as no keypair. Just able to sign transaction with phantom
      const pageTokenMintKeypair = Keypair.generate()

      const MintTokenLayout = BufferLayout.struct([
        BufferLayout.u32('mintAuthorityOption'),
        publicKey('mintAuthority'),
        uint64('supply'),
        BufferLayout.u8('decimals'),
        BufferLayout.u8('isInitialized'),
        BufferLayout.u32('freezeAuthorityOption'),
        publicKey('freezeAuthority'),
      ])

      const balanceForRentExemption = connection.getMinimumBalanceForRentExemption(
        MintTokenLayout.span
      )

      tx.add(
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          lamports: balanceForRentExemption,
          newAccountPubkey: pageTokenMintKeypair.publicKey,
          space: MintTokenLayout.span,
          programId: TOKEN_PROGRAM_ID
        })
      )

      tx.add(
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          pageTokenMintKeypair.publicKey,
          18,
          authority,
          null
        )
      )


      const initSwap = new TransactionInstruction({
        programId: TOKEN_SWAP_PROGRAM_ID,
        keys: [
          {pubkey: tokenSwapAccount.publicKey, isSigner: true, isWritable: true},
          {pubkey: TOKEN_SWAP_PROGRAM_ID, isSigner: false, isWritable: false},
          {pubkey: provider.publicKey, isSigner: false, isWritable: false},
        ],
        data: Buffer.from(Uint8Array.of(0, ...new BN(14).toArray("le", 8)))
      })

      const tokenSwapAccountCreation = SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(TokenSwapLayout.span),
        space: TokenSwapLayout.span,
        programId: TOKEN_SWAP_PROGRAM_ID,
      })


      tx.add(
        tokenSwapAccountCreation,
        initSwap
      )

      
      tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash

      tx.feePayer = await provider.publicKey

      const signedTransaction = await provider.signTransaction(tx)

      connection.sendRawTransaction(signedTransaction.serialize())

        
      resolve()
     tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
      
      tx.feePayer = provider.publicKey

      // Initial TokenSwap Account signs transaction
      tx.partialSign(
        tokenSwapAccount
      )

      tx.feePayer = provider.publicKey

      // Payer Signs Transaction
      await provider.signTransaction(tx)

      console.log(tx.verifySignatures(),'Is true ?')
  })

  const swap = async() => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    const provider = getProvider()

    // define tokenSwapAccount !

    let transaction;

    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(TokenSwapLayout.span),
        space: TokenSwapLayout.span,
        programId: programId,
      }),
    )

  }


  return(
    <>
      {isConnected && page ?
        <a 
          onClick={e => {
            e.preventDefault();
            swap();
          }} 
          className={styles.tradeButton}>
            <div>
              <h2>Swap</h2>
            </div>
        </a>
      :isConnected?
        <a 
          onClick={e => {
            e.preventDefault();
            toast.promise(
              createPageToken,
              {
                pending: 'Creating Token...',
                success: 'Token Created',
                error: 'Error creating Token'
              }
            );
          }} 
          className={styles.tradeButton}>
            <div>
              <h2>Create Page Token</h2>
            </div>
        </a>
      :
        <a 
          onClick={e => {
            e.preventDefault();
            provider.connect();
          }} 
          className={styles.tradeButton}>
            <div>
              <h2>Connect Wallet</h2>
            </div>
        </a>
      }
    </>
  )
}*/