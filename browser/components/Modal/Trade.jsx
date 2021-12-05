import styles from '../../styles/modal/trade.module.css'
import { useState, useEffect } from 'react'
import { useModalStore } from '../../store/modal'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import Arrow from '../../assets/ArrowDown'
import {usePageSelectedStore} from '../../store/pageSelected'
import PageIcon from '../../assets/PageIcon/PageIcon'
import SolanaIcon from '../../assets/SolanaIcon'
import NumberFormat from 'react-number-format';

export default function Trade() {
  const [selectedRoute, setSelectedRoute] = useState(1)
  const [buy, setBuy] = useState(true) // true -> Sol to Page // false -> Page to Sol
  const [sol, setSol] = useState()
  const [token, setToken] = useState()
  const setModal = useModalStore(state => state.setModal)
  const [profile, isLoading, setUser] = useUserProfile()
  const page = usePageSelectedStore(state => state.page)

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
            Info
          </h1>
          <h1 onClick={() => setSelectedRoute(1)} style={{marginRight: '10px'}} className={`${selectedRoute == 1?styles.highlight:null}`}>
            Swap
          </h1>
          <h1 onClick={() => setSelectedRoute(2)} style={{marginLeft: '10px'}} className={`${selectedRoute == 2?styles.highlight:null}`}>
            %
          </h1>
      </div>

      <div className={styles.selectionParent}>
        {buy?<SelectionSol sol={sol} setToken={setToken} walletPublicKey={publicKey} buy={buy} setSol={setSol}/>:<SelectionPageToken token={token} walletPublicKey={publicKey} setSol={setSol}  buy={buy} setToken={setToken} page={page}/>}
          <div className={styles.tradeDirectionArrowParent}>
            <div className={styles.tradeDirectionArrowChild}>
              <a onClick={() => setBuy(!buy)}><Arrow strokeWidth='3'/></a>
            </div>
          </div>
        {buy?<SelectionPageToken token={token} setSol={setSol} walletPublicKey={publicKey} buy={buy} setToken={setToken} page={page}/>:<SelectionSol walletPublicKey={publicKey}  buy={buy} sol={sol} setToken={setToken} setSol={setSol}/>}
      </div>

      <div className={`smalltext ${styles.priceInDollar}`}>
        ~$400USD
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
        <>
          <a onClick={() => fundPageToken(publicKey, signTransaction)}>
            <div className={styles.connectWallet}>
              <h2>Fund</h2>
            </div>
          </a>

          {/* <a onClick={() => swap(publicKey, signTransaction)}>
            <div className={styles.connectWallet}>
              <h2>Swap</h2>
            </div>
          </a> */}
        </>
      }
    </div>
  )
}

const SelectionSol = ({setSol, setToken, walletPublicKey, buy, sol}) => {
  return(
    <div className={styles.tradePageInfoParent}>

      <SolanaIcon/>

      <div className={styles.tradePageInfoChild}>
        <h3>
          Solana
        </h3>
        <span className="smalltext">0&nbsp;</span><span className="smalltext">($0)</span>
      </div>

      <NumberFormat value={sol} onValueChange={async(values, sourceInfo) => {
        console.log(sourceInfo)
        if(sourceInfo.source == 'event'){
          setSol(values.floatValue)
          setToken((Math.round(((await price(new PublicKey('2LDgsi2s8J42hfXwa5fdZXsGGn6VHtjYZG5SQ95VDSRg'), buy, (values.floatValue*1000000000), null, walletPublicKey)).token)/100000))/10000)
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}

const SelectionPageToken = ({page, token, buy, walletPublicKey, setToken, setSol}) => {
  return(
    <div className={styles.tradePageInfoParent}>

      {page.page_icon.length > 6 ?
          <img src={page.page_icon}/>
      :
          <PageIcon color={'#'+page.page_icon}/>
      }

      <div className={styles.tradePageInfoChild}>
        <h3>
          /{page.unique_pagename}
        </h3>
        <span className="smalltext">0&nbsp;</span><span className="smalltext">($0)</span>
      </div>

      <NumberFormat value={token} onValueChange={async(values, sourceInfo) => {
        if(sourceInfo.source == 'event'){
          setToken(values.floatValue)
          setSol(((Math.round(((await price(new PublicKey('2LDgsi2s8J42hfXwa5fdZXsGGn6VHtjYZG5SQ95VDSRg'), buy, null, values.floatValue*1000000000, walletPublicKey)).lamports)/100000))/10000))
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}

import { Connection, SYSVAR_RENT_PUBKEY, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { connect } from 'socket.io-client';
import BN from 'bn.js';
import assert from 'assert';
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
const VisionProgramId = new PublicKey('97F2CxbQfAiLdF14dWt24KjiG1nUzsfQPcxvqLTF2s6p')

import * as BufferLayout from "buffer-layout";

const uint64Layout = (property = "uint64") => { 
  return BufferLayout.blob(8, property);
};
const publicKey = (property = 'publicKey') => {
  return BufferLayout.blob(32, property);
};

const AmmLayout = BufferLayout.struct(
  [
    BufferLayout.u8('isInitialized'),
    BufferLayout.u8('bumpSeed'),
    BufferLayout.u8('bumpSeedSol'),
    BufferLayout.u16('fee'),
    publicKey('fee_collector_pubkey')
  ]
)


const price = async(tokenMint, isBuy, lamportsAmt, tokenAmt, walletPublicKey) => {
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const mint = new Token(connection, tokenMint, TOKEN_PROGRAM_ID, walletPublicKey)
  const [pda, bump_seed] = await PublicKey.findProgramAddress(
    [tokenMint.toBuffer()],
    VisionProgramId,
  );
  const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
    [pda.toBuffer()],
    VisionProgramId,
  )
  let collateral = (await connection.getBalance(pda_associatedSolAddress)) - (await connection.getMinimumBalanceForRentExemption(0))
  let supply = ((await mint.getMintInfo()).supply.toNumber()) + 1000000000
  let lamports = null
  let token = null

  if(isBuy){
    if(lamportsAmt){
      lamports = lamportsAmt
      // AMT * (1 - 1% Provider - x% Page)
      let providerFee = Math.round(lamportsAmt * 0.01)
      let pageFee = Math.round(lamportsAmt * ((await getAmmInfo(pda)).fee / 100000))
      let adjustedLamportsAfterFee  = lamportsAmt - (providerFee + pageFee)
      token = Math.round(supply * (Math.pow((1 + adjustedLamportsAfterFee / collateral), 0.60976) - 1))
      //console.log(token)
    }else if(tokenAmt){
      token = tokenAmt
      lamports = Math.round((Math.pow((tokenAmt/ supply + 1), (1/0.60976))* 36) - 36) / (1 - 0.01 - ((await getAmmInfo(pda)).fee / 100000))
      //console.log(lamports)
    }
  }else{
    if(lamportsAmt){
      lamports = lamportsAmt
      token = ((Math.pow((lamportsAmt / collateral - 1 ), 0.60976)) + 1 ) * supply
    }else if(tokenAmt){
      token = tokenAmt
      let amtWithoutFee = collateral * (1 - Math.pow((1 - tokenAmt / supply), (1/0.60976)))
      lamports = amtWithoutFee - (amtWithoutFee * 0.01)
    }
  }

  return {
    lamports: lamports,
    token: token
  }
}

const getAmmInfo = async(pubKey, commitment) => {
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const info = await connection.getAccountInfo(pubKey, commitment)
  if (info == null){
    throw new Error("Failed to find account");
  }
  if (!info.owner.equals(VisionProgramId)) {
    throw new Error('Invalid account owner');
  }
  if (info.data.length != AmmLayout.span) {
    throw new Error(`Invalid account size`);
  }

  const data = Buffer.from(info.data)
  const accountInfo = AmmLayout.decode(data)
  console.log(accountInfo)
  return accountInfo

}

const fundPageToken = async(walletPublicKey, signTransaction) => {
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()

//! Fetch Fee collector from DB, for now random pubkey:
  const feeCollector = new PublicKey('G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb')

  const new_mint_keypair = Keypair.generate();

  console.log('print the mint: ',new_mint_keypair.publicKey.toString())

  // PDA
  const [pda, bump_seed] = await PublicKey.findProgramAddress(
    [new_mint_keypair.publicKey.toBuffer()],
    VisionProgramId,
  );

  const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
    [pda.toBuffer()],
    VisionProgramId,
  )
  
  // Accounts sent to Contract
  const keys = [
    // Funder - Pays for funding and first swap
    {pubkey: walletPublicKey, isSigner: true, isWritable: true},
    // Mint PubKey
    {pubkey: new_mint_keypair.publicKey, isSigner: true, isWritable: true},
    // Pda where the Swap state is stored to(is_initialized, bump_seed, fee(0-50000), fee_collector)
    {pubkey: pda, isSigner: false, isWritable: true},
    // Pda bump seed for program derived address of Sol account
    {pubkey: pda_associatedSolAddress, isSigner: false, isWritable: true},
    // Page Fee collector Pub Key
    {pubkey: feeCollector, isSigner: false, isWritable: false},
    // For invoke_signed - To create Accounts
    {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
    // For invoking - To create Mint & Mint Account
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
    // Rent Sysvar for Token Program (e.g. Initializing mint)
    {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
  ]

  // Data sent to Contract as Buffer
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')])
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 0
    },
    data
  );

  const txInst = new TransactionInstruction({
    keys,
    programId: VisionProgramId,
    data,
  });

  tx.add(txInst);

  // Send Transaction
  try{
    tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
    tx.feePayer = walletPublicKey
    tx.partialSign(new_mint_keypair);
    const signedTx = await signTransaction(tx)
    await sendAndConfirmRawTransaction(connection, signedTx.serialize())
  }catch(e){
    console.log("error:",e)
  }

  try{
    await price(new_mint_keypair.publicKey, true, 30000000000, null, walletPublicKey)
    await price(new_mint_keypair.publicKey, true, null, 269229227589142, walletPublicKey)
    //await changeFee(walletPublicKey, signTransaction, new_mint_keypair.publicKey)
    //await buy(walletPublicKey, signTransaction, new_mint_keypair.publicKey)
    //await sell(walletPublicKey, signTransaction, new_mint_keypair.publicKey)
  }catch(err) {
    throw err;
  }
}

const buy = async(walletPublicKey, signTransaction, tokenMint) => {
  const feeCollectorPage = new PublicKey('G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb')
  const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()

  // PDA
  const [pda, bump_seed] = await PublicKey.findProgramAddress(
    [tokenMint.toBuffer()],
    VisionProgramId,
  );

  const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
    [pda.toBuffer()],
    VisionProgramId,
  )


  let pageToken = new Token(connection, tokenMint, TOKEN_PROGRAM_ID, walletPublicKey)

  const user_associatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint,
    walletPublicKey
  )

  try {
    await pageToken.getAccountInfo(user_associatedTokenAddress)
  }catch(err){
    if (err.message === 'Failed to find account' || err.message === 'Invalid account owner'){
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          tokenMint,
          user_associatedTokenAddress,
          walletPublicKey,
          walletPublicKey,
        )
      )
    }else {
      throw err;
    }
  }
  console.log(tx)

  // const user_associatedTokenAddress = await manualGetOrCreateAssociatedAccountInfo(
  //   walletPublicKey,
  //   tx,
  //   connection,
  //   tokenMint,
  // )

  // Accounts sent to Contract
  const keys = [
    // Funder - Pays for funding and first swap
    {pubkey: walletPublicKey, isSigner: true, isWritable: true},
    // Funder - Associated Token Address
    {pubkey: user_associatedTokenAddress, isSigner: false, isWritable: true},
    // Funder - Pays for funding and first swap
    {pubkey: pda, isSigner: false, isWritable: true},
    // Pda bump seed for program derived address of Sol account
    {pubkey: pda_associatedSolAddress, isSigner: false, isWritable: true},
    // Funder - Pays for funding and first swap
    {pubkey: tokenMint, isSigner: false, isWritable: true},
    // Page Fee Collector
    {pubkey: feeCollectorPage, isSigner: false, isWritable: true},
    // Provider Fee Collector
    {pubkey: feeCollectorProvider, isSigner: false, isWritable: true},
    // For invoke_signed - To create Accounts
    {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
    // For invoking - To create Mint & Mint Account
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
  ]
  
  // Data sent to Contract as Buffer
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    uint64Layout('amountIn'),
    uint64Layout('minimumAmountOut'),
  ])
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 1,
      amountIn: new Numberu64(30000000000).toBuffer(),
      minimumAmountOut: new Numberu64(1).toBuffer(),
    },
    data
  );

  const txInst = new TransactionInstruction({
    keys,
    programId: VisionProgramId,
    data,
  });


  tx.add(txInst);

  // Send Transaction
  try{
    tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
    tx.feePayer = walletPublicKey
    const signedTx = await signTransaction(tx)
    await sendAndConfirmRawTransaction(connection, signedTx.serialize())
  }catch(e){
    console.log("error:",e)
  }
  

}


const sell = async(walletPublicKey, signTransaction, tokenMint) => {
  const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()

  // PDA
  const [pda, bump_seed] = await PublicKey.findProgramAddress(
    [tokenMint.toBuffer()],
    VisionProgramId,
  );

  // const [pda_associatedTokenAddress, _bump_seed] = await PublicKey.findProgramAddress(
  //   [pda.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
  //   ASSOCIATED_TOKEN_PROGRAM_ID,
  // )
  const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
    [pda.toBuffer()],
    VisionProgramId,
  )

  // const [user_associatedTokenAddress, _bump_seed] = await PublicKey.findProgramAddress(
  //   [walletPublicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
  //   ASSOCIATED_TOKEN_PROGRAM_ID,
  // )
  const user_associatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint,
    walletPublicKey
  )
  // const user_associatedTokenAddress = await manualGetOrCreateAssociatedAccountInfo(
  //   walletPublicKey,
  //   tx,
  //   connection,
  //   tokenMint,
  // )

  // Accounts sent to Contract
  const keys = [
    // Funder - Pays for funding and first swap
    {pubkey: walletPublicKey, isSigner: true, isWritable: true},
    // Funder - Associated Token Address
    {pubkey: user_associatedTokenAddress, isSigner: false, isWritable: true},
    // Funder - Pays for funding and first swap
    {pubkey: pda, isSigner: false, isWritable: true},
    // Pda bump seed for program derived address of Sol account
    {pubkey: pda_associatedSolAddress, isSigner: false, isWritable: true},
    // Funder - Pays for funding and first swap
    {pubkey: tokenMint, isSigner: false, isWritable: true},
    // Provider Fee Collector
    {pubkey: feeCollectorProvider, isSigner: false, isWritable: true},
    // For invoke_signed - To create Accounts
    {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
    // For invoking - To create Mint & Mint Account
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
  ]
  
  // Data sent to Contract as Buffer
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    uint64Layout('amountIn'),
    uint64Layout('minimumAmountOut'),
  ])
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 2,
      amountIn: new Numberu64(269229227589142).toBuffer(),
      minimumAmountOut: new Numberu64(1).toBuffer(),
    },
    data
  );

  const txInst = new TransactionInstruction({
    keys,
    programId: VisionProgramId,
    data,
  });

  tx.add(txInst);
  // Send Transaction
  try{
    tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
    tx.feePayer = walletPublicKey
    const signedTx = await signTransaction(tx)
    await sendAndConfirmRawTransaction(connection, signedTx.serialize())
  }catch(e){
    console.log("error:",e)
  }
  

}


const changeFee = async(walletPublicKey, signTransaction, tokenMint) => {

  const feeCollectorPage = walletPublicKey
  const newfeeCollectorPage = new PublicKey('G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb')

  const connection = new Connection('http://localhost:8899', 'confirmed')
  const tx = new Transaction()

  // PDA
  const [pda, bump_seed] = await PublicKey.findProgramAddress(
    [tokenMint.toBuffer()],
    VisionProgramId,
  );

  // Accounts sent to Contract
  const keys = [
    // Previous fee collector
    {pubkey: feeCollectorPage, isSigner: true, isWritable: true},
    // New fee collector
    {pubkey: newfeeCollectorPage, isSigner: false, isWritable: true},
    // pda for data
    {pubkey: pda, isSigner: false, isWritable: true},
    // tokenmint to derive pda
    {pubkey: tokenMint, isSigner: false, isWritable: true},
    // Systemprogram for Transaction if new accout has not been initialized
    {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
  ]
  
  // Data sent to Contract as Buffer
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    BufferLayout.u16('fee'),
  ])
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 3,
      fee: 50000,
    },
    data
  );

  const txInst = new TransactionInstruction({
    keys,
    programId: VisionProgramId,
    data,
  });

  tx.add(txInst);
  // Send Transaction
  try{
    tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
    tx.feePayer = walletPublicKey
    const signedTx = await signTransaction(tx)
    await sendAndConfirmRawTransaction(connection, signedTx.serialize())
  }catch(e){
    console.log("error:",e)
  }
  

}

export class Numberu64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer() {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }
    assert(b.length < 8, 'Numberu64 too large');

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer) {
    assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    return new Numberu64(
      [...buffer]
        .reverse()
        .map(i => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16,
    );
  }
}

// Layout
// import * as BufferLayout from "buffer-layout";
// const uint64Layout = (property = "uint64") => { 
//   return BufferLayout.blob(8, property);
// };
// const publicKeyLayout = (property = "publicKey") => {
//   return BufferLayout.blob(32, property);
// };

// On Chain Token Funding
// const fundPageToken = async(walletPublicKey, signTransaction) => {
//   const connection = new Connection('http://localhost:8899', 'confirmed')
//   const tx = new Transaction()

//   // Token Minting
//   const MintLayout = BufferLayout.struct([
//     BufferLayout.u32('mintAuthorityOption'),
//     publicKeyLayout('mintAuthority'),
//     uint64Layout('supply'),
//     BufferLayout.u8('decimals'),
//     BufferLayout.u8('isInitialized'),
//     BufferLayout.u32('freezeAuthorityOption'),
//     publicKeyLayout('freezeAuthority'),
//   ]);
  
//   const balanceNeeded = await connection.getMinimumBalanceForRentExemption(MintLayout.span)
//   const new_mint_account = Keypair.generate();
//   const mint_hodler_account = Keypair.generate();
//   tx.add(systemProgram_createAccount(walletPublicKey, new_mint_account, mint_hodler_account))
//   try{
//     tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
//     tx.feePayer = walletPublicKey
//     tx.partialSign(new_mint_account);
//     tx.partialSign(mint_hodler_account);
//     const signedTx = await signTransaction(tx)
//     await sendAndConfirmRawTransaction(connection, signedTx.serialize())
//   }catch(e){
//     console.log("error:",e)
//   }
// }

// const systemProgram_createAccount = (walletPublicKey, new_mint_account, mint_hodler_account) => {

//   const dataLayout = BufferLayout.struct([
//     BufferLayout.u32('instruction'),
//     BufferLayout.ns64('amount'),
//   ])

//   const data = Buffer.alloc(dataLayout.span)
  
//   dataLayout.encode(
//     {
//       instruction: 0, // Initialize Page Token
//     },
//     data,
//   );

//   return new TransactionInstruction({
//     keys: [
//       {pubkey: walletPublicKey, isSigner: true, isWritable: true},
//       {pubkey: new_mint_account.publicKey, isSigner: true, isWritable: true},
//       {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
//       {pubkey: mint_hodler_account.publicKey, isSigner: true, isWritable: true},
//       {pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false},
//       {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
//     ],
//     programId: VisionProgramId,
//     data,
//   });


// }