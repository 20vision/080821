import styles from "../styles/pageLayout/index.module.css"

import PageInfo from '../components/PageLayout/PageInfo'
import onClickOutside from "react-onclickoutside";
import NavPanel from "../components/NavPanel/Index"
import { useRouter } from "next/router";
import Loading from "../assets/Loading/Loading";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component'
import PacmanLoader from 'react-spinners/PacmanLoader'
import axios from "axios";
import DownloadCloud from '../assets/DownloadCloud'
import config from '../public/config.json';
import Link from 'next/link'
import PageIcon from '../assets/PageIcon/PageIcon'
import Overview from "../components/Component/Overview";
import {animateScroll} from 'react-scroll';
import { useRef } from "react";
import { motion } from 'framer-motion';

export default function PageLayout( {children, page, comp, subs} ) {
    return (
        <>  
            <div className={styles.container} style={{color: 'var(--lighter_black)'}}>
                <Panel children={children} page={page} subs={subs} comp={comp} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children, page, subs, comp}) => {
    const router = useRouter()
    const [dependents, setDependents] = useState([])
    const [dependentsCount, setDependentsCount] = useState(null)
    const [scrollPercentage, setScrollPercentage] = useState(0)

    useEffect(async() => {
        try{
            setDependentsCount((await axios.get(`http://localhost:4000/get/component/${router.query.component}/dependents/count`)).data.count)
            setDependents([...(await axios.get(`http://localhost:4000/get/component/${router.query.component}/dependents/0`)).data.dependents])
        }catch(error){
            console.error(error)
        }
    }, [router.query.component])

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    const overviewRef = useRef()

    return(
        <motion.div 
        initial={{
            scale: 0.5
        }}
        animate={{scale: 1}}
        exit={{scale: 0.5}}
        className={styles.child} style={{backgroundColor: 'var(--white)'}}>

            <div className={styles.pageInfo} style={{backgroundColor: 'var(--white)'}}>
                {page?
                <Link href={`/${page.unique_pagename}`}>
                    <a>
                        <PageInfo page={page} type='paper'/>
                    </a>
                </Link>
                :<div style={{margin: 'auto auto'}}><Loading/></div>}

                <div style={{margin: '35px', flexGrow: '1', display: 'flex', flexDirection: 'column'}}>
                    <div style={{flexGrow: '1'}}>
                        {dependentsCount && (dependents.length>0)?
                            <InfiniteScroll 
                                dataLength={dependents.length}
                                hasMore={dependents.length == dependentsCount?false:true}
                                next={
                                    async() => {
                                        try{
                                            const data = (await axios.get(`http://localhost:4000/get/component/${router.query.component}/dependents/${dependents?(dependents.length-1):0}`)).data
                                            setDependents([...dependents,...data])
                                        }catch(err){
                                            console.log(err)
                                        }
                                    }
                                }
                                loader={<PacmanLoader css="display:block;" color="#8A8A8A" size={12}/>}
                            >
                                {dependents.map((dependent, index) => {
                                    return(
                                        <Link href={`/${dependent.unique_pagename}/${dependent.mission_title}/${dependent.uid}`}>
                                            <a>
                                                <div className={styles.dependent}>
                                                    <div className={styles.info}>
                                                        <div className={styles.header}>
                                                            <h3>{dependent.header}</h3>
                                                        </div>
                                                        <div className={styles.footer}>
                                                            <span style={{fontSize: 12,color: dependent.type == 'p'?'var(--blue)':dependent.type == 's'?'var(--yellow)':'var(--green)'}}>{dependent.type == 'p'?'Product':dependent.type == 's'?'Service':'Result'}</span>&nbsp;
                                                            <span style={{fontSize: 12}}>· /{dependent.unique_pagename}</span>
                                                        </div>
                                                    </div>
                                                    <img  src={config.FILE_SERVER_URL+'comp_images/'+dependent.uid.substring(0,dependent.uid.length-8)+'/'+dependent.uid.substring(dependent.uid.length-8)+'/512x512'+'.webp'}/>
                                                    <div className={styles.page_icon}>
                                                        {(dependent.page_icon.length < 7) ?
                                                            <PageIcon color={'#'+dependent.page_icon}/>
                                                        :
                                                            <img src={dependent.page_icon}/>
                                                        }
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    )
                                })}
                            </InfiniteScroll>
                        :
                            null}
                    </div>
                    <div className={styles.dependentsList}>
                        <div><DownloadCloud/>&nbsp;&nbsp;<h3>{dependentsCount}&nbsp;{(dependentsCount>1)?'Dependents':'Dependent'}</h3></div>
                    </div>
                </div>
            </div>

            <div onScroll={arg => setScrollPercentage((arg.target.scrollTop/arg.target.scrollTopMax)*100)} className={`hideScrollBar ${styles.previewContainer}`} style={{scrollBehavior: 'smooth',overflowY: 'scroll'}}>
                <div className={styles.previewChild}>
                    <main>
                        {children}
                    </main>
                </div>
            </div>

            <div className={styles.overviewParent}>
                <div onMouseEnter={() => animateScroll.scrollTo(overviewRef.current.scrollTopMax*scrollPercentage/100, {
                        smooth: true,
                        duration: 400,
                        ignoreCancelEvents: false,
                        containerId: 'overviewId'
                    })} className={`hideScrollBar ${styles.overviewChild}`} id='overviewId' ref={overviewRef} style={{scrollBehavior: 'inherit!important'}}>
                    <Overview subs={subs} comp={comp}/>
                </div>
                <div style={{filter: `
                drop-shadow( 0px -20px 5px rgb(250, 250, 250, 1))`}}>
                    <NavPanel/>
                </div>
            </div>

        </motion.div>
    )
}, clickOutsideConfig)