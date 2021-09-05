import styles from '../../styles/paperEditLayout/paperInfo.module.css'
import PageIcon from '../../assets/PageIcon/PageIcon'

export default function PageInfoShort({page}) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {page.page_icon.length > 6 ?
                    <img src={page.page_icon}/>
                :
                    <PageIcon color={'#'+page.page_icon}/>
                }
                <div className={styles.pagename}>
                    <h3>
                        {page.pagename}
                    </h3>
                    <div>
                        /{page.unique_pagename}
                    </div>
                </div>
            </div>
        </div>
    )
}
