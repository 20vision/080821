import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../styles/modal/createMission.module.css'
import Loading from '../../assets/Loading/Loading'
import axios from 'axios'
import { useModalStore } from '../../store/modal'

export default function CreateMission() {
    const missionTitleRef = useRef(null)
    const missionBodyRef = useRef(null)
    const [missionTitle, setMissionTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [missionBody, setMissionBody] = useState('')
    const [validTitle, setValidTitle] = useState(false)
    const [validBody, setValidBody] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [timer, setTimer] = useState(null)
    const router = useRouter()
    const setModal = useModalStore(state => state.setModal)

    useEffect(() => {
        if(timer){
            clearTimeout(timer)
            setTimer(null)
            setLoading(false)
            setValidTitle(false)
            setErrorMsg('')
        }
        if(missionTitle.length < 2){
        }else if(missionTitle.length > 100){
        }else{
            setLoading(true)
            setTimer(setTimeout(() => {
                if(missionTitle.length < 4){
                    setErrorMsg(missionTitle+' is not a valid mission')
                    setLoading(false)
                }else{
                    axios.get(`http://localhost:4000/get/mission_title_unique/${router.query.page}/${missionTitle}`,{
                    withCredentials: true
                    }).then(response => {
                        setValidTitle(true)
                    })
                    .catch(error =>{
                        setErrorMsg(error.response.data)
                    })
                    .then(() =>{
                        setLoading(false)
                    })
                }
            }, 1000))
        }
    }, [missionTitle])

    useEffect(() => {
        if((missionBody.length > 3) & (missionBody.length <= 280)){
            setValidBody(true)
        }else{
            setValidBody(false)
        }
    }, [missionBody])

    function addMission(){
        setLoading(true)
        axios.post(`http://localhost:4000/post/mission`,{pagename: router.query.page, missionTitle: missionTitle, missionBody: missionBody},{
        withCredentials: true
        }).then(response => {
            router.push(`${router.query.page}/${missionTitle.replace(' ', '_').toLowerCase()}`)
            setModal(0)
        })
        .catch(error =>{
            setErrorMsg(error.response.data)
        })
        .then(() =>{
            setLoading(false)
        })
    }

    return (
        <div>
            <div className='areaLine'>
                <input maxLength="100" ref={missionTitleRef} placeholder="Mission Title" onChange={e => {e.target.value = e.target.value.replace('_', ' '); setMissionTitle(e.target.value);}}/>
                <div className={styles.body}>
                    <TextareaAutosize 
                        minRows={6}
                        ref={missionBodyRef}
                        placeholder="Mission - They seperate your Vision into executable actions and explain how you are working towards your Vision"
                        onChange={e => {setMissionBody(e.target.value);}}
                    />
                </div>
            </div>
            <div className={`${(missionBody.length > 280)?styles.invalidVision:null} ${styles.visionCount}`}>{280 - missionBody.length}</div>
            
            <div className={styles.errorMsg}>
                {errorMsg}
            </div>

            <a
            onClick={e => {
                e.preventDefault()
                addMission()
            }} 
            className={`${styles.createPageButton} ${!validTitle || !validBody || loading ?styles.invalidButton:null}`}>
                {!loading?
                    <div>
                        <h2>Add Mission</h2>
                    </div>
                :
                    <Loading/>
                }
            </a>
        </div>
    )
}
