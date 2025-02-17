import styles from "../../styles/modal/connectWallet.module.css"
import modalStyle from '../../styles/modal/index.module.css'
import axios from 'axios'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../../assets/Loading/Loading'
import useUserProfile from '../../hooks/User/useUserProfile'
import useUsernameValidation from "../../hooks/User/useUsernameValidation"
import { useModalStore } from '../../store/modal'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "react-toastify"
import bs58 from 'bs58';
import config from '../../public/config.json'
import { useRouter } from 'next/router'

export default function ConnectWallet() {
    
    const [step, setStep] = useState(1)
    const [selectedWallet, setSelectedWallet] = useState()
    const message = new TextEncoder().encode(`Sign this Message to verify Wallet Ownership and Log Into 20.Vision.`);
    const [username, setUsername, valid, errorMsg, loading, publishNewUsername] = useUsernameValidation()
    const [profile, isLoading, setUser] = useUserProfile()
    const setModal = useModalStore(state => state.setModal)
    const router = useRouter()
    const {
        autoConnect = false,
        wallets,
        connecting,
        connected,
        select,
        connect,
        ready,
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

        axios.post(`${config.HTTP_SERVER_URL}/wallet/connect`,{username: username, publicKey: publicKey.toString(), signature: signature},{
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
        let signature = null
        try{
            signature = await SignMsg()
        }catch(e){
            return
        }

        axios.post(`${config.HTTP_SERVER_URL}/wallet/connect`,{publicKey: publicKey.toString(), signature: signature},{
            withCredentials: true
        }
        ).then(async response => {
            if((profile.username != null) && (router.query.page)){
                setModal(5)
            }else{
                Router.reload(window.location.pathname)
            }
        })
        .catch(error =>{
            unselectWallet()
            if(error.response) toast.error(`${error.response.status}: An error occured`)
        })
    }

    useEffect(async() => {
        if(wallet && wallet.adapter){
            if(wallet.readyState != 'Unsupported' && 
                wallet.readyState != 'NotDetected'
            ){
                try{
                    setSelectedWallet(wallet.adapter.name)
                    await connect()
                }catch(err){
                    unselectWallet()
                    toast.error(err.name)
                }
            }else{
                window.open(wallet.adapter.url, "_blank");
                unselectWallet()
            }
        }
    }, [wallet])

    useEffect(() => {
        if(publicKey && connected && (step == 1)){
            axios.post(`${config.HTTP_SERVER_URL}/wallet/check_existing`,{publicKey: publicKey.toString()}
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
            <div className={modalStyle.container} style={{maxWidth: 350, maxHeight: 480}}>
                
                {connecting?
                    <h1>Connecting Wallet...</h1>
                :
                    <h1>Connect Wallet</h1>
                    
                }
    
                <div className={styles.terms}>
                    <span>By connecting your wallet you are indicating that you have read and acknowledge the</span> 
                    <a className={styles.highlight} >Terms of Service</a> and <a className={styles.highlight} >Privacy Notice</a>
                </div>
                
                <div style={{overflowY: 'scroll', width: '100%'}}>
                    {wallets.map((wallet) => (
                        <a style={{position: 'relative'}} key={wallet.adapter.name} onClick={() => select(wallet.adapter.name)} className={`${wallet.adapter.name == selectedWallet?styles.walletSelected:null} ${styles.connectWalletButton}`}>
                            <img style={wallet.adapter.name == 'Ledger'?{filter:'invert(1)'}:null} src={wallet.adapter.icon}/>
                            {ready && (wallet.adapter.name == selectedWallet) && !connected?
                                <div className={styles.walletSelectedChild}>
                                    <Loading/>
                                </div>
                            :
                                <div>
                                    <div>
                                        {(wallet.adapter.name == selectedWallet)?
                                            <h2 style={{color: '#FAFAFA'}}>{wallet.adapter.name}</h2>
                                        :
                                            <h2>{wallet.adapter.name}</h2>
                                        }
                                    </div>
                                    <div style={{position: 'absolute', fontSize: '12px', color: '#FF5B77', right: 20}}>
                                        {wallet.readyState}
                                    </div>
                                </div>
                            }
                            
                        </a>
                    ))}
                </div>
                
                
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