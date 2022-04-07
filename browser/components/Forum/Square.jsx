import styles from '../../styles/forumLayout/square.module.css'
import PageIcon from '../../assets/PageIcon/PageIcon'
import Lock from '../../assets/Lock'
import { useEffect, useState } from 'react'
import useUserProfile from '../../hooks/User/useUserProfile'
import { SYSVAR_RENT_PUBKEY, SystemProgram, PublicKey, Keypair, Transaction,TransactionInstruction,FeeCalculator, sendAndConfirmTransaction, sendAndConfirmRawTransaction, SendTransactionError } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { getBigNumber, connection, MINT_LAYOUT, ACCOUNT_LAYOUT, VISION_PROGRAM_ID } from '../../hooks/web3/useContract';
import millify from "millify";
import disableScroll from 'disable-scroll';
import config from '../../public/config.json';

export default function Square({content, makeScroll, isInTheBackground}){
    const [mint, setMint] = useState(content.page?content.page.token_mint_address:null)
    const [tokenBalance, setTokenBalance] = useState(null)
    const [tokenBalanceSocketId, setTokenBalanceSocketId] = useState()
    const [profile, isLoading, setUser] = useUserProfile()

    useEffect(async() => {
        if(mint && profile.public_key){
            try{
                const associatedUserPubKey = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,new PublicKey(mint),new PublicKey(profile.public_key))
                const associatedUserAccoutInfo = await connection.getAccountInfo(associatedUserPubKey)
                infoToTokenBalance(associatedUserAccoutInfo)
                setTokenBalanceSocketId(connection.onAccountChange(
                    associatedUserPubKey,
                    async info => {
                        infoToTokenBalance(info)
                    },
                ))
            }catch(err){
                console.error(err)
            }
          
        }
        return () => {
          if(tokenBalanceSocketId){
            connection.removeAccountChangeListener(tokenBalanceSocketId)
          }
        }
    }, [mint,profile.public_key])


    const infoToTokenBalance = (info) =>{
        if ((info === null) || (info.lamports == 0) || (!info.owner.equals(TOKEN_PROGRAM_ID)) || (info.data.length != ACCOUNT_LAYOUT.span)) {
          if(tokenBalance){
            setTokenBalance(null)
          }
        }else{
          setTokenBalance(millify(getBigNumber(ACCOUNT_LAYOUT.decode(Buffer.from(info.data)).amount) / 1000000000))
        }
    }


    return(
        <div onMouseEnter={e => disableScroll.on()} onMouseLeave={() => disableScroll.off()} onWheel={info => makeScroll(info)} className={styles.container} id='bubble' style={{backgroundColor: `${content.page?'var(--light_grey)':content.mission?'var(--lighter_grey)':content.component?'var(--white)':null}`}}>
            {content.page?
                <div className={styles.header} style={{display: 'flex'}}>
                    {(content.page.page_icon.length < 7) ?
                        <PageIcon color={'#'+content.page.page_icon}/>
                    :
                        <img src={content.page.page_icon}/>
                    }
                    <div className={styles.pageNameDiv} style={{fontWeight: 'bold', fontSize: 12}}>
                        <h3 style={{color: '#444', marginTop: 4, marginBottom: 4}}>
                            /{content.page.unique_pagename}
                        </h3>
                        <span style={{color: '#444', opacity: 0.6}}>
                            Balance: &nbsp;
                        </span>
                        <span style={{color: '#444', opacity: 0.6}}>
                            {tokenBalance?tokenBalance:'?'}
                        </span>
                    </div>
                </div>
            :content.mission?
                <div style={{display: 'flex'}} className={`${styles.header}`}>
                    <h2 style={{color: '#444'}}>Mission · {content.mission.title.replace(/_/g, ' ')}</h2>
                </div>
            :
                null
            }
            <div style={{color: '#444', wordWrap: 'break-word'}}>
                {isInTheBackground?
                    null
                :content.page?
                    content.page.vision
                :content.mission?
                    content.mission.description
                :content.component?
                    <div className={styles.component}>
                        <div>
                            <div className={`${styles.header}`}>
                                <h2 style={{color: '#444'}}>{content.component.header}</h2>
                            </div>
                            {content.component.body}
                        </div>
                        <img src={config.FILE_SERVER_URL+'comp_images/'+content.component.uid.substring(0,content.component.uid.length-8)+'/'+content.component.uid.substring(content.component.uid.length-8)+'/512x512'+'.webp'}/>
                    </div>
                :
                    null
                }
            </div>
        </div>
    )
}