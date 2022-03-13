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
import Loading from '../../assets/Loading/Loading'
import { SYSVAR_RENT_PUBKEY, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction, SendTransactionError } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { getBigNumber, connection, MINT_LAYOUT, ACCOUNT_LAYOUT, VISION_PROGRAM_ID } from '../../hooks/web3/useContract';
import * as BufferLayout from "buffer-layout";
import useSolPrice from '../../hooks/web3/useSolPrice';

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
  const [selectedRoute, setSelectedRoute] = useState(0)
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
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const solPrice = useSolPrice()
  const [queryRoute, setQueryRoute] = useState(() => {
    if(router.query && router.query.page){
      return(router.query.page)
    }else if(router.query.index[0]){
      return(router.query.index[0])
    }
  })

  const connectThisWallet = async() => {
    try{
      await connect()
    }catch(err){
      toast.error(err.name)
    }
  }

  const infoToTokenBalance = (info) =>{
    if ((info === null) || (info.lamports == 0) || (!info.owner.equals(TOKEN_PROGRAM_ID)) || (info.data.length != ACCOUNT_LAYOUT.span)) {
      if(tokenBalance){
        setTokenBalance(null)
      }
    }else{
      setTokenBalance(getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(info.data)).amount))
    }
  }

  const [lamportsBalanceSocketId, setLamportsBalanceSocketId] = useState()
  useEffect(async() => {
    if(publicKey){
      setLamportsBalance(getBigNumber(await connection.getBalance(publicKey)))
      setLamportsBalanceSocketId(connection.onAccountChange(
        publicKey,
        async info => {
          setLamportsBalance(getBigNumber(info.lamports))
        },
      ))
    }
    return async() => {
      if(lamportsBalanceSocketId){
        await connection.removeAccountChangeListener(lamportsBalanceSocketId)
      }
    }
  }, [publicKey])

  const [tokenBalanceSocketId, setTokenBalanceSocketId] = useState()
  useEffect(async() => {
    if(mint && publicKey){
      const associatedUserPubKey = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,mint,publicKey)
      const associatedUserAccoutInfo = await connection.getAccountInfo(associatedUserPubKey)
      infoToTokenBalance(associatedUserAccoutInfo)
      setTokenBalanceSocketId(connection.onAccountChange(
        associatedUserPubKey,
        async info => {
          infoToTokenBalance(info)
        },
      ))
      
    }
    return () => {
      if(tokenBalanceSocketId){
        connection.removeAccountChangeListener(tokenBalanceSocketId)
      }
    }
  }, [mint,publicKey])

  const [pdaSocketId, setPdaSocketId] = useState()
  const [pdaAssociatedSolSocketId, setPdaAssociatedSolSocketId] = useState()
  const [mintSocketId, setMintSocketId] = useState()
  useEffect(async() => {

    if(mint){
      // Get Mint Supply / Add listener
      setMintSocketId(connection.onAccountChange(
        mint,
        async info => {
          setTokenSupply(getBigNumber((MINT_LAYOUT.decode(Buffer.from(info.data))).supply) + 1000000000)
        },
      ))
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
        VISION_PROGRAM_ID,
      );
      setPageFee(getAmmInfo(await connection.getAccountInfo(pda)).fee)

      setPdaSocketId(connection.onAccountChange(
        pda, 
        async info => {
          setPageFee(getAmmInfo(info).fee)
        },
      ))
      
      const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
        [pda.toBuffer()],
        VISION_PROGRAM_ID,
      )
      setCollateral((getBigNumber(await connection.getBalance(pda_associatedSolAddress)) - getBigNumber(await connection.getMinimumBalanceForRentExemption(0))))
      setPdaAssociatedSolSocketId(connection.onAccountChange(
        pda_associatedSolAddress, 
        async info => {
          setCollateral((getBigNumber(info.lamports) - getBigNumber(await connection.getMinimumBalanceForRentExemption(0))))
        },
      ))
    }

    return async() => {
      if(pdaSocketId){
        await connection.removeAccountChangeListener(pdaSocketId)
      }
      if(pdaAssociatedSolSocketId){
        await connection.removeAccountChangeListener(pdaAssociatedSolSocketId)
      }
      if(mintSocketId){
        await connection.removeAccountChangeListener(mintSocketId)
      }
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
    if(queryRoute){
      try{
        await axios.get(`http://localhost:4000/get/page/${queryRoute}/trade_info`,{
          withCredentials: true
        }
        ).then(async response => {
          if(response.data.fee_collector){
            setFeeCollector(new PublicKey(response.data.fee_collector))
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
  }, [queryRoute])

  const getAmmInfo = (info) => {
    //const info = await connection.getAccountInfo(pubKey, commitment)
    if (info == null){
      throw new Error("Failed to find account");
    }
    if (!info.owner.equals(VISION_PROGRAM_ID)) {
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
    const tx = new Transaction()
  //! Fetch Fee collector from DB, for now random pubkey:
  
    const new_mint_keypair = Keypair.generate();
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [new_mint_keypair.publicKey.toBuffer()],
      VISION_PROGRAM_ID,
    );
  
    const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
      [pda.toBuffer()],
      VISION_PROGRAM_ID,
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
      programId: VISION_PROGRAM_ID,
      data,
    });
  
    tx.add(txInst);
  
    // Send Transaction
    try{
      tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash
      tx.feePayer = publicKey
      tx.partialSign(new_mint_keypair);
      const signedTx = await signTransaction(tx)
      axios.post('http://localhost:4000/post/fundPageToken',{tx: signedTx.serialize(), unique_pagename: queryRoute},{
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
      toast.error('Transaction failed')
    }
  }

  const buy = async(amountIn, minimumAmountOut) => {
    setLoading(true)
    const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
      VISION_PROGRAM_ID,
    );
  
    const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
      [pda.toBuffer()],
      VISION_PROGRAM_ID,
    )
  
  
    let pageToken = new Token(connection, mint, TOKEN_PROGRAM_ID, publicKey)
  
    const user_associatedTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      publicKey
    )
    try {
      await pageToken.getAccountInfo(user_associatedTokenAddress)
    }catch(err){
      if (err.message === 'Failed to find account' || err.message === 'Invalid account owner'){
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
      programId: VISION_PROGRAM_ID,
      data,
    });
  
  
    tx.add(txInst);
    // Send Transaction
    try{
      tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
      setAmtOut(null)
      setTokenAmt(null)
      setsolAmt(null)
      setLoading(false)
    }catch(e){
      console.log(e)
      toast.error('Transaction failed')
      setLoading(false)
    }
    
  
  }
  
  
  const sell = async(amountIn, minimumAmountOut) => {
    setLoading(true)
    const feeCollectorProvider = new PublicKey('CohZhJhnHkdutc7iktrrGVUX4oUM3VctSX7DybSzRN4f')
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
      VISION_PROGRAM_ID,
    );
    const [pda_associatedSolAddress, __bump_seed] = await PublicKey.findProgramAddress(
      [pda.toBuffer()],
      VISION_PROGRAM_ID,
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
      programId: VISION_PROGRAM_ID,
      data,
    });
  
    tx.add(txInst);
    if(amountIn == tokenBalance){
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
      tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
      if(tokenBalance == amountIn){
        setTokenBalance(null)
        connection.removeAccountChangeListener(tokenBalanceSocketId)
      }
      setAmtOut(null)
      setTokenAmt(null)
      setsolAmt(null)
      setLoading(false)
    }catch(e){
      console.log("error:",e)
      toast.error('Transaction failed')
      setLoading(false)
    }
    
  
  }
  
  
  const changeFee = async() => {
    setLoading(true)
    const feeCollectorPage = publicKey
    const newfeeCollectorPage = new PublicKey('G1tUHWDaR1Jerzz9MdwPfxoXVMmwT6kU4DmncZmke5gb')
  
    const tx = new Transaction()
  
    // PDA
    const [pda, bump_seed] = await PublicKey.findProgramAddress(
      [mint.toBuffer()],
      VISION_PROGRAM_ID,
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
      programId: VISION_PROGRAM_ID,
      data,
    });
  
    tx.add(txInst);
    // Send Transaction
    try{
      tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash
      tx.feePayer = publicKey
      const signedTx = await signTransaction(tx)
      await sendAndConfirmRawTransaction(connection, signedTx.serialize())
      setLoading(false)
    }catch(e){
      console.log(e)
      toast.error('Transaction failed')
      setLoading(false)
    }
  }
  
  const tokenAmtDollar = (amt) => {
    if(collateral && amt && tokenSupply && solPrice.status == 'success'){
      return Math.round((collateral * (1 - Math.pow((1 - amt / tokenSupply), (1/0.60976)))) / 10000000*solPrice.price)/100
    }
    return null
  }
  
// HTML
  return (
    <div className={styles.container}>
      <div className={`noselect ${styles.header}`}>
          <h1 onClick={() => setSelectedRoute(0)} style={{marginLeft: '10px'}} className={`${selectedRoute == 0?styles.highlight:null}`}>
            Swap
          </h1>
          <h1 onClick={() => setSelectedRoute(1)} style={{marginRight: '10px'}} className={`${selectedRoute == 1?styles.highlight:null}`}>
            Info
          </h1>
          {/* <h1 onClick={() => setSelectedRoute(2)} style={{marginLeft: '10px'}} className={`${selectedRoute == 2?styles.highlight:null}`}>
            %
          </h1> */}
      </div>

      { selectedRoute == 0?
          <>
            <div className={styles.selectionParent}>
              {isBuy?<SelectionSol connected={connected} solPrice={solPrice} lamportsBalance={lamportsBalance} solAmt={solAmt} amtOut={(!solAmt && tokenAmt)?amtOut:null} setsolAmt={setsolAmt}/>:<SelectionPageToken connected={connected} tokenDollarAmt={tokenAmtDollar(tokenBalance)} tokenBalance={tokenBalance} tokenAmt={tokenAmt} amtOut={(solAmt && !tokenAmt)?amtOut:null} setTokenAmt={setTokenAmt}/>}
                <div className={styles.tradeDirectionArrowParent}>
                  <div className={styles.tradeDirectionArrowChild}>
                    <a onClick={() => setIsBuy(!isBuy)}><Arrow strokeWidth='3'/></a>
                  </div>
                </div>
              {isBuy?<SelectionPageToken connected={connected} tokenDollarAmt={tokenAmtDollar(tokenBalance)} tokenBalance={tokenBalance} tokenAmt={tokenAmt} amtOut={(solAmt && !tokenAmt)?amtOut:null} setTokenAmt={setTokenAmt}/>:<SelectionSol connected={connected} solPrice={solPrice} lamportsBalance={lamportsBalance} solAmt={solAmt} amtOut={(!solAmt && tokenAmt)?amtOut:null} setsolAmt={setsolAmt}/>}
            </div>
            <div className={`smalltext ${styles.priceInDollar}`}>
              ~$
              {tokenAmt && tokenAmtDollar(tokenAmt * 1000000000) > 0?
                tokenAmtDollar(tokenAmt * 1000000000)
              :
              solAmt && (Math.round(solAmt * solPrice.price *100)/100) > 0?
                Math.round(solAmt * solPrice.price *100)/100
              :
              0
            }
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
                (loading || ((lamportsBalance == null) && isBuy) || ((tokenBalance == null) && !isBuy) || (isBuy && ((solAmt * 1000000000) > lamportsBalance)) || (!isBuy && ((tokenAmt * 1000000000) > tokenBalance)) || !amtOut || (!solAmt && !tokenAmt) || ((solAmt * 1000000000 < 0)) || ((tokenAmt * 1000000000 < 0)))?
                  styles.buttonInvalid
                :
                  null
                } ${styles.button}`}>
                  {loading?
                    <Loading/>
                  :
                    <h2>Swap</h2>
                  }
                </div>
              </a>
            }
          </>
        :
        <>
          <span>
            Page Tokens create a win/win situation, where users help Pages to achieve their Vision without going empty-handed.
            <br/>
            With uniswap and bancor being our role models, tokens are priced using the &nbsp;<a href='https://docs.bancor.network/ethereum-contracts/ethereum-api-reference/converter/bancorformula' target="_blank" style={{textDecoration: 'underline'}}>bancor formula</a>.
            <br/>
            For now, Tokens can mainly be used to participate in <a 
            style={{textDecoration: 'underline'}}
            href={`/forum/${queryRoute}`}>Page Topics</a>.
            <br/>
            To further compentsate Pages for their great work, they receive a self-chosen Royalty Fee for every token being bought. 
            <br/>
            20Vision's model is also - currently charging a 1% fee on each transaction.
            <br/>
            <br/>
            <br/>
            <b>Circulating Supply:</b>&nbsp;{tokenSupply?Math.floor((tokenSupply - 1000000000)/1000000000):0}
            <br/>
            <b>Page Fee:</b>&nbsp;{pageFee?pageFee/1000:2.5}%
            <br/>
            <div style={{display: 'flex', justifyContent: 'center', minWidth: '1px'}}>
              <div><b>Mint:</b></div>&nbsp;
              {mint?
                <div style={{flexShrink: '1', minWidth: '1px'}}><a href={`https://explorer.solana.com/address/${mint}`} target="_blank" style={{textDecoration: 'underline'}} className={'overflowTextDot'}>{mint.toString()}</a></div>
              :
                '-'
              }
            
            </div>
            

            {/* Capitalism at it's essence is a Feedback-loop. 
            Investors allocate funds to Companies. 
            Companies create goods or services.
            Consumers choose upon the quality of goods and services.
            Companies that outperformed, have proven their capability, thus should scale.
            Investors that chose the winner, have proven their capability of choice, thus should scale in choice.
            Although the core concept seems reasonable, money abstracts value in a large way.
            Value should not be misinterpreted. As companies that create more worse than good, are still often profitable.
            Humanity shouldn't loose 
            // At it's core, value should be amount of positiveImapce x number of people impacted - amount of negative Impact x number of people impacted. */}
          </span>
          <br/>


        </>
      }
    </div>
  )
  
}

const SelectionSol = ({setsolAmt, solAmt, amtOut, lamportsBalance, solPrice, connected}) => {
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
        :connected?
        'Balance: 0'
        :
          null
        }&nbsp;</span><span className="smalltext">{(lamportsBalance && solPrice && (solPrice.status == 'success'))?('($'+Math.round(solPrice.price * (lamportsBalance/10000000))/100) + ')':null}</span>
      </div>

      <NumberFormat className={styles.input} value={
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

const SelectionPageToken = ({setTokenAmt, tokenAmt, amtOut, tokenBalance, tokenDollarAmt, connected}) => {
  const page = usePageSelectedStore(state => state.page)
  return(
    <div className={styles.tradePageInfoParent}>

      <div className={styles.pageIcon}>
        {page.page_icon.length > 6 ?
            <img src={page.page_icon}/>
        :
            <PageIcon color={'#'+page.page_icon}/>
        }
      </div>

      <div className={styles.tradePageInfoChild}>
        <h3>
          /{page.unique_pagename}
        </h3>
        <span className="smalltext">{
        (tokenBalance != null) && (tokenBalance/1000000000 < 1)?
          (tokenBalance/1000000000)
        :(tokenBalance != null)?
          (Math.floor(tokenBalance/100000)/10000)
        :connected?
          'Balance: 0'
        :
          null
        }&nbsp;</span><span className="smalltext">{(tokenBalance && tokenDollarAmt)?'($'+tokenDollarAmt+')':null}</span>
      </div>
      <NumberFormat className={styles.input} value={
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
