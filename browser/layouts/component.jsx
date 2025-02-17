import styles from "../styles/pageLayout/index.module.css"
import indexStyles from '../styles/modal/index.module.css'
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
import useWindowSize from "../hooks/Page/useWindowsSize";
import ComponentsHorizonta from "../components/Component/ComponentsHorizontal";
import { motion, useAnimation } from 'framer-motion';

export default function PageLayout( {children, page, comp, subs} ) {
    return (
        <>  
            <div className={styles.container} style={{color: 'var(--lighter_black)',backgroundColor: 'var(--light_black)'}}>
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
    const [selectedRoute, setSelectedRoute] = useState(0)
    const size = useWindowSize()
    const controls = useAnimation()

    useEffect(async()=>{
        await controls.start(() => {
          return({
              x: '-40vw',
              opacity: 0,
              transition: { duration: 0}
          })
        })
        await controls.start(() => {
          return({
              x: 0,
              opacity: 1,
              transition: { duration: 0.35}
          })
        })
    }, [comp])

    useEffect(async() => {
        try{
            setDependentsCount((await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/dependents/count`)).data.count)
            setDependents([...(await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/dependents/0`)).data.dependents])
        }catch(error){
            console.error(error)
        }
    }, [router.query.component])

    Panel.handleClickOutside = () => {
        router.push(`/${router.query.page}/${router.query.mission}/`)
    };

    const overviewRef = useRef()

    return(
        <motion.div 
        initial={{
            scale: 0.5
        }}
        animate={{scale: 1}}
        exit={{scale: 0.5}}
        className={styles.child} style={{backgroundColor: 'var(--white)', overflow: 'hidden'}}>

            <div className={styles.pageInfo} style={{backgroundColor: 'var(--white)', zIndex: 100}}>
                {page?
                <Link href={`/${page.unique_pagename}`}>
                    <a>
                        <PageInfo page={page} type='paper'/>
                    </a>
                </Link>
                :<div style={{margin: 'auto auto'}}><Loading/></div>}

                {((size !== 'undefined') && (size.width < 1500))?<div className={indexStyles.header} style={{margin: '25px 5px', marginTop: 0}}>
                    <h2 style={{margin: 'auto', padding: '2px 30px', cursor: 'pointer'}} onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?indexStyles.highlight:null}>Overview</h2>
                    <h2 style={{margin: 'auto', padding: '2px 30px', cursor: 'pointer'}} onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?indexStyles.highlight:null}>Dependent</h2>
                </div>:null}

                {(selectedRoute == 1) || ((size !== 'undefined') && (size.width >= 1500))?
                    <div style={{margin: '35px', flexGrow: '1', display: 'flex', flexDirection: 'column'}}>
                        <div style={{flexGrow: '1'}}>
                            {dependentsCount && (dependents.length>0)?
                                <InfiniteScroll 
                                    dataLength={dependents.length}
                                    hasMore={dependents.length == dependentsCount?false:true}
                                    next={
                                        async() => {
                                            try{
                                                const data = (await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/dependents/${dependents?(dependents.length-1):0}`)).data
                                                setDependents([...dependents,...data])
                                            }catch(err){
                                                console.log((err && err.response)?err.response:err)
                                            }
                                        }
                                    }
                                    loader={<PacmanLoader css="display:block;" color="#8A8A8A" size={12}/>}
                                >
                                    {dependents.map((dependent, index) => {
                                        return (
                                            <Link key={index} href={`/${dependent.unique_pagename}/${dependent.mission_title}/${dependent.uid}`}>
                                                <a>
                                                    <ComponentsHorizonta data={dependent} key={index}/>
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
                :
                    <div style={{width: 350, margin:'0px auto auto auto', marginBottom: 25, overflowY: 'scroll'}}>
                        <Overview subs={subs} comp={comp}/>
                    </div>
                }
            </div>

            <motion.div animate={controls} onScroll={arg => setScrollPercentage((arg.target.scrollTop/arg.target.scrollTopMax)*100)} className={`hideScrollBar ${styles.previewContainer}`} style={{scrollBehavior: 'smooth',overflowY: 'scroll'}}>
                <div className={styles.previewChild}>
                    <main>
                        {children}
                    </main>
                </div>
            </motion.div>
            {((size !== 'undefined') && (size.width >= 1501))?
                        null
                    :
                        <div className={styles.overviewParent} style={{top: 'auto', zIndex: 2}}>
                            <div style={{filter: `
                            drop-shadow( 0px -20px 5px rgb(46, 46, 46, 0.05))`}}>
                                <NavPanel/>
                            </div>
                        </div>
                    }

            {((size !== 'undefined') && (size.width >= 1500))?
                <div className={styles.overviewParent} style={{width: 350}}>
                    <motion.div animate={controls} onMouseEnter={() => animateScroll.scrollTo(overviewRef.current.scrollTopMax*scrollPercentage/100, {
                            smooth: true,
                            duration: 400,
                            ignoreCancelEvents: false,
                            containerId: 'overviewId'
                        })} className={`hideScrollBar ${styles.overviewChild}`} id='overviewId' ref={overviewRef} style={{scrollBehavior: 'inherit!important'}}>
                        <Overview subs={subs} comp={comp}/>
                    </motion.div>
                    <div style={{filter: `
                    drop-shadow( 0px -20px 5px rgb(250, 250, 250, 1))`}}>
                        <NavPanel/>
                    </div>
                </div>
            :null}

        </motion.div>
    )
}, clickOutsideConfig)