import styles from '../../styles/user/user.module.css'

import { useState, useRef, useEffect } from 'react'

import useUserProfile from '../../hooks/User/useUserProfile'
import useUsernameValidation from '../../hooks/User/useUsernameValidation'

import ProfilePicture from '../User/ProfilePicture/ProfilePicture'

import Check from '../../assets/Check'
import Camera from '../../assets/Camera'
import X from '../../assets/X'

import {BarLoader} from "react-spinners";

import AvatarEditor from 'react-avatar-editor'
import avatarToUrl from '../../hooks/Image/avatarToUrl'

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
    const [profile, isLoading, setUser] = useUserProfile()
    const [username, setUsername, valid, errorMsg, loading] = useUsernameValidation()

    const [loadingUrl, url, setImage, err, setErr] = avatarToUrl()

    const [selectedFile, setSelectedFile] = useState()
    const [scaleImg, setScaleImg] = useState(1)

    const showFileUpload = useRef()
    const croppedImgRef = useRef()


    useEffect(() => {
        if(url){
            let newProfile = profile
            newProfile.profilePicture = url
            setUser(newProfile)
            setSelectedFile()
        }
    }, [url])

    return(
        <>
            {selectedFile != null?
                <div>
                    <div>
                        <AvatarEditor
                            ref={croppedImgRef}
                            image={selectedFile}
                            width={250}
                            height={250}
                            borderRadius={300}
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
                                <a onClick={() => setSelectedFile()}>
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
                    <a onClick={!isLoading ? () => showFileUpload.current.click() : null}>
                        <div className={styles.profileEdit}>
                            <div className={styles.profile}>
                                <ProfilePicture type={'large'} loading={isLoading} uri={profile.profilePicture?profile.profilePicture:null}/>
                            </div>
                            <div className={styles.cameraContainer}>
                                <Camera color="#FAFAFA" size={18}/>
                            </div>
                        </div>
                    </a>
                    <input
                        style={{display: 'none'}}
                        accept="image/jpeg,image/png,image/webp"
                        type="file"
                        value={selectedFile}
                        multiple={false}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        ref={showFileUpload}
                    />
                </div>
        }
        </>
    )
        
    
}

function Logout(){
    return(
        <div>

        </div>
    )
}