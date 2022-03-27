import styles from "../styles/pageLayout/index.module.css"

import Menu from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";

export default function PageLayout( {children, comp, subs} ) {
    return (
        <>  
            <div className={styles.container} style={{color: 'var(--white)'}}>
                <div className={styles.child}>

                    <div className={styles.pageInfo}>
                        <div className={styles.menu}>
                            <Menu/>
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