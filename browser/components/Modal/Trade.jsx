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
import { MINT_LAYOUT, getBigNumber } from '../../hooks/web3/Layouts';
import BN from 'bn.js';
import * as BufferLayout from "buffer-layout";
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
  const [lamportsAmt, setLamportsAmt] = useState()
  const [amtOut, setAmtOut] = useState()
  const [isBuy, setIsBuy] = useState(true) // true -> Sol to Page // false -> Page to Sol
  const [profile, isLoading, setUser] = useUserProfile()
  const {wallet, connected, connect, publicKey, signTransaction} = useWallet();
  const setModal = useModalStore(state => state.setModal)
  const [pageFee, setPageFee] = useState(0.2)
  const [feeCollector, setFeeCollector] = useState()
  const [collateral, setCollateral] = useState()
  const [tokenSupply, setTokenSupply] = useState()
  const router = useRouter()

  const connectThisWallet = async() => {
    try{
      await connect()
    }catch(err){
      toast.error(err.name)
    }
  }

  useEffect(async() => {
    if(mint){
      // Get Mint Supply / Add listener
      connection.onAccountChange(
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

      connection.onAccountChange(
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
      connection.onAccountChange(
        pda_associatedSolAddress, 
        async info => {
          setCollateral((getBigNumber(info.lamports) - getBigNumber(await connection.getMinimumBalanceForRentExemption(0))))
        },
      );
    }
  }, [mint])

  useEffect(async() => {
    if(lamportsAmt){
      setTokenAmt(null)
      setPrice()
    }
  }, [lamportsAmt])

  useEffect(async() => {
    if(tokenAmt){
      setLamportsAmt(null)
      setPrice()
    }
  }, [tokenAmt])

  useEffect(async() => {
    if(tokenAmt || lamportsAmt){
      setPrice()
    }
  }, [isBuy, tokenSupply, pageFee, collateral])

  const setPrice = () => {
    if(isBuy){
      if(lamportsAmt){
        setAmtOut(tokenSupply * (Math.pow((1 + (lamportsAmt * (1 - 0.01 - pageFee/100000)) / collateral), 0.60976) - 1))
      }else if(tokenAmt){
        setAmtOut(((Math.pow((tokenAmt / tokenSupply + 1), (1/0.60976)) - 1) * collateral) / (1 - 0.01 - pageFee/100000))
      }else{
        setAmtOut(null)
      }
    }else if(!isBuy){
      if(lamportsAmt){
        setAmtOut((-Math.pow(( collateral * (1 - 0.01) - lamportsAmt ), 0.60976) / Math.pow((collateral * (1-0.01)), 0.60976) + 1) * tokenSupply)
      }else if(tokenAmt){
        setAmtOut(collateral * (1 - Math.pow((1 - tokenAmt / tokenSupply), (1/0.60976))) * (1 - 0.01))
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
        {isBuy?<SelectionSol value={(!lamportsAmt && tokenAmt)?amtOut:lamportsAmt} setLamportsAmt={setLamportsAmt}/>:<SelectionPageToken value={(!tokenAmt && lamportsAmt)?amtOut:tokenAmt} setTokenAmt={setTokenAmt}/>}
          <div className={styles.tradeDirectionArrowParent}>
            <div className={styles.tradeDirectionArrowChild}>
              <a onClick={() => setIsBuy(!isBuy)}><Arrow strokeWidth='3'/></a>
            </div>
          </div>
        {isBuy?<SelectionPageToken value={(!tokenAmt && lamportsAmt)?amtOut:tokenAmt} setTokenAmt={setTokenAmt}/>:<SelectionSol value={(!lamportsAmt && tokenAmt)?amtOut:lamportsAmt} setLamportsAmt={setLamportsAmt}/>}
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
      :!mint?
        <a onClick={() => fundPageToken()}>
          <div className={styles.connectWallet}>
            <h2>Fund</h2>
          </div>
        </a>
      :
        <a onClick={() => {
          isBuy?
            buy(lamportsAmt?lamportsAmt:amtOut, tokenAmt?tokenAmt:amtOut)
          :
            sell(tokenAmt?tokenAmt:amtOut, lamportsAmt?lamportsAmt:amtOut)
          }}>
          <div className={styles.connectWallet}>
            <h2>Swap</h2>
          </div>
        </a>
      }
    </div>
  )
  
}

const SelectionSol = ({setLamportsAmt, value}) => {
  return(
    <div className={styles.tradePageInfoParent}>
      <SolanaIcon/>

      <div className={styles.tradePageInfoChild}>
        <h3>
          Solana
        </h3>
        <span className="smalltext">0&nbsp;</span><span className="smalltext">($0)</span>
      </div>

      <NumberFormat value={getBigNumber(value)?(Math.floor(getBigNumber(value)/100000)/10000):''} isNumericString={true} onValueChange={async(values, sourceInfo) => {
        if(sourceInfo.source == 'event'){
          setLamportsAmt(getBigNumber(values.floatValue*1000000000))
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}

const SelectionPageToken = ({setTokenAmt, value}) => {
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
        <span className="smalltext">0&nbsp;</span><span className="smalltext">($0)</span>
      </div>
      <NumberFormat value={getBigNumber(value)?(Math.floor(getBigNumber(value)/100000)/10000):''} isNumericString={true} onValueChange={async(values, sourceInfo) => {
        if(sourceInfo.source == 'event'){
          setTokenAmt(getBigNumber(values.floatValue*1000000000))
        }
      }} allowedDecimalSeparators={','} placeholder="0" thousandSeparator=" " allowNegative={false} decimalSeparator="."/>

    </div>
  )
}

// export class Numberu64 extends BN {
//   /**
//    * Convert to Buffer representation
//    */
//   toBuffer() {
//     const a = super.toArray().reverse();
//     const b = Buffer.from(a);
//     if (b.length === 8) {
//       return b;
//     }
//     assert(b.length < 8, 'Numberu64 too large');

//     const zeroPad = Buffer.alloc(8);
//     b.copy(zeroPad);
//     return zeroPad;
//   }

//   /**
//    * Construct a Numberu64 from Buffer representation
//    */
//   static fromBuffer(buffer) {
//     assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
//     return new Numberu64(
//       [...buffer]
//         .reverse()
//         .map(i => `00${i.toString(16)}`.slice(-2))
//         .join(''),
//       16,
//     );
//   }
// }