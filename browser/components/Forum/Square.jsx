import styles from '../../styles/forumLayout/square.module.css'
import PageIcon from '../../assets/PageIcon/PageIcon'
import Lock from '../../assets/Lock'
import { useEffect } from 'react'
import HelpCircle16 from '../../assets/HelpCircle16'

export default function Square({content}){
    return(
        <div className={styles.container} style={{backgroundColor: `${content.page?'#444':content.mission?'#696969ce':content.topic?'#CECECE':null}`}}>
            {content.page?
                <div className={styles.header} style={{display: 'flex'}}>
                    {(content.page.page_icon.length < 7) ?
                        <PageIcon color={'#'+content.page.page_icon}/>
                    :
                        <img src={content.page.page_icon}/>
                    }
                    <div className={styles.pageNameDiv}>
                        <div>
                            /{content.page.unique_pagename}
                        </div>
                        <span>
                            Balance: 0
                        </span>
                    </div>
                </div>
            :content.mission?
                <div style={{display: 'flex'}} className={`${styles.header} ${!content.page?styles.fontColor:null}`}>
                    <h2>Mission · {content.mission.title}</h2>
                </div>
            :content.topic?
                <div style={{display: 'flex', alignItems: 'center'}} className={`${styles.header} ${!content.page?styles.fontColor:null}`}>
                    <Lock stroke='3'/>
                    <h2 style={{color: '#444', marginLeft: '10px', marginTop: '4px'}}>
                        {content.topic.threshold} · &nbsp;
                    </h2>
                    <h2 style={{color: '#444', marginLeft: '5px', marginTop: '4px'}}>{content.topic.name}</h2>
                </div>
            :
                null
            }
            <div className={!content.page?styles.fontColor:null}>
                {content.page?
                    content.page.vision
                :content.mission?
                    content.mission.description
                :content.topic?
                    content.topic.description
                :
                    null
                }
            </div>
        </div>
    )
}