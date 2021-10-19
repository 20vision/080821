import styles from '../../styles/modal/trade.module.css'
import { useState, useEffect } from 'react'

export default function Trade() {
  const [selectedRoute, setSelectedRoute] = useState(0)

  return (
    <div className={styles.container}>
      <div className={`noselect ${styles.header}`}>
          <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?styles.highlight:null}>
              Swap
          </h1>
          <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?styles.highlight:null}>
              Liquidity
          </h1>
          <div onClick={() => setSelectedRoute(2)} className={`${styles.charts} ${selectedRoute == 2?styles.highlight:null}`}>
              {/* Implement different coclors with chartPositive and negative */}
              <h1 className={selectedRoute == 2?styles.highlightH1:null}>Charts</h1><span className={styles.chartNegative}>↓9%</span>
          </div>
      </div>

      <AreaChart width={400} height={250}/>

    </div>
  )
}


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