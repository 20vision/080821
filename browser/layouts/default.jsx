import styles from "../styles/pageLayout/index.module.css"
import { useMenuStore } from '../store/defaultLayout'
import Menu from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";
import PageIcon from '../assets/PageIcon/PageIcon'
import { useRouter } from "next/router";
import useWindowSize from "../hooks/Page/useWindowsSize";
import config from '../public/config.json'
import { useEffect } from "react";
import { motion, useAnimation } from 'framer-motion';

export default function PageLayout( {children, comp, subs} ) {
    const opened = useMenuStore(state => state.opened)
    const router = useRouter()
    const controls = useAnimation()
    const size = useWindowSize()

    useEffect(() => {
        controls.start(() => {
            return({
                opacity: 0,
                transition: { duration: 0.05}
            })
        }).then(() => {
            controls.start(() => {
                return({
                    opacity: 1,
                    transition: { duration: 0.45}
                })
            })
        })
    }, [comp])

    return (
        <div className={styles.container} style={{color: 'var(--white)'}}>
            <div className={styles.child}>

                <div className={styles.pageInfo}>
                    <div className={styles.homescreen}>
                        <div className={styles.menu}>
                            <Menu/>
                        </div>
                        <motion.div animate={controls} initial={{opacity: 0}} className={styles.info} style={{zIndex: opened?0:2}}>
                            {comp?
                                <>
                                    <a style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onClick={() => router.push(`/${comp.unique_pagename}/${comp.mission_title}`)}>
                                        {comp.page_icon.length > 6 ?
                                            <img src={config.FILE_SERVER_URL+comp.page_icon+'48x48.webp'} style={{width: 45, height: 45, borderRadius: 10}}/>
                                        :
                                            <PageIcon color={'#'+comp.page_icon}/>
                                        }
                                    
                                    <h1>{comp.pagename}</h1>
                                    <span>/{comp.unique_pagename} · {comp.mission_title.replace(/_/g, ' ')}</span>
                                    <div className={styles.vision}>{comp.vision}</div>
                                    </a>
                                </>
                            :
                                null
                            }
                        </motion.div>
                    </div>
                </div>

                <div className={styles.previewContainer}>
                    <div className={styles.previewChild}>
                        <main>
                            {children}
                        </main>
                    </div>
                    {((size !== 'undefined') && (size.width >= 1501))?
                        null
                    :
                        <div className={styles.overviewParent} style={{top: 'auto', zIndex: 2}}>
                            <div style={{filter: `
                            drop-shadow( 0px -20px 5px rgb(46, 46, 46, 0.05))`}}>
                                <NavPanel comp={comp}/>
                            </div>
                        </div>
                    }
                </div>

                {((size !== 'undefined') && (size.width >= 1501))?
                    <div className={styles.overviewParent}>
                        <div className={`hideScrollBar ${styles.overviewChild}`} id='overviewId'>
                            {comp?<Overview subs={subs} comp={comp}/>:null}
                        </div>
                        <div style={{filter: `
                        drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`}}>
                            <NavPanel comp={comp}/>
                        </div>
                    </div>
                :null}

            </div>
        </div>
    )
}