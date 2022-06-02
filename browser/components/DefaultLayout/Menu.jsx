import { useMenuStore } from '../../store/defaultLayout'
import { useModalStore } from '../../store/modal'

import useUserProfile from '../../hooks/User/useUserProfile'
import ProfilePicture from '../User/ProfilePicture/ProfilePicture'

import {useInfiniteQuery} from 'react-query'
import styles from '../../styles/pageLayout/menu.module.css'
import { motion } from "framer-motion"
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

import PageIcon from '../../assets/PageIcon/PageIcon'
import Chevron from '../../assets/Chevron'
import Portfolio from '../../assets/Portfolio'
import Discover from '../../assets/Discover'
import Following from '../../assets/Following'
import Saved from '../../assets/Saved'
import Loading from '../../assets/Loading/Loading'
import Plus from '../../assets/Plus'
import { useEffect,useState } from 'react'
import config from '../../public/config.json'

export default function Index() {
    const opened = useMenuStore(state => state.opened)
    const [menu, setMenu] = useState()
    const router = useRouter()
    const { pathname } = useRouter();

    useEffect(() => {
        if(menu){
            router.push('/'+menu)
        }
    }, [menu])

    const variants = {
        opened: {
            height: 'calc(100% - 70px)' //100% - padding/radius of panel if page/comp opened
        },
        closed: {
            height: '26px'
            // height: (typeof window !== 'undefined')?(((35 * 100) / window.screen.height)+'%'):null
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
                        <Menu opened={opened} setMenu={setMenu} pathname={pathname}/>
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

export function Menu({opened, setMenu, pathname}) {
    const [profile, isLoading, setUser] = useUserProfile()
    const setModal = useModalStore(state => state.setModal)

    const myPages = useInfiniteQuery(
        'my_pages',
        async () => {
            const res = await axios.get(`${config.HTTP_SERVER_URL}/get/my_pages/0`,{withCredentials: true})
            return res.data
        },
        {
            enabled: profile.username?true:false,
            refetchOnWindowFocus: false,
            refetchOnmount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 1000 * 60 * 60 * 24,
            onError: (error) => {
                console.error(error)
            },
        }
    )

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

            <div className={`${!profile.username? 'no_click': null} ${styles.user}`}>
                <a onClick={() => setModal(2)}>
                    <ProfilePicture loading={isLoading} uri={profile.profilePicture?profile.profilePicture:null}/>
                </a>
                <h3>
                    {profile.username ? '@'+profile.username : 'Guest'}
                </h3>
            </div>

            <div className={`${styles.selectionContainer}`}>
                {/* <a onClick={() => {setMenu('/portfolio')}} className={!profile.username? 'no_click': null}>
                    <div className={`${styles.selectionChild} ${(pathname == '/portfolio')?styles.highlight:null}`}>
                        <div className={styles.icon}>
                            <Portfolio color={(pathname == '/portfolio')?"#3a3a3a":"#FAFAFA"}/>
                        </div>
                        <h2>My Portfolio</h2>
                    </div>
                </a> */}

                <a onClick={() => {setMenu('/')}}>
                    <div className={`${styles.selectionChild} ${(pathname == '/')?styles.highlight:null}`}>
                        <div className={styles.icon}>
                            <Discover color={(pathname == '/')?"#3a3a3a":"#FAFAFA"}/>
                        </div>
                        <h2>Discover</h2>
                    </div>
                </a>

                <a onClick={() => {setMenu('/following')}} className={!profile.username? 'no_click': null}>
                    <div className={`${styles.selectionChild} ${(pathname == '/following')?styles.highlight:null}`}>
                        <div className={styles.icon}>
                            <Following color={(pathname == '/following')?"#3a3a3a":"#FAFAFA"}/>
                        </div>
                        <h2>Following</h2>
                    </div>
                </a>

                <a onClick={() => {setMenu('/saved')}} className={!profile.username? 'no_click': null}>
                    <div className={`${styles.selectionChild} ${(pathname == '/saved')?styles.highlight:null}`}>
                        <div className={styles.icon}>
                            <Saved color={(pathname == '/saved')?"#3a3a3a":"#FAFAFA"}/>
                        </div>
                        <h2>Saved</h2>
                    </div>
                </a>
            </div>

            <UserConnection 
                page={
                    myPages && myPages.data && myPages.data.pages[0] && myPages.data.pages[0].my_pages[0]?
                        myPages.data.pages[0].my_pages[0]
                    :null
                } 
                type={
                    (profile.username == null)?
                        1
                    :myPages && myPages.data && myPages.data.pages[0] && myPages.data.pages[0].my_pages[0]?
                        3
                    :
                        2
                }
            />

            <div className={styles.policy}>
                <span><Link href={'/info?ab=privacy'}><a>Privacy Policy</a></Link></span>
                <span>·</span>
                <span><Link href={'/info?ab=terms'}><a>Terms of Service</a></Link></span>
                <span>·</span>
                <span><Link href={'/info?ab=about'}><a>About</a></Link></span>
            </div>
        </motion.div>
    )
}



function UserConnection({ type, page }) {
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
    }else if(type == 2){
        return(
            <a onClick={() => setModal(3)}>
                <div className={styles.createPageContainer}>
                        <Plus color="#FAFAFA"/>
                    <h2>
                        Add Page
                    </h2>
                </div>
            </a>
        )
    }else{
        return(
            <div className={styles.myPageContainer}>
                <Link href={`/${page.unique_pagename}`}><a className={styles.pageLink}>
                    <div>
                        {page && page.page_icon.length > 6 ?
                            <img src={config.FILE_SERVER_URL+page.page_icon+'48x48.webp'} style={{width: 45, height: 45, borderRadius: 10}}/>
                        :
                            <PageIcon color={'#'+page.page_icon}/>
                        }
                    </div>
                    <div className={styles.myPageChild}>
                        <h3>
                            {page.pagename}
                        </h3>
                        <span>
                            /{page.unique_pagename}
                        </span>
                    </div>
                </a></Link>
                <a onClick={(e) => {e.preventDefault; setModal(3);}}><Chevron color="#FAFAFA" direction="180"/></a>
            </div>
        )
    }
    
}


