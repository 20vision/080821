import {usePageSelectedStore} from '../../store/pageSelected'
import PageIcon from '../../assets/PageIcon/PageIcon'
import { Profile } from './User'
import indexStyles from '../../styles/modal/index.module.css'
import { useState } from 'react'

export default function ManagePageAndMission() {
    const page = usePageSelectedStore(state => state.page)
    const [selectedRoute, setSelectedRoute] = useState(0)

    return (
        <div className="noselect" style={{width: 450}}>
            <div className={indexStyles.header} style={{marginBottom: 50}}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?indexStyles.highlight:null}>
                    Page
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?indexStyles.highlight:null}>
                    Missions
                </h1>
            </div>
           {selectedRoute == 0?
            <Profile page={page}/>
            :null}
        </div>
    )
}