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

export default function PageLayout( {children, page} ) {
    return (
        <>  
            <div className={styles.container} style={{color: 'var(--lighter_black)'}}>
                <Panel children={children} page={page} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children, page}) => {
    const router = useRouter()
    const [dependents, setDependents] = useState([])
    const [dependentsCount, setDependentsCount] = useState(null)

    useEffect(async() => {
        try{
            setDependentsCount((await axios.get(`http://localhost:4000/get/component/${router.query.component}/dependents/count`)).data.count)
            setDependents([...(await axios.get(`http://localhost:4000/get/component/${router.query.component}/dependents/0`)).data.dependents])
        }catch(error){
            console.error(error)
        }
    }, [router.query.component])

    useEffect(()=>{
        console.log(dependents)
    }, [dependents])

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={styles.child} style={{backgroundColor: 'var(--white)'}}>

            <div className={styles.pageInfo} style={{backgroundColor: 'var(--white)'}}>
                {page?<PageInfo page={page} type='paper'/>:<div style={{margin: 'auto auto'}}><Loading/></div>}

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
                                                <div key={index} className={styles.dependent}>
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
                        <div><DownloadCloud/>&nbsp;&nbsp;<h3>{dependentsCount}&nbsp;Dependents</h3></div>
                    </div>
                </div>
            </div>

            <div className={`hideScrollBar ${styles.previewContainer}`} style={{overflowY: 'scroll'}}>
                <div className={styles.previewChild}>
                    <main>
                        {children}
                    </main>
                </div>
            </div>

            <div className={styles.overview}>
                <div style={{marginTop: 'auto'}}>
                    <NavPanel/>
                </div>
            </div>

        </div>
    )
}, clickOutsideConfig)