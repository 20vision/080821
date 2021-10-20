import styles from "../../styles/modal/connectWallet.module.css"
import modalStyle from '../../styles/modal/index.module.css'
import axios from 'axios'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../../assets/Loading/Loading'
import useUsernameValidation from "../../hooks/User/useUsernameValidation"
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "react-toastify"
import bs58 from 'bs58';
export default function ConnectWallet() {
    const [step, setStep] = useState(1)
    const [selectedWallet, setSelectedWallet] = useState()
    const message = new TextEncoder().encode(`Sign this Message to verify Wallet Ownership and Log Into 20.Vision.`);
    const [username, setUsername, valid, errorMsg, loading, publishNewUsername] = useUsernameValidation()
    const {
        wallets,
        connecting,
        connected,
        select,
        connect,
        ready,
        adapter,
        wallet,
        publicKey,
        signMessage
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

    async function CreateUser(){
        let signature
        try{
            signature = await SignMsg()
        }catch(e){
            return
        }

        axios.post('http://localhost:4000/wallet/connect',{username: username, publicKey: publicKey.toString(), signature: signature},{
            withCredentials: true
        }
        ).then(async response => {
            Router.reload(window.location.pathname)
        })
        .catch(error =>{
            if(error.response) toast.error(`${error.response.status}: An error occured`)
        })
    }
    const unselectWallet = () => {
        select()
        setSelectedWallet()
    }

    const SignMsg = () => new Promise(async(resolve, reject) => {
        if(!publicKey){
            toast.error('Public Key not found')
            unselectWallet()
            reject()
        }
        let signature = null

        try{
            signature = await signMessage(message)
        }catch(e){
            toast.error('Failed to Sign Message')
            unselectWallet()
            reject()
        }

        if(!signature){
            toast.error('Failed to Sign Message')
            unselectWallet()
            reject()
        }

        resolve(bs58.encode(signature))
    })

    const SignIn = async() => {
        console.log('run as well')
        let signature = null
        try{
            signature = await SignMsg()
        }catch(e){
            return
        }

        axios.post('http://localhost:4000/wallet/connect',{publicKey: publicKey.toString(), signature: signature},{
            withCredentials: true
        }
        ).then(async response => {
            Router.reload(window.location.pathname)
        })
        .catch(error =>{
            unselectWallet()
            if(error.response) toast.error(`${error.response.status}: An error occured`)
        })
    }

    useEffect(async() => {
        if(wallet && adapter && (wallet.name != selectedWallet)){
            if(ready){
                try{
                    setSelectedWallet(wallet.name)
                    await connect()
                }catch(err){
                    unselectWallet()
                    toast.error(err.name)
                }
            }else{
                window.open(wallet.url, "_blank");
                unselectWallet()
            }
        }
    }, [wallet])

    useEffect(() => {
        if(publicKey && connected && (step == 1)){
            axios.post('http://localhost:4000/wallet/check_existing',{publicKey: publicKey.toString()}
            ).then(async response => {
                if(response.data.new == true){
                    setStep(2)
                }else{
                    SignIn()
                }
            })
            .catch(error =>{
                if(error.response) toast.error(error.response.status+': An error occurred')
            })
        }else if(!connected){
            unselectWallet()
        }
    }, [publicKey])

    if((step == 1) || (connected == false)){

        return(
            <div className={modalStyle.container}>
                
                {connecting?
                    <h1>Connecting Wallet...</h1>
                :
                    <h1>Connect Wallet</h1>
                    
                }
    
                <div className={styles.terms}>
                    <span>By connecting your wallet you are indicating that you have read and acknowledge the</span> 
                    <a className={styles.highlight} >Terms of Service</a> and <a className={styles.highlight} >Privacy Notice</a>
                </div>
                
                {wallets.map((wallet) => (
                    <a key={wallet.name} onClick={() => select(wallet.name)} className={`${wallet.name == selectedWallet?styles.walletSelected:null} ${styles.connectWalletButton}`}>
                        <img src={wallet.icon}/>
                        {ready && (wallet.name == selectedWallet) && !connected?
                            <div className={styles.walletSelectedChild}>
                                <Loading/>
                            </div>
                        :
                            <div>
                                {(wallet.name == selectedWallet)?
                                    <h2 style={{color: '#FAFAFA'}}>{wallet.name}</h2>
                                :
                                    <h2>{wallet.name}</h2>
                                }
                            </div>
                        }
                        
                    </a>
                ))}
                
            </div>
        )
    }else{
        return(
            <div className={modalStyle.container}>
                <div className={modalStyle.header}>
                    <h1>
                        Create User
                    </h1>
                </div>

                <div className="inputLine">
                    @<input placeholder="username" value={username} onChange={e => {setUsername(e.target.value.toLocaleLowerCase());}}/>
                </div>

                <div style={{width: '280px'}}>
                    {   
                        errorMsg?
                            <span className={styles.errorMsg}>
                                {errorMsg}
                            </span>
                        :
                            null
                    }
                </div>
                
                <a onClick={(valid && !loading)?CreateUser:null} className={`${styles.finishButton} ${(valid && !loading)?null:styles.finishButtonInvalid}`}>
                    <div>
                        {loading?<Loading/>:<h2>Finish</h2>}
                    </div>
                </a>
                {/* <a onClick={(valid && (loading == false))?CreateUser:null} className={`${styles.finishButton} ${(valid && (loading == false) && !loadingWalletConnect)?null:styles.finishButtonInvalid}`}>
                    <div>
                        {signError?<h2>Retry</h2>:((loading == true) || (loadingWalletConnect == 'phantom'))?<Loading/>:<h2>Finish</h2>}
                    </div>
                </a> */}
                
            </div>
        )
        // return(
        //     <div className={modalStyle.container}>
                
        //         <div className={modalStyle.header}>
        //             <h1>
        //                 Create User
        //             </h1>
        //         </div>

        //         <div className="inputLine">
        //             @<input placeholder="username" value={username} onChange={e => {setUsername(e.target.value.toLocaleLowerCase()); setSignError();}}/>
        //         </div>

        //         <div style={{width: '280px'}}>
        //             {   
        //                 signError?
        //                     <span className={styles.errorMsg}>
        //                         {signError}
        //                     </span>
        //                 :errorMsg?
        //                     <span className={styles.errorMsg}>
        //                         {errorMsg}
        //                     </span>
        //                 :
        //                     null
        //             }
        //         </div>

        //         <a onClick={(valid && (loading == false) && !loadingWalletConnect)?CreateUser:null} className={`${styles.finishButton} ${(valid && (loading == false) && !loadingWalletConnect)?null:styles.finishButtonInvalid}`}>
        //             <div>
        //                 {signError?<h2>Retry</h2>:((loading == true) || (loadingWalletConnect == 'phantom'))?<Loading/>:<h2>Finish</h2>}
        //             </div>
        //         </a>
                
        //     </div>
        // )
    }
}