import styles from '../../styles/modal/trade.module.css'
import { useState, useEffect } from 'react'
import { useModalStore } from '../../store/modal'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import Arrow from '../../assets/ArrowDown'

export default function Trade() {
  const [selectedRoute, setSelectedRoute] = useState(1)
  const [fromTo, setFromTo] = useState(0) // 0 -> Sol to Page // 1 -> Page to Sol
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
            Info
          </h1>
          <h1 onClick={() => setSelectedRoute(0)} style={{marginRight: '10px'}} className={`${selectedRoute == 1?styles.highlight:null}`}>
            Swap
          </h1>
          <h1 onClick={() => setSelectedRoute(1)} style={{marginLeft: '10px'}} className={`${selectedRoute == 2?styles.highlight:null}`}>
            %
          </h1>
      </div>

      <div className={styles.selectionParent}>
        {fromTo == 0 ?
          <>
            <SelectionPageToken/>
              <div>
                <div style={{width: '100%', height: '20px', borderBottom: '2px solid #444', textAlign: 'center'}}>
                  <span style={{fontSize: '40px', backgroundColor: '#F3F5F6', padding: '0 10px'}}>
                    <a><Arrow strokeWidth='3'/></a>
                  </span>
                </div>
              </div>
            <SelectionSol/>
          </>
        :
          <>
            <SelectionSol/>
              <div className={styles.selectionSeperator}>
                <a><Arrow className='pointer' strokeWidth='3'/></a>
              </div>
            <SelectionPageToken/>
          </>
        }
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

const SelectionSol = (isFirst) => {
  return(
    <div>

    </div>
  )
}

const SelectionPageToken = (isFirst) => {
  return(
    <div>

    </div>
  )
}

import { Connection, SYSVAR_RENT_PUBKEY, Account, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { connect } from 'socket.io-client';
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
const VisionProgramId = new PublicKey('64YG9ttAgP9ScjDmEVb5oZVTMdb6ajAiHVJBwjMeGtCz')

const fundPageToken = async() => {

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