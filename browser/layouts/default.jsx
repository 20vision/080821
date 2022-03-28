import styles from "../styles/pageLayout/index.module.css"
import { useMenuStore } from '../store/defaultLayout'
import Menu from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";
import PageIcon from '../assets/PageIcon/PageIcon'

export default function PageLayout( {children, comp, subs} ) {
    const opened = useMenuStore(state => state.opened)

    return (
        <>  
            <div className={styles.container} style={{color: 'var(--white)'}}>
                <div className={styles.child}>

                    <div className={styles.pageInfo}>
                        <div className={styles.homescreen}>
                            <div className={styles.menu}>
                                <Menu/>
                            </div>
                            <div className={styles.info} style={{zIndex: opened?0:2}}>
                                {comp?
                                    <>
                                        <a href={`/${comp.unique_pagename}/${comp.mission_title}`}>
                                            {(comp.page_icon.length > 6) ?
                                                <img src={comp.page_icon}/>
                                            :comp?
                                                <PageIcon color={'#'+comp.page_icon}/>
                                            :null
                                            }
                                        </a>
                                        <h1>{comp.pagename}</h1>
                                        <span>/{comp.unique_pagename} · {comp.mission_title.replace(/_/g, ' ')}</span>
                                        <div className={styles.vision}>{comp.vision}</div>
                                    </>
                                :
                                    null
                                }
                            </div>
                        </div>
                    </div>

                    <div className={styles.previewContainer}>
                        <div className={styles.previewChild}>
                            <main>
                                {children}
                            </main>
                        </div>
                    </div>

                    <div className={styles.overviewParent}>
                        <div className={`hideScrollBar ${styles.overviewChild}`} id='overviewId'>
                            {comp?<Overview subs={subs} comp={comp}/>:null}
                        </div>
                        <div style={{filter: `
                        drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`}}>
                            <NavPanel/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}