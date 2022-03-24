import styles from "../styles/pageLayout/index.module.css"

import PageInfo from '../components/PageLayout/PageInfo'
import onClickOutside from "react-onclickoutside";
import NavPanel from "../components/NavPanel/Index"
import { useRouter } from "next/router";
import Loading from "../assets/Loading/Loading";

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

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={styles.child} style={{backgroundColor: 'var(--white)'}}>

            <div className={styles.pageInfo} style={{backgroundColor: 'var(--white)'}}>
                {page?<PageInfo page={page} type='paper'/>:<div style={{margin: 'auto auto'}}><Loading/></div>}
            </div>

            <div className={styles.previewContainer}>
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