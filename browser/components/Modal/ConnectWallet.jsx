import styles from "../../styles/modal/connectWallet.module.css"
import axios from 'axios'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../../assets/Loading/Loading'


export default function ConnectWallet() {
    const [step, setStep] = useState(1)
    const [username, setUsername] = useState('')
    const [valid, setValid] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(null)
    const regex = /^[a-z0-9_.]*$/


    useEffect(() => {
        setErrorMsg('')
        clearTimeout(timer)
        setTimer(null)
        setValid(false)
        if(username.length < 1){
            setLoading(false)
        }else if(!regex.test(username)){
            setLoading(false)
            setErrorMsg('Usernames can only contain letters, numbers, dots and underscores')
        }else{
            setLoading(true)
            setTimer(setTimeout(() => {
                if(username.length < 4){
                    setErrorMsg('@'+username+' is not a valid username')
                    setLoading(false)
                }else{
                    axios.post('http://localhost:4000/get/username_unique',{username: username}
                    ).then(response => {
                        setValid(true)
                    })
                    .catch(error =>{
                        if(error.response.status == 422){
                            setErrorMsg('@'+username+' is already taken')
                        }else{
                            setErrorMsg('Error: ' + error.response.status+'\n'+error.response.data)
                        }
                    })
                    .then(() =>{
                        setLoading(false)
                    })
                }
            }, 1000))
        }
    }, [username])
    

    function Connect(){
        // Random function
        var public_address = Math.floor(Math.random() * 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999).toString()
        axios.post('http://localhost:4000/wallet/connect',{public_address: public_address},{
        withCredentials: true
        }).then(response => {
            if(response.data.new == false){
                Router.reload(window.location.pathname)
            }else{
                setStep(2)
            }
        })
        .catch(error =>{
            //Handle errors
        })
    }

    function CreateUser(){
        // Random function
        var public_address = Math.floor(Math.random() * 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999).toString()
        axios.post('http://localhost:4000/wallet/create',{username: username, public_address: public_address},{
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
            <div className={styles.container}>
    
                <div className={styles.yoroi}>
                    <a href="https://yoroi-wallet.com/#/" target="_blank"><img src="./yoroi-logo-blue.inline.svg"/></a>
                </div>
    
                <div className={styles.terms}>
                    <span>By connecting your wallet you are indicating that you have read and acknowledge the</span> 
                    <a className={styles.highlight} >Terms of Service</a> and <a className={styles.highlight} >Privacy Notice</a>
                </div>
                
                <a onClick={Connect} className={styles.connectWalletButton}>
                    <div>
                        <h2>Connect Yoroi</h2>
                    </div>
                </a>
                
            </div>
        )
    }else{
        return(
            <div className={styles.container}>
                
                <div className={styles.header}>
                    <h1>
                        Create User
                    </h1>
                </div>

                <div className="inputLine">
                    @<input placeholder="username" value={username} onChange={e => setUsername(e.target.value.toLocaleLowerCase())}/>
                </div>

                {errorMsg?<span className={styles.errorMsg}>{errorMsg}</span>:null}

                <a onClick={valid?CreateUser:null} className={`${styles.connectWalletButton} ${valid?null:styles.connectWalletButtonInvalid}`}>
                    <div>
                        {(loading == true)?<Loading/>:<h2>Finish</h2>}
                    </div>
                </a>
                
            </div>
        )
    }
}