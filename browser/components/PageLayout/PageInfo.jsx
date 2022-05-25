import styles from '../../styles/pageLayout/pageInfo.module.css'
import PageIcon from '../../assets/PageIcon/PageIcon'
import config from '../../public/config.json'

export default function PageInfo({page, type}) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {page.page_icon.length > 6 ?
                    <img src={config.FILE_SERVER_URL+page.page_icon+'48x48.webp'} style={{width: 45, height: 45, borderRadius: 10}}/>
                :
                    <PageIcon color={'#'+page.page_icon}/>
                }
                <div className={`${type=='paper'?styles.paper:null} ${styles.pagename}`}>
                    <h3>
                        {page.pagename}
                    </h3>
                    <div>
                        /{page.unique_pagename}
                    </div>
                </div>
            </div>
            

            {type == 'paper'?
                null
            :
                <div className={styles.vision}>
                    {page.vision}
                </div>
            }
        </div>
    )
}