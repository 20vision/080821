import styles from '../../styles/modal/user.module.css'

import { useState, useRef } from 'react'

import useUserProfile from '../../hooks/User/useUserProfile'
import useUsernameValidation from '../../hooks/User/useUsernameValidation'

import ProfilePicture from '../User/ProfilePicture/ProfilePicture'

import BounceLoader from "react-spinners/BounceLoader";
import AvatarEditor from 'react-avatar-editor'

export default function User() {
    const [selectedRoute, setSelectedRoute] = useState(0)
    return(
        <div>
            <div className={styles.header}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?styles.highlight:null}>
                    Profile
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?styles.highlight:null}>
                    Logout
                </h1>
            </div>

            {selectedRoute == 0 ? <Profile/> : <Logout/>}

        </div>
    )
}

function Profile(){
    const [profile, isLoading] = useUserProfile()
    const [username, setUsername, valid, errorMsg, loading] = useUsernameValidation()

    const [selectedFile, setSelectedFile] = useState()
    const [scaleImg, setScaleImg] = useState(1)
    const showFileUpload = useRef()

    if(selectedFile){
        return(
            <div>
                <AvatarEditor
                    image={selectedFile}
                    width={250}
                    height={250}
                    borderRadius={300}
                    color={[250, 250, 250]} // RGBA
                    scale={scaleImg}
                    rotate={0}
                />

                <div className="flexx">
                    <input type="range" value={scaleImg} onChange={(e) => setScaleImg(e.target.value)} step="0.01" min="1" max="10"/>
                </div>
            </div>
        )
    }else{
        return(
            <div className={styles.profileContainer}>
                <a onClick={!isLoading ? () => showFileUpload.current.click() : null}>
                    <div className={styles.profileEdit}>
                        <ProfilePicture type={'large'} loading={isLoading} uri={profile.profilePicture?profile.profilePicture:null}/>
                    </div>
                </a>
                <input
                    style={{display: 'none'}}
                    accept="image/jpg image/png"
                    type="file"
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    ref={showFileUpload}
                />
            </div>
        )
    } 
        
    
}

function Logout(){
    return(
        <div>

        </div>
    )
}


// Sub Components

function LoadingProfilePicture(){
    return(
        <div className={styles.profilePicture}>
            <BounceLoader/>
        </div>
    )
}