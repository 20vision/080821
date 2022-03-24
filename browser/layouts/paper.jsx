import styles from "../styles/pageLayout/index.module.css"

import PageInfo from '../components/PageLayout/PageInfo'
import onClickOutside from "react-onclickoutside";
import NavPanel from "../components/NavPanel/Index"
import { useRouter } from "next/router";

export default function PageLayout( {children} ) {
    return (
        <>  
            <div className={styles.container}>
                <Panel children={children} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children}) => {
    const router = useRouter()

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={styles.child}>

            <div className={styles.pageInfo}>
                {/* <PageInfo page={page}/> */}
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