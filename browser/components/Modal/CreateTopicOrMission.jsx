import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../styles/modal/createMission.module.css'
import Loading from '../../assets/Loading/Loading'
import axios from 'axios'
import { useModalStore } from '../../store/modal'
import {usePageSelectedStore} from '../../store/pageSelected'
import PageIcon from '../../assets/PageIcon/PageIcon'
import NumberFormat from 'react-number-format';

export default function CreateMission({type}) {
    const TitleRef = useRef(null)
    const BodyRef = useRef(null)
    const [Title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [Body, setBody] = useState('')
    const [validTitle, setValidTitle] = useState(false)
    const [validBody, setValidBody] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [timer, setTimer] = useState(null)
    const router = useRouter()
    const setModal = useModalStore(state => state.setModal)
    const page = usePageSelectedStore(state => state.page)
    
    useEffect(() => {
        if(timer){
            clearTimeout(timer)
            setTimer(null)
            setLoading(false)
            setValidTitle(false)
            setErrorMsg('')
        }
        if(Title.length < 2){
        }else if(Title.length > 100){
        }else{
            setLoading(true)
            setTimer(setTimeout(() => {
                if(Title.length < 4){
                    setErrorMsg(Title+' is not a valid mission')
                    setLoading(false)
                }else{
                    axios.get(`http://localhost:4000/get/mission_title_unique/${router.query.page}/${Title}`,{
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
    }, [Title])

    useEffect(() => {
        if((Body.length > 3) & (Body.length <= 280)){
            setValidBody(true)
        }else{
            setValidBody(false)
        }
    }, [Body])

    function addMission(){
        setLoading(true)
        axios.post(`http://localhost:4000/post/mission`,{pagename: router.query.page, missionTitle: Title, missionBody: Body},{
        withCredentials: true
        }).then(response => {
            router.push(`${router.query.page}/${Title.replace(' ', '_').toLowerCase()}`)
            setModal(0)
        })
        .catch(error =>{
            setErrorMsg(error.response.data)
        })
        .then(() =>{
            setLoading(false)
        })
    }

    function addTopic(){
        setLoading(true)
        console.log(router)
        axios.post(`http://localhost:4000/post/topic`,{pagename: router.query.index[0], topicTitle: Title, topicBody: Body},{
        withCredentials: true
        }).then(response => {
            router.push(`${router.query.index[0]}/${Title.replace(' ', '_').toLowerCase()}`)
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
            <h1 style={{marginBottom: '35px', textAlign: 'center'}}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </h1>
            <div className='areaLine'>
                <input maxLength="100" ref={TitleRef} placeholder={type.charAt(0).toUpperCase() + type.slice(1)+" Title"} onChange={e => {e.target.value = e.target.value.replace('_', ' '); setTitle(e.target.value);}}/>
                <div className={styles.body}>
                    <TextareaAutosize 
                        minRows={6}
                        ref={BodyRef}
                        placeholder={
                            type == 'mission'?
                                "Missions seperate your Vision into executable actions and explain how you are working towards your Vision."
                            :
                                "Create Topics where users can post related content. Topics can have a Voice Token threshold to be able to post."
                            }
                        onChange={e => {setBody(e.target.value);}}
                    />
                </div>
            </div>
            <div className={`${(Body.length > 280)?styles.invalidVision:null} ${styles.visionCount}`}>{280 - Body.length}</div>

            {type=='topic'?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px'}}>
                    <div style={{transform: 'scale(0.8)'}}>
                        {page.page_icon.length > 6 ?
                            <img src={page.page_icon}/>
                        :
                            <PageIcon color={'#'+page.page_icon}/>
                        }
                    </div>
                    <NumberFormat style={{
                            fontSize:'20px',
                            lineHeight: '20px',
                            fontWeight: '400',
                            marginRight: '15px',
                            textAlign: 'end',
                            width: 250
                        }} value={0} 
                        onValueChange={value => {}} 
                        allowedDecimalSeparators={','} 
                        placeholder="0" 
                        thousandSeparator=" " 
                        allowNegative={false} 
                        decimalSeparator="."
                    />
                </div>
            :
                null
            }
            
            <div className={styles.errorMsg}>
                {errorMsg}
            </div>

            <a
            onClick={e => {
                e.preventDefault()
                type=='mission'?addMission():type=='topic'?addTopic():null
            }} 
            className={`${styles.createPageButton} ${!validTitle || !validBody || loading ?styles.invalidButton:null}`}>
                {!loading?
                    <div>
                        <h2>Create</h2>
                    </div>
                :
                    <Loading/>
                }
            </a>
        </div>
    )
}
