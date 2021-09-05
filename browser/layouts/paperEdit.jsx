import PaperInfo from '../components/PageLayout/PaperInfo'
import styles from '../styles/paperEditLayout/index.module.css'
import NavPanel from "../components/NavPanel/Index"

export default function paperEdit({children, page}) {
    return (
        <div className={styles.container}>
            <div className={styles.child}>
                <div className={styles.pageInfo}>
                    <PaperInfo page={page}/>
                </div>

                <div className={styles.previewContainer}>
                    <div className={styles.previewChild}>
                        <main>
                            {children}
                        </main>
                    </div>
                </div>

                <div className={styles.overviewParent}>
                    <div className={styles.overview}>
                        -overview-
                    </div>
                    <NavPanel/>
                </div>

            </div>
        </div>
    )
}