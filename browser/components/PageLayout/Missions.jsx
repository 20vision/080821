import styles from '../../styles/pageLayout/missions.module.css'

import Folder from '../../assets/Folder'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect,useState } from 'react'
import axios from 'axios'
import config from '../../public/config.json'

export default function Missions({missions}) {
    const router = useRouter()
    var missions = missions.sort(a => a.title.replace(/ /g, '_').toLowerCase() == router.query.mission ? -1 : 1)
    const [componentCount, setComponentCount] = useState()

    useEffect(async() => {
        try{
            setComponentCount((await axios.get(`${config.HTTP_SERVER_URL}/get/page/`+router.query.page+'/component/count')).data)
        }catch(err){
            console.error(err)
        }
    }, [router.query.page])

    return(
        <div className={styles.container}>
            <div className={styles.missions}>
                {missions.map((mission, index) => {
                    return (
                        <a key={index}><Link 
                                href={
                                    (router.query.mission && (mission.title.replace(/ /g, '_').toLowerCase() == router.query.mission.toLowerCase()))?
                                    `/${router.query.page}`
                                    :
                                    `/${router.query.page}/${mission.title.replace(/ /g, '_').toLowerCase()}`
                                }
                            >
                            <div style={{display: 'flex',flexDirection: 'column'}} className={(router.query.mission && (mission.title.replace(/ /g, '_').toLowerCase() == router.query.mission.toLowerCase()))?styles.selected:styles.mission}>
                                <h3>
                                    {mission.title.replace(/_/g, ' ')}
                                </h3>
                                <div>
                                    {mission.description}
                                </div>
                                <div style={{textAlign: 'center', marginTop: 'auto', color: (router.query.mission && (mission.title.replace(/ /g, '_').toLowerCase() == router.query.mission.toLowerCase()))?'var(--white)':'var(--lighter_black)'}}>
                                    {mission.component_count} Component{mission.component_count>1?'s':''}
                                </div>
                            </div>
                        </Link></a>
                    )
                })}
            </div>
            <div className={styles.missionFooter}>
                <Folder color="#8A8A8A"/><h3>{missions.length} Mission{missions.length>1?'s':null} {componentCount?' / '+componentCount+' Components':null}</h3>
            </div>
        </div>
    )
}