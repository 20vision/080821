import styles from "../../styles/modal/connectWallet.module.css"
import modalStyle from '../../styles/modal/index.module.css'
import axios from 'axios'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../../assets/Loading/Loading'
import useUsernameValidation from "../../hooks/User/useUsernameValidation"
export default function ConnectWallet() {
    const [step, setStep] = useState(1)
    const [username, setUsername, valid, errorMsg, loading, publishNewUsername] = useUsernameValidation()
    const [publicAddress, setPublicAddress] = useState()

    const ConnectWallet = (signature, publicKey) => {
        setPublicAddress(publicKey)
        axios.post(`http://localhost:4000/wallet/connect`,{publicKey: publicKey, signature: signature})
        .then(response => {
             
            if(response.data.new == false){
                Router.reload(window.location.pathname)
            }else{
                setStep(2)
            }

        })
        .catch(error =>{
            if(error.response) console.error(error.response.data)
        })
    }

    window.solana.on("connect", async () => {

        axios.post('http://localhost:4000/wallet/verification',{publicKey: window.solana.publicKey.toString()}
        ).then(async response => {
            const message = `Sign this Message to Confirm Ownership and Log Into 20.Vision. session id: ${response.data.key}`;
            const unit8Message = new TextEncoder().encode(message);
            const signedMessage = await window.solana.signMessage(unit8Message, "utf8");
            ConnectWallet(signedMessage.signature, window.solana.publicKey.toString())
        })
        .catch(error =>{
            if(error.response) console.error(error.response.data)
        })

    })

    async function Connect(type){
        if(type == 'phantom'){
            if(window.solana && window.solana.isPhantom){
                window.solana.connect();
            }else{
                window.open("https://phantom.app/", "_blank");
            }
        }else if(type == 'sollet'){

        }
    }

    function CreateUser(){
        // Random function
        axios.post('http://localhost:4000/wallet/create',{username: username, publicKey: publicAddress},{
        withCredentials: true
        }).then(response => {
            Router.reload(window.location.pathname)
        })
        .catch(error =>{
            //Handle errors
        })
    }

    if(step == 1){
        return(
            <div className={modalStyle.container}>
                
                <h1>Connect Wallet</h1>
                {/* <div className={styles.yoroi}>
                    <a href="https://yoroi-wallet.com/#/" target="_blank"><img src="./yoroi-logo-blue.inline.svg"/></a>
                </div> */}
    
                <div className={styles.terms}>
                    <span>By connecting your wallet you are indicating that you have read and acknowledge the</span> 
                    <a className={styles.highlight} >Terms of Service</a> and <a className={styles.highlight} >Privacy Notice</a>
                </div>
                
                <a onClick={() => Connect('phantom')} className={styles.connectWalletButton}>
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
                    @<input placeholder="username" value={username} onChange={e => setUsername(e.target.value.toLocaleLowerCase())}/>
                </div>

                <div style={{width: '280px'}}>
                    {errorMsg?<span className={styles.errorMsg}>{errorMsg}</span>:null}
                </div>

                <a onClick={valid?CreateUser:null} className={`${styles.finishButton} ${valid?null:styles.finishButtonInvalid}`}>
                    <div>
                        {(loading == true)?<Loading/>:<h2>Finish</h2>}
                    </div>
                </a>
                
            </div>
        )
    }
}