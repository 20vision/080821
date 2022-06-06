import styles from '../../styles/modal/user.module.css'
import indexStyles from '../../styles/modal/index.module.css'

import { useState, useRef, useEffect } from 'react'
import { DateTime } from "luxon";
import useUserProfile from '../../hooks/User/useUserProfile'
import useUsernameValidation from '../../hooks/User/useUsernameValidation'
import useImageValidation from '../../hooks/Image/useImageValidation'

import ProfilePicture from '../User/ProfilePicture/ProfilePicture'

import Check from '../../assets/Check'
import Camera from '../../assets/Camera'
import X from '../../assets/X'
import CheckSquare from "../../assets/CheckSquare"
import Square from "../../assets/Square"
import {BarLoader} from "react-spinners";
import usePagenameValidation from '../../hooks/Page/usePagenameValidation'
import AvatarEditor from 'react-avatar-editor'
import useAvatarToUrl from '../../hooks/Image/useAvatarToUrl'
import {usePageSelectedStore} from '../../store/pageSelected'
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../../public/config.json'
import { toast } from 'react-toastify'
import TextareaAutosize from 'react-textarea-autosize'
import createTopicModalStyle from '../../styles/modal/createTopicOrMission.module.css'
import Loading from '../../assets/Loading/Loading'

export default function User() {
    const [selectedRoute, setSelectedRoute] = useState(0)
    const [profile, isLoading, setUser] = useUserProfile()
    const [username, setUsername, valid, errorMsg, loading, publishNewUsername] = useUsernameValidation()

    return(
        <div>
            <div className={indexStyles.header}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?indexStyles.highlight:null}>
                    Profile
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?indexStyles.highlight:null}>
                    Logout
                </h1>
            </div>

            {selectedRoute == 0 ? 
            <Profile
                profile={profile}
                isLoading={isLoading}
                setUser={setUser}
                username={username}
                setUsername={setUsername}
                valid={valid}
                errorMsg={errorMsg}
                loading={loading}
                publishNewUsername={publishNewUsername}
            /> : <Logout profile={profile}/>}

        </div>
    )
}

export function Profile({
    profile, 
    isLoading, 
    setUser,
    username, 
    setUsername, 
    valid, 
    errorMsg,
    publishNewUsername,
    page}){
    const [validateImage, imageValidationError, validImage] = useImageValidation()

    const [loadingUrl, url, setImage, err, setErr] = useAvatarToUrl({isPage: profile?false:true})

    const [scaleImg, setScaleImg] = useState(1)
        
    const showFileUpload = useRef()
    const croppedImgRef = useRef()

    const [pagenameNotUnique, setPagenameNotUnique] = useState()
    const [uniquePagename, setUniquePagename] = useState()
    const [setNewPagename, pagename, pagenameError, validPagenameLoading] = usePagenameValidation()
    const router = useRouter()
    
    const [vision, setVision] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(page && page.vision) setVision(page.vision)
    }, [page])

    useEffect(() => {
        if(url && profile){
            let newProfile = profile
            newProfile.profilePicture = url
            setUser(newProfile)
            validateImage(null)
        }else if(url){
            router.reload(window.location.pathname)
        }
    }, [url])

    useEffect(() => {
        if(page && page.unique_pagename) setUniquePagename(page.unique_pagename)
        if(page && page.pagename) setPagenameNotUnique(page.pagename)
    }, [page])

    return(
        <>
            {(validImage != null)?
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{maxWidth: 300}}>
                        <AvatarEditor
                            ref={croppedImgRef}
                            image={validImage}
                            width={250}
                            height={250}
                            borderRadius={page?50:300}
                            color={[250, 250, 250]} // RGBA
                            scale={scaleImg}
                            rotate={0}
                        />

                        <div className={styles.errormsg}>
                            {err}
                        </div>

                        {loadingUrl?
                            <div className="flexx">
                                <BarLoader css="display:block;height:4px;" height={4} color="#FF5B77" width={200}/>
                            </div>
                        :
                            <div className="flexy">
                                <a onClick={() => validateImage()}>
                                    <X color="#8A8A8A"/>
                                </a>
                                <input style={{margin: '0px 25px'}} type="range" value={scaleImg} onChange={(e) => setScaleImg(parseFloat(e.target.value))} step={0.01} min={1} max={5}/>
                                <a onClick={() => setImage(croppedImgRef.current.getImage().toDataURL())}>
                                    <Check color="#FF5B77"/>
                                </a>
                            </div>
                        }
                    </div>
                </div>
            :
                <div className={styles.profileContainer}>
                    <div style={{...{display: 'flex', justifyContent: 'center', alignItems: 'center'},...profile?{flexDirection: 'column'}:null}}>
                        <a onClick={!isLoading ? () => showFileUpload.current.click() : null} style={{width: 150, height: 150, display: 'block'}}>
                            <div className={styles.profileEdit} style={page?{borderRadius: 35}:null}>
                                <div className={styles.profile}>
                                    <ProfilePicture type={'large'} page={page} loading={isLoading} uri={profile && profile.profilePicture?profile.profilePicture:(page && page.page_icon && page.page_icon.length > 6)?page.page_icon:null}/>
                                </div>
                                <div className={styles.cameraContainer}>
                                    <Camera color="#FAFAFA"/>
                                </div>
                            </div>
                        </a>
                        <div style={page?{marginLeft: 50}:null}>
                            {profile?
                                <>
                                    <div className={`inputLine ${styles.usernameContainer}`}>
                                        <span>@</span><input value={username?username:(profile.username)} onChange={e => setUsername(e.target.value.toLocaleLowerCase())}/>
                                        {((username != profile.username) && (valid) && (!loading))?
                                            <a onClick={() => publishNewUsername()} style={{margin: '0px 0px -5px 5px'}}>
                                                <Check size={16} color="#FF5B77"/>
                                            </a>
                                        :
                                            <div style={{width: 16, height: 1}}/>
                                        }
                                    </div>
                                    <div style={{width: '180px',marginTop: 15}}>
                                        <span className={styles.errorMsg}>{errorMsg} {imageValidationError}</span>
                                    </div>
                                </>
                            :page?
                                <div>
                                    <div className={`inputLine ${styles.usernameContainer}`}>
                                        <input value={pagenameNotUnique!=null?pagenameNotUnique:page.pagename} onChange={e => setPagenameNotUnique(e.target.value)}/>
                                        {/* {(/^[a-zA-Z0-9 _.]{1,50}$/).test(pagenameNotUnique) && pagenameNotUnique != page.pagename?
                                            <a onClick={async() => {
                                                try{
                                                    await axios.post(`${config.HTTP_SERVER_URL}/update/pagename/${router.query.page}`, {pagename: pagenameNotUnique}, {withCredentials: true})
                                                    router.push(window.location.pathname)
                                                }catch(err){
                                                    toast.error('Failed to change pagename')
                                                    console.log((err && err.response)?err.response:err)
                                                }
                                            }} style={{margin: '0px 0px -5px 5px'}}>
                                                <Check size={16} color="#FF5B77"/>
                                            </a>
                                        :
                                            <div style={{width: 16, height: 1}}/>
                                        } */}
                                    </div>
                                    <div className={`inputLine ${styles.usernameContainer}`}>
                                    <span>/</span><input value={uniquePagename} onChange={e => {setUniquePagename(e.target.value); setNewPagename(e.target.value.toLocaleLowerCase());}}/>
                                        {/* {((pagename != page.unique_pagename) && pagename && (!pagenameError) && (!validPagenameLoading))?
                                            <a onClick={async() => {
                                                try{
                                                    await axios.post(`${config.HTTP_SERVER_URL}/update/unique_pagename/${router.query.page}`, {pagename: pagename}, {withCredentials: true})
                                                    router.push(`/${pagename}${router.query.mission?'/'+router.query.mission:null}`)
                                                }catch(err){
                                                    toast.error('Failed to change unique Pagename')
                                                    console.log((err && err.response)?err.response:err)
                                                }
                                            }} style={{margin: '0px 0px -5px 5px'}}>
                                                <Check size={16} color="#FF5B77"/>
                                            </a>
                                        :
                                            <div style={{width: 16, height: 1}}/>
                                        } */}
                                    </div>
                                </div>
                            :null}
                            {loading?
                                <BarLoader css="display:block;height:2px;" height={2} color="#FF5B77" width={190}/>
                            :
                                null
                            }
                        </div>
                    </div>
                    
                    <input
                        style={{display: 'none'}}
                        accept="image/jpeg,image/png"
                        type="file"
                        multiple={false}
                        onChange={(e) => {validateImage(e.target.files[0]); setErr(null);}}
                        ref={showFileUpload}
                    />


                    {page?
                        <div style={{width: '100%', marginTop: 35}}>

                            <div style={{borderLeft: '2px solid #ced4da', padding: '5px 15px', width: '100%'}}>
                                <TextareaAutosize
                                    style={{width: '100%'}}
                                    minRows={2}
                                    value={vision}
                                    onChange={e => {setVision(e.target.value);}}
                                />
                            </div>
                            <div style={{marginTop: 15,textAlign: 'right',color: (vision.length <= 500)?'var(--black)':'var(--red)'}}>
                                {vision?500-vision.length:0}
                            </div>
                            <div style={{width: '100%', margin: '30px 0px'}}>
                                <span className={styles.errorMsg}>
                                    {errorMsg} 
                                    {uniquePagename != page.unique_pagename?pagenameError:null} 
                                    {!(/^[a-zA-Z0-9 _.]{3,50}$/).test(pagenameNotUnique)?'Pagenames can only contain letters, numbers, dots and underscores and have 50 characters at most':null} 
                                    {imageValidationError}
                                </span>
                            </div>
                            <a
                            onClick={async e => {
                                try{
                                    setLoading(true)
                                    if(((pagename != page.unique_pagename) && pagename && (!pagenameError) && (!validPagenameLoading))){
                                        await axios.post(`${config.HTTP_SERVER_URL}/update/unique_pagename/${router.query.page}`, {pagename: pagename}, {withCredentials: true})
                                    }
                                    if((/^[a-zA-Z0-9 _.]{3,50}$/).test(pagenameNotUnique) && pagenameNotUnique != page.pagename){
                                        await axios.post(`${config.HTTP_SERVER_URL}/update/pagename/${router.query.page}`, {pagename: pagenameNotUnique}, {withCredentials: true})
                                    }
                                    if((vision != page.vision) && !((vision.length < 4) || (vision.length > 500))){
                                        await axios.post(`${config.HTTP_SERVER_URL}/update/vision/${router.query.page}`, {vision: vision}, {withCredentials: true})
                                    }
                                    router.reload(window.location.pathname)
                                }catch(err){
                                    toast.error('Could not save. An error occurred')
                                    console.log((err && err.response)?err.response:err)
                                    setLoading(false)
                                }
                            }} 
                            className={`${createTopicModalStyle.createPageButton} ${loading || 
                                ((vision != page.vision) && ((vision.length < 4) || (vision.length > 500))) ||
                                (!(/^[a-zA-Z0-9 _.]{3,50}$/).test(pagenameNotUnique) && pagenameNotUnique != page.pagename) ||
                                ((uniquePagename != page.unique_pagename) && (!pagename || (pagenameError) || (validPagenameLoading))) ||
                                ((vision == page.vision) && (uniquePagename == page.unique_pagename) && (pagenameNotUnique == page.pagename))
                            ?createTopicModalStyle.invalidButton:null}`}>
                                {!loading && !validPagenameLoading && !loadingUrl?
                                    <div>
                                        <h2>Save</h2>
                                    </div>
                                :
                                    <Loading/>
                                }
                            </a>
                        </div>
                    :null}
                </div>
            }
        </>
    )
        
    
}

function Logout({profile}){
    const router = useRouter()

    useEffect(() => {
        if(!profile) return
        setLoading(true)
        axios.get(`${config.HTTP_SERVER_URL}/get/user_sessions`, {withCredentials: true})
        .then((response) => {
            setSessions(response.data)
            setLoading(false)
        })
        .catch(err => {
            toast.error('Could not find sessions')
            setLoading(false)
        })
    }, [profile])

    const [sessions, setSessions] = useState()
    const [loading, setLoading] = useState()

    const [allActive, setAllActive] = useState(true)

    useEffect(() => {
        let allActiveLocal = true

        if(!sessions || (sessions.length <= 1)) return
        for(var i=0;i<sessions.length;i++){ 
            if(sessions[i].selected==true) {
                allActiveLocal = false 
                break;
            } 
        }
        setAllActive(allActiveLocal)
    }, sessions)

    return(
        <div>
            <div style={{overflowY: 'scroll', maxHeight: 180}}>
                {sessions && sessions.map((session, index) => (<div key={index}><SessionRow session={session} setSessions={arg => setSessions([...sessions.slice(0, index),{...session,selected: arg},...sessions.slice(index+1)])} index={index}/></div>))}
            </div>
            <a
                onClick={async e => {
                    setLoading(true)
                    let selectedSession = []
                    if(!allActive) {
                        for(var i = 0;i<sessions.length;i++){
                            if(sessions[i].selected) {
                                selectedSession = [...selectedSession, {session_id: sessions[i].session_id}]
                            }
                        }
                    }
                    axios.post(`${config.HTTP_SERVER_URL}/update/sessions`, {sessions: allActive?sessions:selectedSession}, {withCredentials: true})
                    .then(res => {
                        router.reload(window.location.pathname)
                    })
                    .catch(err => {
                        console.log((err && err.response)?err.response:err)
                        toast.error('Could not logout all sessions')
                    })
                    .then(() => setLoading(false))
                }} 
                className={`${createTopicModalStyle.createPageButton} ${sessions && (sessions.length > 0)?null:createTopicModalStyle.invalidButton}`}>
                    {!loading?
                        <div>
                            {allActive?<h2>Logout all</h2>:<h2>Logout selected</h2>}
                        </div>
                    :
                        <Loading/>
                    }
                </a>
        </div>
    )
}

const SessionRow = ({session, setSessions, index}) => {

    return(
        <a onClick={() => {
            session.selected?
                setSessions(false)
            :
                setSessions(true)
        }} style={{display: 'flex', alignItems: 'center', margin: '15px 0px'}}>
            <div style={{margin: 15, marginRight: 30}}>
                {session.selected?<CheckSquare color="var(--red)"/>:<Square/>}
            </div>
            <div style={{margin: 15, marginRight: 30, marginLeft: 0}}>
                <h2>
                    {session.device?session.device:'Unknown device'}
                </h2>
                <div style={{fontSize: 12, marginTop: 5, color: 'var(--grey)'}}>
                    last use: {DateTime.fromISO(session.last_use).toLocaleString(DateTime.DATE_MED)}
                </div>
            </div>
        </a>
    )
}