import Index from "../components/Modal/Index"
import styles from "../styles/pageLayout/index.module.css"

import { useModalStore } from "../store/modal"

export default function PageLayout( {children} ) {
    const modal = useModalStore(state => state.modal)

    return (
        <>  
            {(modal > 0) ? <Index/> : null}

            <div className={styles.container}>
                <div className={styles.child}>
                    {/* <div className={styles.menu}>
                        <Menu/>
                    </div> */}

                    <div className={styles.pageInfo}>
                        <PageInfo/>
                    </div>

                    <div className={styles.previewContainer}>
                        <main className={styles.previewChild}>
                            {children}
                        </main>
                    </div>

                    {/* <div className={styles.paperOverview}>
                        -insert paper overview-
                    </div> */}
                </div>
            </div>
        </>
    )
}



function PageInfo() {
    return (
        <div>
            hello
        </div>
    )
}

