import styles from "../styles/pageLayout/index.module.css"

import PageInfo from '../components/PageLayout/PageInfo'
import Missions from '../components/PageLayout/Missions'
import onClickOutside from "react-onclickoutside";
import NavPanel from "../components/NavPanel/Index"
import { useRouter } from "next/router";
import Overview from "../components/Component/Overview";
import { motion } from 'framer-motion';
import useWindowSize from "../hooks/Page/useWindowsSize";

export default function PageLayout( {children, page, comp, subs, missions} ) {
    return (
        <motion.div 
        initial={{scale: 2}}
        animate={{scale: 1}}
        className={styles.container} style={{color: 'var(--white)', overflow: 'hidden'}}>
            <Panel children={children} comp={comp} subs={subs} page={page} missions={missions} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
        </motion.div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children, page, missions, comp, subs}) => {
    const router = useRouter()
    const size = useWindowSize()

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={styles.child}  style={{backgroundColor: 'var(--black)'}}>

            <div className={styles.pageInfo} style={{backgroundColor: 'var(--black)'}}>
                <PageInfo page={page}/>
                <Missions missions={missions}/>
            </div>

            <div className={styles.previewContainer}>
                <div className={styles.previewChild}>
                    <main>
                        {children}
                    </main>
                </div>
            </div>

            {((size !== 'undefined') && (size.width >= 1501))?
                <div className={styles.overviewParent}>
                    <div className={`hideScrollBar ${styles.overviewChild}`} id='overviewId'>
                        {comp?<Overview subs={subs} comp={comp}/>:null}
                    </div>
                    <div style={{filter: `
                    drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`}}>
                        <NavPanel/>
                    </div>
                </div>
            :null}

        </div>
    )
}, clickOutsideConfig)