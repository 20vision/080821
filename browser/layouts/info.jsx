import styles from "../styles/pageLayout/index.module.css"
import { useMenuStore } from '../store/defaultLayout'
import Menu from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";
import PageIcon from '../assets/PageIcon/PageIcon'
import { useRouter } from "next/router";
import useWindowSize from "../hooks/Page/useWindowsSize";
import { useEffect, useRef } from "react";

export default function InfoLayout( {children} ) {
    const opened = useMenuStore(state => state.opened)
    const router = useRouter()
    const ab = useRef()
    const size = useWindowSize()

    useEffect(() => {
        ab.current.scrollTo(0, 0);
    }, [router.query])

    return (
        <div className={styles.container} style={{color: 'var(--white)'}}>
            <div className={styles.child}>

                <div className={styles.pageInfo}>
                    <div className={styles.homescreen}>
                        <div className={styles.menu}>
                            <Menu/>
                        </div>
                    </div>
                </div>

                <div ref={ab} className={styles.previewContainer} style={{overflow: 'scroll'}}>
                    <div className={styles.previewChild}>
                        <main>
                            {children}
                        </main>
                    </div>
                </div>

            </div>
        </div>
    )
}