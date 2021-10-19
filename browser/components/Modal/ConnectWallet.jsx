import styles from "../../styles/modal/connectWallet.module.css"
import modalStyle from '../../styles/modal/index.module.css'
import axios from 'axios'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../../assets/Loading/Loading'
import useUsernameValidation from "../../hooks/User/useUsernameValidation"
export default function ConnectWallet() {
    const [step, setStep] = useState(1)
    const [signError, setSignError] = useState()
    const [username, setUsername, valid, errorMsg, loading, publishNewUsername] = useUsernameValidation()
    const [publicAddress, setPublicAddress] = useState()
    const [loadingWalletConnect, setLoadingWalletConnect] = useState()

    const Sign = async() => {
        setSignError()
        setLoadingWalletConnect('phantom')
        const message = new TextEncoder().encode(`Sign this Message to verify Wallet Ownership and Log Into 20.Vision.`);
        try{
            const signedMessage = await window.solana.signMessage(message, "utf8");

            axios.post('http://localhost:4000/wallet/connect',{publicKey: window.solana.publicKey.toString(), signature: signedMessage.signature},{
                withCredentials: true
            }
            ).then(async response => {
                Router.reload(window.location.pathname)
            })
            .catch(error =>{
                if(error.response) console.error(error.response.data)
            })
        }catch(e){
            setLoadingWalletConnect()
            setSignError('Error Connecting')
        }
    }

    {window.solana && window.solana.isPhantom ?
        window.solana.on("connect", async () => {
            setPublicAddress(window.solana.publicKey.toString())
            axios.post('http://localhost:4000/wallet/check_existing',{publicKey: window.solana.publicKey.toString()}
            ).then(async response => {
                if(response.data.new == true){
                    setStep(2)
                }else{
                    Sign()
                }
            })
            .catch(error =>{
                if(error.response) console.error(error.response.data)
            })

        })
    :
        null
    }

    function Connect(type){
        if(type == 'phantom'){
            if ("solana" in window) {
                const provider = window.solana;
                if (provider.isPhantom) {
                    provider.connect();
                }
            }else{
                window.open("https://phantom.app/", "_blank");
            }
        }/*else if(type == 'sollet'){

        }*/
    }

    async function CreateUser(){
        setLoadingWalletConnect('phantom')
        setSignError()
        const message = new TextEncoder().encode(`Sign this Message to verify Wallet Ownership and Log Into 20.Vision.`);
        try{
            const signedMessage = await window.solana.signMessage(message, "utf8");
            axios.post('http://localhost:4000/wallet/connect',{username: username, publicKey: publicAddress, signature: signedMessage.signature},{
                withCredentials: true
            }
            ).then(async response => {
                Router.reload(window.location.pathname)
            })
            .catch(error =>{
                if(error.response) console.error(error.response.data)
            })
        }catch(e){
            setLoadingWalletConnect()
            setSignError('Error Connecting')
        }
    }

    if(step == 1){
        return(
            <>
            {!loadingWalletConnect?
                <div className={modalStyle.container}>
                    
                    <h1>Connect Wallet</h1>
        
                    <div className={styles.terms}>
                        <span>By connecting your wallet you are indicating that you have read and acknowledge the</span> 
                        <a className={styles.highlight} >Terms of Service</a> and <a className={styles.highlight} >Privacy Notice</a>
                    </div>
                    
                    <a onClick={() => (window.solana.isConnected?Sign():Connect('phantom'))} className={styles.connectWalletButton}>
                        <img src="./phantom-icon-purple.svg"/>
                        <div>
                            <h2>Phantom</h2>
                        </div>
                    </a>

                    <a onClick={() => Connect('sollet')} className={styles.connectWalletButton}>
                        <img src="./sollet128.png"/>
                        <div>
                            <h2>Sollet</h2>
                        </div>
                    </a>
                    
                </div>
            :loadingWalletConnect == 'phantom'?
                <div className={modalStyle.container}>
                    
                    <h1>Connecting Wallet...</h1>

                    <div className={`${styles.connectWalletButton} ${styles.walletSelected}`}>
                        <img src="./phantom-icon-purple.svg"/>
                        <div className={styles.walletSelectedChild}>
                            {signError?
                                <span className={styles.errorMsg}>
                                    {signError}
                                </span>
                            :
                                <Loading/>
                            }
                        </div>
                    </div>
                    
                    
                </div>
            :
                null
            }
            </>
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
                    @<input placeholder="username" value={username} onChange={e => {setUsername(e.target.value.toLocaleLowerCase()); setSignError();}}/>
                </div>

                <div style={{width: '280px'}}>
                    {   
                        signError?
                            <span className={styles.errorMsg}>
                                {signError}
                            </span>
                        :errorMsg?
                            <span className={styles.errorMsg}>
                                {errorMsg}
                            </span>
                        :
                            null
                    }
                </div>

                <a onClick={(valid && (loading == false) && !loadingWalletConnect)?CreateUser:null} className={`${styles.finishButton} ${(valid && (loading == false) && !loadingWalletConnect)?null:styles.finishButtonInvalid}`}>
                    <div>
                        {signError?<h2>Retry</h2>:((loading == true) || (loadingWalletConnect == 'phantom'))?<Loading/>:<h2>Finish</h2>}
                    </div>
                </a>
                
            </div>
        )
    }
}