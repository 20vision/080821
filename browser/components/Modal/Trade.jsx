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
import axios from 'axios'
import { useRouter } from 'next/router';
import assert from 'assert';
import { Connection, SYSVAR_RENT_PUBKEY, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { MINT_LAYOUT, getBigNumber, ACCOUNT_LAYOUT } from '../../hooks/web3/Layouts';
import BN from 'bn.js';
import * as BufferLayout from "buffer-layout";
import useSolPrice from '../../hooks/web3/useSolPrice';
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
const VisionProgramId = new PublicKey('8rb6GeD8i2g3hcfN73xnc9kRbnwepeNjHJyXK5DtyUm8')
const connection = new Connection('http://localhost:8899', 'confirmed')
// const BufferLayout.nu64 = (property = "uint64") => { 
//   return BufferLayout.blob(8, property);
// };
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


export default function Trade() {
  const [selectedRoute, setSelectedRoute] = useState(1)
  const [mint, setMint] = useState()
  const [tokenAmt, setTokenAmt] = useState()
  const [solAmt, setsolAmt] = useState()
  const [amtOut, setAmtOut] = useState()
  const [isBuy, setIsBuy] = useState(true) // true -> Sol to Page // false -> Page to Sol
  const [profile, isLoading, setUser] = useUserProfile()
  const {wallet, connected, connect, publicKey, signTransaction} = useWallet();
  const setModal = useModalStore(state => state.setModal)
  const [pageFee, setPageFee] = useState(0.2)
  const [feeCollector, setFeeCollector] = useState()
  const [collateral, setCollateral] = useState()
  const [tokenSupply, setTokenSupply] = useState()
  const [lamportsBalance, setLamportsBalance] = useState()
  const [tokenBalance, setTokenBalance] = useState()
  const [tokenAccountListenerId, setTokenAccountListenerId] = useState()
  const router = useRouter()
  const solPrice = useSolPrice()

  const connectThisWallet = async() => {
    try{
      await connect()
    }catch(err){
      toast.error(err.name)
    }
  }

  const checkAndGetTokenAccountInfo = async(listenBool) => {
    if(!mint || !publicKey) throw new Error('An error occurred')
    const associatedUserPubKey = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,mint,publicKey)
    const associatedUserAccoutInfo = await connection.getAccountInfo(associatedUserPubKey)
    if ((listenBool == false) || (associatedUserAccoutInfo === null) || (!associatedUserAccoutInfo.owner.equals(TOKEN_PROGRAM_ID)) || (associatedUserAccoutInfo.data.length != ACCOUNT_LAYOUT.span)) {
      setTokenBalance(null)
      if(tokenAccountListenerId){
        await connection.removeAccountChangeListener(tokenAccountListenerId)
      }
    }else{
      setTokenBalance(getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(associatedUserAccoutInfo.data)).amount))
      if(!tokenAccountListenerId && listenBool){
        setTokenAccountListenerId(connection.onAccountChange(
          associatedUserPubKey,
          async info => {
            if ((info === null) || (!info.owner.equals(TOKEN_PROGRAM_ID)) || (info.data.length != ACCOUNT_LAYOUT.span)) {
              setTokenBalance(null)
            }else{
              setTokenBalance(getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(info.data)).amount))
            }
          },
        ))
      }
    }
  }

  useEffect(async() => {
    if(publicKey){
      setLamportsBalance(getBigNumber(await connection.getBalance(publicKey)))
      let lamportsBalanceSocketId = connection.onAccountChange(
        publicKey,
        async info => {
          setLamportsBalance(getBigNumber(info.lamports))
        },
      );

      if(mint){
        await checkAndGetTokenAccountInfo(true)
      }
    }
  }, [mint, publicKey])

  useEffect(async() => {
    if(mint){
      // Get Mint Supply / Add listener
      let mintSocketId = connection.onAccountChange(
        mint,
        async info => {
          setTokenSupply(getBigNumber((MINT_LAYOUT.decode(Buffer.from(info.data))).supply) + 1000000000)
        },
      );
      const mintInfo = await connection.getAccountInfo(mint)
      if (mintInfo === null) {
        throw new Error('Failed to find mint account');
      }
      if (!mintInfo.owner.equals(TOKEN_PROGRAM_ID)) {
        throw new Error(`Invalid mint owner: ${JSON.stringify(mintInfo.owner)}`);
      }
      if (mintInfo.data.length != MINT_LAYOUT.span) {
        throw new Error(`Invalid mint size`);
      }
      setTokenSupply(getBigNumber((MINT_LAYOUT.decode(Buffer.from(mintInfo.data))).supply) + 1000000000)

      
      // Get Fee / Add listener
      
      const [pda, bump_seed] = await PublicKey.findProgramAddress(
        [mint.toBuffer()],
        VisionProgramId,
      );
      setPageFee(getAmmInfo(await connection.getAccountInfo(pda)).fee)

      let pdaSocketId = connection.onAccountChange(
        pda, 
        async info => {
          setPageFee(getAmmInfo(info).fee)
        },
      );
      
      const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
        [pda.toBuffer()],
        VisionProgramId,
      )
      setCollateral((getBigNumber(await connection.getBalance(pda_associatedSolAddress)) - getBigNumber(await connection.getMinimumBalanceForRentExemption(0))))
      let pdaAssociatedSolSocketId = connection.onAccountChange(
        pda_associatedSolAddress, 
        async info => {
          setCollateral((getBigNumber(info.lamports) - getBigNumber(await connection.getMinimumBalanceForRentExemption(0))))
        },
      );

      
    }
  }, [mint])

  useEffect(async() => {
    if(solAmt){
      setTokenAmt(null)
      setPrice()
    }
  }, [solAmt])

  useEffect(async() => {
    if(tokenAmt){
      setsolAmt(null)
      setPrice()
    }
  }, [tokenAmt])

  useEffect(async() => {
    if(tokenAmt || solAmt){
      setPrice()
    }
  }, [isBuy, tokenSupply, pageFee, collateral])

  const setPrice = () => {
    if(isBuy){
      if(solAmt){
        setAmtOut(tokenSupply * (Math.pow((1 + ((solAmt * 1000000000) * (1 - 0.01 - pageFee/100000)) / collateral), 0.60976) - 1))
      }else if(tokenAmt){
        setAmtOut(((Math.pow(((tokenAmt * 1000000000) / tokenSupply + 1), (1/0.60976)) - 1) * collateral) / (1 - 0.01 - pageFee/100000))
      }else{
        setAmtOut(null)
      }
    }else if(!isBuy){
      if(solAmt){
        setAmtOut((-Math.pow(( collateral * (1 - 0.01) - (solAmt * 1000000000) ), 0.60976) / Math.pow((collateral * (1-0.01)), 0.60976) + 1) * tokenSupply)
      }else if(tokenAmt){
        setAmtOut(collateral * (1 - Math.pow((1 - (tokenAmt * 1000000000) / tokenSupply), (1/0.60976))) * (1 - 0.01))
      }else{
        setAmtOut(null)
      }
    }

    //setAmtOut(price)
  }

  useEffect(async() => {
    if(router.query.page){
      try{
        await axios.get(`http://localhost:4000/get/page/${router.query.page}/trade_info`,{
          withCredentials: true
        }
        ).then(async response => {
          if(response.data.public_key){
            setFeeCollector(new PublicKey(response.data.public_key))
          }
          if(response.data.token_mint_address){
            setMint(new PublicKey(response.data.token_mint_address))
          }
        })
        .catch(error =>{
          if(error.response) toast.error(`${error.response.status}: ${error.response.data}`)
          return
        })
      }catch(err){
        if(error.response) toast.error(`${error.response.status?error.response.status:'400'}: ${error.response.data?error.response.data:'An error occurred'}`)
        return
      }
    }
  }, [router.query.page])

  const getAmmInfo = (info) => {
    //const info = await connection.getAccountInfo(pubKey, commitment)
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
    return accountInfo
  }

  const fundPageToken = async() => {
    const connection = new Connection('http://localhost:8899', 'confirmed')
    const tx = new Transaction()
  //! Fetch Fee collector from DB, for now random pubkey:
  
    const new_mint_keypair = Keypair.generate();
  
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
      {pubkey: publicKey, isSigner: true, isWritable: true},
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
      tx.feePayer = publicKey
      tx.partialSign(new_mint_keypair);
      const signedTx = await signTransaction(tx)
      axios.post('http://localhost:4000/post/fundPageToken',{tx: signedTx.serialize(), unique_pagename: router.query.page},{
        withCredentials: true
      }
      ).then(async response => {
        setMint(new_mint_keypair.publicKey)
      })
      .catch(error =>{
        if(error.response) toast.error(`${error.response.status?error.response.status:'400'}: ${error.response.data?error.response.data:'An error occurred'}`)
        return
      })
    }catch(e){
      console.log("error:",e)
    }
  }

  const buy = async(amountIn, minimumAmountOut) => {
    const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
      VisionProgramId,
    );
  
    const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
      [pda.toBuffer()],
      VisionProgramId,
    )
  
  
    let pageToken = new Token(connection, mint, TOKEN_PROGRAM_ID, publicKey)
  
    const user_associatedTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      publicKey
    )
    var tokenAccountInitialization = false
    try {
      await pageToken.getAccountInfo(user_associatedTokenAddress)
    }catch(err){
      if (err.message === 'Failed to find account' || err.message === 'Invalid account owner'){
        tokenAccountInitialization = true
        tx.add(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            user_associatedTokenAddress,
            publicKey,
            publicKey,
          )
        )
      }else {
        throw err;
      }
    }
  
    // Accounts sent to Contract
    const keys = [
      // Funder - Pays for funding and first swap
      {pubkey: publicKey, isSigner: true, isWritable: true},
      // Funder - Associated Token Address
      {pubkey: user_associatedTokenAddress, isSigner: false, isWritable: true},
      // Funder - Pays for funding and first swap
      {pubkey: pda, isSigner: false, isWritable: true},
      // Pda bump seed for program derived address of Sol account
      {pubkey: pda_associatedSolAddress, isSigner: false, isWritable: true},
      // Funder - Pays for funding and first swap
      {pubkey: mint, isSigner: false, isWritable: true},
      // Page Fee Collector
      {pubkey: feeCollector, isSigner: false, isWritable: true},
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
      BufferLayout.nu64('amountIn'),
      BufferLayout.nu64('minimumAmountOut'),
    ])
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 1,
        //amountIn: new Numberu64(amountIn).toBuffer(),
        amountIn: getBigNumber(amountIn),
        minimumAmountOut: (getBigNumber(minimumAmountOut) * 0.98),
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
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
      setAmtOut(null)
      setTokenAmt(null)
      setsolAmt(null)
      if(tokenAccountInitialization){
        await checkAndGetTokenAccountInfo(true)
      }
    }catch(e){
      console.log("error:",e)
    }
    
  
  }
  
  
  const sell = async(amountIn, minimumAmountOut) => {
    const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
      VisionProgramId,
    );
    const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
      [pda.toBuffer()],
      VisionProgramId,
    )

    const user_associatedTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      publicKey
    )
  
    // Accounts sent to Contract
    const keys = [
      // Funder - Pays for funding and first swap
      {pubkey: publicKey, isSigner: true, isWritable: true},
      // Funder - Associated Token Address
      {pubkey: user_associatedTokenAddress, isSigner: false, isWritable: true},
      // Funder - Pays for funding and first swap
      {pubkey: pda, isSigner: false, isWritable: true},
      // Pda bump seed for program derived address of Sol account
      {pubkey: pda_associatedSolAddress, isSigner: false, isWritable: true},
      // Funder - Pays for funding and first swap
      {pubkey: mint, isSigner: false, isWritable: true},
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
      BufferLayout.nu64('amountIn'),
      BufferLayout.nu64('minimumAmountOut'),
    ])
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 2,
        amountIn: getBigNumber(amountIn),
        minimumAmountOut: getBigNumber(minimumAmountOut)*0.98,
      },
      data
    );
  
    const txInst = new TransactionInstruction({
      keys,
      programId: VisionProgramId,
      data,
    });
  
    tx.add(txInst);
    var closingAccount = false
    if(amountIn == tokenBalance){
      closingAccount = true
      tx.add(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          user_associatedTokenAddress,
          publicKey,
          publicKey,
          [],
        ),
      )
    }

    // Send Transaction
    try{
      if(closingAccount == true){
        await checkAndGetTokenAccountInfo(false)
        setTokenBalance(null)
      }
      tx.recentBlockhash = (await connection.getRecentBlockhash("confirmed")).blockhash
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
      setAmtOut(null)
      setTokenAmt(null)
      setsolAmt(null)
    }catch(e){
      if(closingAccount == true){
        await checkAndGetTokenAccountInfo(true)
      }
      console.log("error:",e)
    }
    
  
  }
  
  
  const changeFee = async() => {
    const feeCollectorPage = publicKey
    const newfeeCollectorPage = new PublicKey('G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb')
  
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
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
      {pubkey: mint, isSigner: false, isWritable: true},
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
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
    }catch(e){
      console.log("error:",e)
    }
  }
  
// HTML
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
        {isBuy?<SelectionSol solPrice={solPrice} lamportsBalance={lamportsBalance} solAmt={solAmt} amtOut={(!solAmt && tokenAmt)?amtOut:null} setsolAmt={setsolAmt}/>:<SelectionPageToken tokenBalance={tokenBalance} tokenAmt={tokenAmt} amtOut={(solAmt && !tokenAmt)?amtOut:null} setTokenAmt={setTokenAmt}/>}
          <div className={styles.tradeDirectionArrowParent}>
            <div className={styles.tradeDirectionArrowChild}>
              <a onClick={() => setIsBuy(!isBuy)}><Arrow strokeWidth='3'/></a>
            </div>
          </div>
        {isBuy?<SelectionPageToken tokenBalance={tokenBalance} tokenAmt={tokenAmt} amtOut={(solAmt && !tokenAmt)?amtOut:null} setTokenAmt={setTokenAmt}/>:<SelectionSol solPrice={solPrice} lamportsBalance={lamportsBalance} solAmt={solAmt} amtOut={(!solAmt && tokenAmt)?amtOut:null} setsolAmt={setsolAmt}/>}
      </div>

      <div className={`smalltext ${styles.priceInDollar}`}>
        ~$400USD
      </div>

      {!profile.username || !wallet?
        <a onClick={() => setModal(1)}>
          <div className={styles.button}>
            <h2>Connect Wallet</h2>
          </div>
        </a>
      :!connected && wallet?
        <a onClick={() => connectThisWallet()}>
          <div className={styles.button}>
            <h2>Connect Wallet</h2>
          </div>
        </a>
      :!mint?
        <a onClick={() => fundPageToken()}>
          <div className={styles.button}>
            <h2>Fund</h2>
          </div>
        </a>
      :
        <a onClick={() => {
          isBuy?
            buy(solAmt?(solAmt * 1000000000):amtOut, tokenAmt?(tokenAmt * 1000000000):amtOut)
          :
            sell(tokenAmt?(tokenAmt * 1000000000):amtOut, solAmt?(solAmt * 1000000000):amtOut)
          }}>
          <div className={`${
          (((lamportsBalance == null) && isBuy) || ((tokenBalance == null) && !isBuy) || (isBuy && ((solAmt * 1000000000) > lamportsBalance)) || (!isBuy && ((tokenAmt * 1000000000) > tokenBalance)) || !amtOut || (!solAmt && !tokenAmt) || ((solAmt * 1000000000 < 0)) || ((tokenAmt * 1000000000 < 0)))?
            styles.buttonInvalid
          :
            null
          } ${styles.button}`}>
            <h2>Swap</h2>
          </div>
        </a>
      }
    </div>
  )
  
}

const SelectionSol = ({setsolAmt, solAmt, amtOut, lamportsBalance, solPrice}) => {
  return(
    <div className={styles.tradePageInfoParent}>
      <SolanaIcon/>

      <div className={styles.tradePageInfoChild}>
        <h3>
          Solana
        </h3>
        <span className="smalltext">{
        (lamportsBalance != null) && (lamportsBalance/1000000000 < 1)?
          (lamportsBalance/1000000000)
        :(lamportsBalance != null)?
          (Math.floor(lamportsBalance/100000)/10000)
        :
          '?'
        }&nbsp;</span><span className="smalltext">(${(solPrice && (solPrice.status == 'success'))?Math.round(solPrice.price * (lamportsBalance/10000000))/100:'?'})</span>
      </div>

      <NumberFormat value={
        (solAmt != null)?
          solAmt
        : (amtOut != null) && (amtOut>1000000000)?
          (Math.floor(amtOut/100000)/10000)
        : (amtOut != null)?
          (Math.floor(amtOut/1000)/1000000)
        :
          ''
        } onValueChange={async(values, sourceInfo) => {
        if(sourceInfo.source == 'event'){
          setsolAmt(values.floatValue)
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}

const SelectionPageToken = ({setTokenAmt, tokenAmt, amtOut, tokenBalance}) => {
  const page = usePageSelectedStore(state => state.page)
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
        <span className="smalltext">{
        (tokenBalance != null) && (tokenBalance/1000000000 < 1)?
          (tokenBalance/1000000000)
        :(tokenBalance != null)?
          (Math.floor(tokenBalance/100000)/10000)
        :
          '?'
        }&nbsp;</span><span className="smalltext">($0)</span>
      </div>
      <NumberFormat value={
        (tokenAmt != null)?
          tokenAmt
        : (amtOut != null) && (amtOut>1000000000)?
          (Math.floor(amtOut/100000)/10000)
        : (amtOut != null)?
          (Math.floor(amtOut/1000)/1000000)
        :
          ''
        } onValueChange={async(values, sourceInfo) => {
        if(sourceInfo.source == 'event'){
          setTokenAmt(values.floatValue)
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}
