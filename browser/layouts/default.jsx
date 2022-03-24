import Menu from "../components/DefaultLayout/Menu"
import styles from "../styles/defaultLayout/index.module.css"

export default function DefaultLayout( {children} ) {

    return (
        <>  
            <div className={styles.container}>
                <div className={styles.child}>
                    <div className={styles.menu}>
                        <Menu/>
                    </div>

                    <div className={styles.previewContainer}>
                        <main className={styles.previewChild}>
                            {children}
                        </main>
                    </div>

                    <div className={styles.componentOverview}>
                        -insert component overview-
                    </div>
                </div>
            </div>
        </>
    )
}
