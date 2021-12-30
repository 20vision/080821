import styles from '../../styles/forumLayout/layout_bubble.module.css'
import ProfilePicture from '../User/ProfilePicture/ProfilePicture'

export default function BubbleBasicLayout({children, mirror, color, profile, isHighlight}){
    return(
        <div style={{display:'flex', marginBottom: '45px'}} className={`${isHighlight?styles.active:styles.inactive} ${mirror?styles.mirror:null}`}>
            <div style={{margin: '5px 0px'}} className={mirror?styles.mirror:null}>
                <ProfilePicture type={'small'} uri={profile.profilePicture}/>
            </div>

            <div style={{width: '100%', marginLeft: '10px'}}>
                <h3 style={{...{margin: '15px 0px'},...mirror?{textAlign:'right'}:null}} className={mirror?styles.mirror:null}>@{profile.username}</h3>
                <div style={{display:'flex'}}>
                    <div className={styles.triangle} style={{borderTop: `25px solid ${'#'+color}`}}/>
                    <div className={styles.bubble} style={{backgroundColor: '#'+color, marginRight:'50px'}}>
                        <div className={mirror?styles.mirror:null}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// import { useEffect, useState, useRef } from "react"
// import styles from "../../styles/forumLayout/bubble.module.css"
// import TextareaAutosize from 'react-textarea-autosize';
// import onClickOutside from "react-onclickoutside";
// import {TwitterPicker} from "react-color"
// import ProfilePicture from '../User/ProfilePicture/ProfilePicture'
// import useUserProfile from '../../hooks/User/useUserProfile'
// import axios from "axios";

// export default function Bubble({content, index}){
//     return(
//         <Styling content={content} index={index}/>
//     )
// }

// const clickOutsideConfig = {
//     handleClickOutside: () => Styling.handleClickOutside
// }

// const Styling = ({content, index}) => {
//     const [inputActive, setInputActive] = useState(false)
//     const [post, setPost] = useState('')
//     const [pickerVisible, setPickerVisible] = useState(false)
//     const [hex, setHex] = useState()
//     const [profile, isLoading, setUser] = useUserProfile()
//     const menuRef = useRef(null);
//     const [listening, setListening] = useState(false);
//     let listeningRef = useRef(false);

//     const setListeningState = data => {
//         listeningRef.current = data
//         setListening(data)
//     }

//     const hexArray = [
//         '#fbe4a0', 
//         '#fbcfa8', 
//         '#fff8d1',
//         '#ddfff7', 
//         '#edd9ff', 
//         '#e5fff9', 
//         '#e4faff', 
//         '#ffeaf8', 
//         '#ffcece',
//         '#d5fdbd'
//     ]
    
//     function handleClickOutside(evt){
//         if(menuRef.current && !menuRef.current.contains(evt.target) && (listeningRef.current == true)){
//             setInputActive(false)
//         }
//     }

//     useEffect(() => {
//         document.addEventListener("click", handleClickOutside);
//         document.addEventListener("touchend", handleClickOutside);
//         const hexIndex = Math.floor(Math.random()*9)
//         setHex(hexArray[hexIndex])
//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//             document.removeEventListener("touchend", handleClickOutside);
//         };
//     }, [])

//     useEffect(() => {
//         if((post.length == 0) && (listening == false)){
//             setListeningState(true)
//         }else if((post.length > 0) && (listening == true)){
//             setListeningState(false)
//         }
//     }, [post])

//     return(
//         <div ref={menuRef} style={{display: 'flex', marginBottom: '45px'}} className={`${inputActive?'user_shadow_large':null} ${!inputActive?styles.inactive:styles.active}`}>
//             {(content && !Array.isArray(content) && content.profilePicture) || (profile && profile.profilePicture)?
//                 <div style={{margin: '5px 15px'}}>
//                     <ProfilePicture type={'small'} uri={(content && !Array.isArray(content) && content.profilePicture)?content.profilePicture:profile.profilePicture}/>
//                 </div>
//                 :
//                 null
//             }
//             <div style={{minHeight: '1px', minWidth: '1px', width: '100%'}}>
//                 <h3 style={{margin: '15px 0px'}}>@{(content && !Array.isArray(content) && content.username)?content.username:profile.username}</h3>
//                 <div className={styles.container}>
//                     {(index % 2 == 0)?<div className={styles.triangleLeft} style={{borderTop: `25px solid ${(content && !Array.isArray(content) && content.hex_color && !inputActive)?content.hex_color:hex}`}}/>:null}
//                     <div onClick={() => setInputActive(true)} className={styles.child} style={{backgroundColor: (content && !Array.isArray(content) && content.hex_color && !inputActive)?content.hex_color:hex, borderTopRightRadius:!(index % 2 == 0)?'0px':'25px', borderTopLeftRadius:(index % 2 == 0)?'0px':'25px'}}>
//                         {content && !Array.isArray(content) && !inputActive?
//                             <View/>
//                         :
//                             <div className={styles.textContainer}>
//                                 <TextareaAutosize 
//                                     style={{width: '100%'}}
//                                     minRows={2}
//                                     placeholder="Everybody is to a certain extend wrong. Try to make them less wrong."
//                                     onChange={e => {setPost(e.target.value);}}
//                                 />

//                                 <div style={{display: 'flex', alignItems: 'center', marginTop: '15px'}}>
//                                     <span style={{fontSize: '16px', color: (post.length > 280)?'#FF5B77':'#444'}}>{280-post.length}</span>
//                                     <div onClick={() => console.log('send')} className={`${((post.length == 0) || (post.length > 280))?styles.invalidPost:styles.validPost} ${styles.sendAndSettings}`}>
//                                         <a onClick={() => setPickerVisible(!pickerVisible)}>
//                                             <div className={styles.pickedColor} style={{backgroundColor: hex}}/>
//                                         </a>
//                                         {pickerVisible && (
//                                             <div style={{position: 'absolute'}}>
//                                                 <TwitterPickerClickOutside
//                                                 setPickerVisible={setPickerVisible}
//                                                 setHex={setHex}
//                                                 hexArray={hexArray}
//                                                 />
//                                             </div>
//                                         )}
//                                         <h3 onClick={() => sendPost}>Send</h3>
//                                     </div>
//                                 </div>
//                             </div>
//                         }
//                     </div>
//                     {!(index % 2 == 0)?<div className={styles.triangleRight} style={{borderTop: `25px solid ${(content && !Array.isArray(content) && content.hex_color && !inputActive)?content.hex_color:hex}`}}/>:null}
//                 </div>
//             </div>
//         </div>
//     )
// }

// function View(){
//     return(
//         <div>

//         </div>
//     )
// }


// const clickOutsideTwitterConfig = {
//     handleClickOutside: () => TwitterPickerClickOutside.handleClickOutside
// }

// const TwitterPickerClickOutside = onClickOutside(({setHex, setPickerVisible, hexArray}) => {

//     TwitterPickerClickOutside.handleClickOutside = () => {
//         setPickerVisible(false)
//     };

//     return(
//         <TwitterPicker
//             onChangeComplete={({hex}) => {setHex(hex); setPickerVisible(false);}}
//             colors={hexArray}
//             triangle={'none'}
//         />
//     )
// }, clickOutsideTwitterConfig)