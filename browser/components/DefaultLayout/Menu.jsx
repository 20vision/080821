import { useMenuStore } from '../../store/defaultLayout'
import { useModalStore } from '../../store/modal'

import useUserProfile from '../../hooks/User/useUserProfile'

import styles from '../../styles/defaultLayout/menu.module.css'
import { motion } from "framer-motion"
import { useRouter } from 'next/router'
import Link from 'next/link'

import Chevron from '../../assets/Chevron'
import User from '../../assets/User'
import Portfolio from '../../assets/Portfolio'
import Discover from '../../assets/Discover'
import Following from '../../assets/Following'
import Saved from '../../assets/Saved'
import Loading from '../../assets/Loading/Loading'
import { useState } from 'react'

export default function Index() {
    const opened = useMenuStore(state => state.opened)

    const variants = {
        opened: {
            height: '100%'
        },
        closed: {
            height: (typeof window !== 'undefined')?(((35 * 100) / window.screen.height)+'%'):null
        }
    }
    return (
        <div className={styles.container}>
            <motion.div 
                className={styles.dropdown}
                initial={opened ? "opened" : "closed"}
                animate={opened ? "opened" : "closed"}
                variants={variants}
                transition={{ type: "spring", bounce: opened?0.25:0.13, duration: 0.8}}
            >

                <MenuNav/>

                {
                    (opened == true)
                    ?
                        <Menu opened={opened}/>
                    : 
                        null
                }
                
            </motion.div>
        </div>
    )
}


function MenuNav() {
    const opened = useMenuStore(state => state.opened)
    const toggle = useMenuStore(state => state.toggle)
    
    return (
        <div className={styles.navContainer}>
            <a onClick={toggle}><Chevron color="#FAFAFA" direction={(opened == true)?"0":"180"}/></a>
            <div className={styles.header}>
                
                {opened == true ? <h1>Menu</h1>:<h1>Discover</h1>}

                <span className={styles.brand}>20Vision</span>
            </div>
        </div>
    )
}

function Menu({opened}) {
    const { pathname } = useRouter();
    const [profile, isLoading] = useUserProfile()
    const setModal = useModalStore(state => state.setModal)

    const variants = {
        opened: {
            opacity: 1
        },
        closed: {
            opacity: 0
        }
    }
    if(isLoading == true){
        return(
            <div className={styles.loading}>
                <Loading/>
            </div>
        )
    }else return (
        <motion.div
        initial={opened ? "opened" : "closed"}
        animate={opened ? "opened" : "closed"}
        variants={variants}
        transition={{ duration: 0.3}}
        className={styles.menu}>

            <div className={styles.user}>
                <a onClick={() => setModal(2)}>
                    {profile.profilePicture ? <img src={profile.profilePicture} className="user_icon"/> : <User />}
                </a>
                <h3>
                    {profile.username ? '@'+profile.username : 'Guest'}
                </h3>
                <span>
                    0 Tokens · $0 USD
                </span>
            </div>

            <div className={styles.selectionContainer}>
                <Link href={'/portfolio'}>
                    <a>
                        <div className={`${styles.selectionChild} ${(pathname == '/portfolio')?styles.highlight:null}`}>
                            <div className={styles.icon}>
                                <Portfolio color={(pathname == '/portfolio')?"#3a3a3a":"#FAFAFA"}/>
                            </div>
                            <h2>My Portfolio</h2>
                        </div>
                    </a>
                </Link>

                <Link href={'/'}>
                    <a>
                        <div className={`${styles.selectionChild} ${(pathname == '/')?styles.highlight:null}`}>
                            <div className={styles.icon}>
                                <Discover color={(pathname == '/')?"#3a3a3a":"#FAFAFA"}/>
                            </div>
                            <h2>Discover</h2>
                        </div>
                    </a>
                </Link>

                <Link href={'/following'}>
                    <a>
                        <div className={`${styles.selectionChild} ${(pathname == '/following')?styles.highlight:null}`}>
                            <div className={styles.icon}>
                                <Following color={(pathname == '/following')?"#3a3a3a":"#FAFAFA"}/>
                            </div>
                            <h2>Following</h2>
                        </div>
                    </a>
                </Link>

                <Link href={'/saved'}>
                    <a>
                        <div className={`${styles.selectionChild} ${(pathname == '/saved')?styles.highlight:null}`}>
                            <div className={styles.icon}>
                                <Saved color={(pathname == '/saved')?"#3a3a3a":"#FAFAFA"}/>
                            </div>
                            <h2>Saved</h2>
                        </div>
                    </a>
                </Link>
            </div>

            <UserConnection type={(useUserProfile.username == null)?1:2}/>

            <div className={styles.policy}>
                <span><a>Privacy</a></span>
                <span>·</span>
                <span><a>Terms</a></span>
                <span>·</span>
                <span><a>Cookies</a></span>
                <span>·</span>
                <span><a>About</a></span>
            </div>
        </motion.div>
    )
}



function UserConnection({ type }) {
    const setModal = useModalStore(state => state.setModal)

    /*
        type
        1 = Show "Connect wallet" as user not authenticated
        2 = Show "Create Page" or "Select Page" as user is authenticated
    */

    if(type == 1){
        return (
            <a onClick={() => setModal(1)}>
                <div className={styles.connectWallet}>
                    <h2>Connect Wallet</h2>
                </div>
            </a>
        )
    }else{
        return(
            <div>
                -Create Page-
            </div>
        )
    }
    
}


