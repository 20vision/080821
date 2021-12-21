import { useEffect, useState, useRef } from "react"
import styles from "../../styles/forumLayout/bubble.module.css"
import TextareaAutosize from 'react-textarea-autosize';
import onClickOutside from "react-onclickoutside";
import {TwitterPicker} from "react-color"
import ProfilePicture from '../User/ProfilePicture/ProfilePicture'
import useUserProfile from '../../hooks/User/useUserProfile'

export default function Bubble({content, mirror}){
    return(
        <Styling content={content} mirror={mirror}/>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Styling.handleClickOutside
}

const Styling = onClickOutside(({content, mirror}) => {
    const [inputActive, setInputActive] = useState(false)
    const [post, setPost] = useState('')
    const [pickerVisible, setPickerVisible] = useState(false)
    const [hex, setHex] = useState()
    const [profile, isLoading, setUser] = useUserProfile()
    const hexArray = [
        '#fbe4a0', 
        '#fbcfa8', 
        '#fff8d1',
        '#ddfff7', 
        '#edd9ff', 
        '#e5fff9', 
        '#e4faff', 
        '#ffeaf8', 
        '#ffcece',
        '#d5fdbd'
    ]
    useEffect(() => {
        const index = Math.floor(Math.random()*9)
        setHex(hexArray[index])
    }, [])

    Styling.handleClickOutside = () => {
        if(post.length == 0){
            setInputActive(false)
        }
    };

    return(
        <div style={{display: 'flex', marginBottom: '45px'}}>
            {(content && content.profilePicture) || (profile && profile.profilePicture)?
                <div style={{margin: '5px 15px'}}>
                    <ProfilePicture type={'small'} uri={(content && content.profilePicture)?content.profilePicture:profile.profilePicture}/>
                </div>
                :
                null
            }
            <div style={{minHeight: '1px', minWidth: '1px', width: '100%'}}>
                <h3 style={{margin: '15px 0px'}}>@{(content && content.username)?content.username:profile.username}</h3>
                <div className={styles.container}>
                    {!mirror?<div className={styles.triangleLeft} style={{borderTop: `25px solid ${(content && content.hex_color && !inputActive)?content.hex_color:hex}`}}/>:null}
                    <div onClick={() => setInputActive(true)} className={styles.child} style={{backgroundColor: (content && content.hex_color && !inputActive)?content.hex_color:hex, borderTopRightRadius:mirror?'0px':'25px', borderTopLeftRadius:!mirror?'0px':'25px'}}>
                        {content && !inputActive?
                            <View/>
                        :
                            <div className={styles.textContainer}>
                                <TextareaAutosize 
                                    style={{width: '100%'}}
                                    minRows={2}
                                    placeholder="Everything is to a certain extend wrong. Try to make them less wrong."
                                    onChange={e => {setPost(e.target.value);}}
                                />

                                <div style={{display: 'flex', alignItems: 'center', marginTop: '15px'}}>
                                    <span style={{fontSize: '16px', color: (post.length > 280)?'#FF5B77':'#444'}}>{280-post.length}</span>
                                    <div onClick={() => console.log('send')} className={`${(post.length > 280)?styles.invalidVision:null} ${styles.sendAndSettings}`}>
                                        <a onClick={() => setPickerVisible(!pickerVisible)}>
                                            <div className={styles.pickedColor} style={{backgroundColor: hex}}/>
                                        </a>
                                        {pickerVisible && (
                                            <div style={{position: 'absolute'}}>
                                                <TwitterPickerClickOutside
                                                setPickerVisible={setPickerVisible}
                                                setHex={setHex}
                                                hexArray={hexArray}
                                                />
                                            </div>
                                        )}
                                        <h3>Send</h3>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {mirror?<div className={styles.triangleRight} style={{borderTop: `25px solid ${(content && content.hex_color && !inputActive)?content.hex_color:hex}`}}/>:null}
                </div>
            </div>
        </div>
    )
}, clickOutsideConfig)

function View(){
    return(
        <div>

        </div>
    )
}


const clickOutsideTwitterConfig = {
    handleClickOutside: () => TwitterPickerClickOutside.handleClickOutside
}

const TwitterPickerClickOutside = onClickOutside(({setHex, setPickerVisible, hexArray}) => {

    TwitterPickerClickOutside.handleClickOutside = () => {
        setPickerVisible(false)
    };

    return(
        <TwitterPicker
            onChangeComplete={({hex}) => {setHex(hex); setPickerVisible(false);}}
            colors={hexArray}
            triangle={'none'}
        />
    )
}, clickOutsideTwitterConfig)