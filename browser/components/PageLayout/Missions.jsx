import styles from '../../styles/pageLayout/missions.module.css'

import Folder from '../../assets/Folder'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Missions({missions}) {
    const router = useRouter()
    var missions = missions.sort(a => a.title.replace(' ', '_') == router.query.mission ? -1 : 1)
    return(
        <div className={styles.container}>
            <div className={styles.missions}>
                {missions.map((mission, index) => {
                    return (
                        <a><Link 
                                href={
                                    (router.query.mission && (mission.title.replace(' ', '_') == router.query.mission))?
                                    `/${router.query.page}`
                                    :
                                    `/${router.query.page}/${mission.title.replace(' ', '_')}`
                                }
                            >
                            <div key={index} className={(router.query.mission && (mission.title.replace(' ', '_') == router.query.mission))?styles.selected:styles.mission}>
                                <h3>
                                    {mission.title}
                                </h3>
                                <div>
                                    {mission.description}
                                </div>
                            </div>
                        </Link></a>
                    )
                })}
            </div>
            <div className={styles.missionFooter}>
                <Folder color="#8A8A8A"/><h3>{missions.length} Mission{missions.length>1?'s':null}/~300 Papers</h3>
            </div>
        </div>
    )
}