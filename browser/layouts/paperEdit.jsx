import PaperInfo from '../components/PageLayout/PaperInfo'
import styles from '../styles/paperEditLayout/index.module.css'
import NavPanel from "../components/NavPanel/Index"
import onClickOutside from "react-onclickoutside";
import { useRouter } from 'next/router';

export default function paperEdit({children, page}) {
    return (
        <div className={styles.container}>
            <PaperPanelClickOutside children={children} page={page} outsideClickIgnoreClass={'ignore_click_outside_paper-image_modal'}/>
        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => PaperPanelClickOutside.handleClickOutside
}


var PaperPanelClickOutside = onClickOutside(({children, page}) => {
    PaperPanelClickOutside.handleClickOutside = () => {
        router.push(`/${router.query.page}/${router.query.mission}`)
    };

    const router = useRouter()

    return(
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
    )
}, clickOutsideConfig)