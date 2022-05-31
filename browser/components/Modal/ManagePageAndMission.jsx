import {usePageSelectedStore} from '../../store/pageSelected'
import { Profile } from './User'
import indexStyles from '../../styles/modal/index.module.css'
import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../assets/Loading/Loading'
import config from '../../public/config.json'
import createTopicModalStyle from '../../styles/modal/createTopicOrMission.module.css'
import { useRouter } from 'next/router'

export default function ManagePageAndMission() {
    const page = usePageSelectedStore(state => state.page)
    const [selectedRoute, setSelectedRoute] = useState(0)
    const setFetch = usePageSelectedStore(state => state.setFetch)

    useEffect(() => {
        setFetch(true)
    }, [])

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
           {selectedRoute == 0?<Profile page={page}/>:<ManageMissions/>}
        </div>
    )
}

const ManageMissions = () => {
    const missions = usePageSelectedStore(state => state.missions)
    const setMissions = usePageSelectedStore(state => state.setMissions)
    const [newAndOldMissions, setNewAndOldMissions] = useState([])
    const [newMissions, setNewMissions] = useState([])
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setNewAndOldMissions(missions)
    }, [])


    useEffect(() => {
        setNewMissions(newAndOldMissions.filter((mission, index) => (mission.title != missions[index].title) || (mission.description != missions[index].description)))
    }, [newAndOldMissions])



    return(
        <div>
            <div style={{height: 400, overflowY: 'scroll'}}>
                {newAndOldMissions && newAndOldMissions.map((mission, index) => (<MissionRow newAndOldMissions={newAndOldMissions} setNewAndOldMissions={setNewAndOldMissions} missions={missions} index={index}/>))}
            </div>
            
            <a onClick={e => {
                axios.post(`${config.HTTP_SERVER_URL}/update/${router.query.page}/missions`, {missions: newMissions}, {withCredentials: true})
                .then(res => {
                    router.reload(window.location.pathname)
                })
                .catch(err => {
                    console.log(err.response)
                    toast.error('Error updating mission')
                })
            }}
            className={`${createTopicModalStyle.createPageButton} ${loading || 
                (newMissions.length == 0)
            ?createTopicModalStyle.invalidButton:null}`}>
                {!loading?
                    <div>
                        <h2>Save</h2>
                    </div>
                :
                    <Loading/>
                }
            </a>
        </div>
    )
}

const MissionRow = ({newAndOldMissions, setNewAndOldMissions, missions, index}) => {

    return(
        <div style={{borderLeft: '2px solid #ced4da', padding: '5px 15px', marginBottom: '50px'}}>
            <input 
                value={newAndOldMissions[index].title.replace(/_/g, ' ')} 
                onChange={e => setNewAndOldMissions(newAndOldMissions.slice(0, index).concat([{title: e.target.value.replace(/ /g, '_'), old_title: missions[index].title, description: newAndOldMissions[index].description}]).concat(newAndOldMissions.slice(index+1)))}
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    padding:'0px',
                    margin:'0px',
                    lineHeight:'20px',
                    width: '100%',
                }}
                max="100"
            />
            <TextareaAutosize
                style={{width: '100%'}}
                minRows={2}
                value={newAndOldMissions[index].description}
                onChange={e => setNewAndOldMissions(newAndOldMissions.slice(0, index).concat([{title: newAndOldMissions[index].title, old_title: missions[index].title , description: e.target.value}]).concat(newAndOldMissions.slice(index+1)))}
            />
            <div style={{marginTop: 15,textAlign: 'right',color: (newAndOldMissions[index].description.length <= 280)?'var(--black)':'var(--red)'}}>
                {newAndOldMissions[index].description?280-newAndOldMissions[index].description.length:0}
            </div>
        </div>
    )
}