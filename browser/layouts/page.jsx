import styles from "../styles/pageLayout/index.module.css"

import PageInfo from '../components/PageLayout/PageInfo'
import Missions from '../components/PageLayout/Missions'
import onClickOutside from "react-onclickoutside";
import NavPanel from "../components/NavPanel/Index"
import { useRouter } from "next/router";
import Overview from "../components/Component/Overview";

export default function PageLayout( {children, page, comp, subs, missions} ) {
    return (
        <>  
            <div className={styles.container} style={{color: 'var(--white)'}}>
                <Panel children={children} comp={comp} subs={subs} page={page} missions={missions} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children, page, missions, comp, subs}) => {
    const router = useRouter()

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

            <div className={styles.overviewParent}>
                <div className={`hideScrollBar ${styles.overviewChild}`} id='overviewId' style={{scrollBehavior: 'inherit!important'}}>
                    {comp?<Overview subs={subs} comp={comp}/>:null}
                </div>
                <div style={{filter: `
                drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`}}>
                    <NavPanel/>
                </div>
            </div>

        </div>
    )
}, clickOutsideConfig)