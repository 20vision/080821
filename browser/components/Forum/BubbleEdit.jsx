import { useEffect, useState, useRef } from "react"
import styles from '../../styles/forumLayout/edit_bubble.module.css'
import TextareaAutosize from 'react-textarea-autosize';
import {TwitterPicker} from "react-color"
import { useForumStore } from "../../store/forum";

export default function BubbleEdit({setEditHexColor, sendPost, indx}){
    const [post, setPost] = useState('')
    const [pickerVisible, setPickerVisible] = useState(false)
    const [hex, setHex] = useState()
    const bubbleEditRef = useRef()
    const [listening, setListening] = useState(false);
    let listeningRef = useRef(false);
    const setReplyIndex = useForumStore(state => state.setReplyIndex)
    const replyIndex = useForumStore(state => state.replyIndex)

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
    const setListeningState = data => {
        listeningRef.current = data
        setListening(data)
    }

    useEffect(() => {
        if((post.length == 0) && (listening == false)){
            setListeningState(true)
        }else if((post.length > 0) && (listening == true)){
            setListeningState(false)
        }
    }, [post])

    function handleClickOutside(evt){
        if(bubbleEditRef.current && !bubbleEditRef.current.contains(evt.target) && (listeningRef.current == true) && (replyIndex==indx)){
            setReplyIndex(null)
        }
    }

    useEffect(() => {
        const hexIndex = Math.floor(Math.random()*9)
        setEditHexColor(hexArray[hexIndex].replace('#',''))
        setHex(hexArray[hexIndex])
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("touchend", handleClickOutside);
        };
    }, [])

    return(
        <div ref={bubbleEditRef} className={styles.container}>
            <TextareaAutosize
                style={{width: '100%'}}
                minRows={2}
                placeholder="Everybody is to a certain extend wrong. Try to make them less wrong."
                onChange={e => {setPost(e.target.value);}}
            />

            <div className={styles.footer}>
                <div style={{fontSize: '16px', color: (post.length > 280)?'#FF5B77':'#444'}}>
                    {280-post.length}
                </div>
                <div className={`${((post.length > 280) || (post.length == 0))?'no_shadow_transition':'shadow_small_transition'} ${styles.button}`}>
                    {pickerVisible && (<div style={{position: 'absolute', marginTop: '30px', marginLeft: '-13px'}}><TwitterPicker
                        onChangeComplete={({hex}) => {setEditHexColor(hex.replace('#','')); setHex(hex); setPickerVisible(false);}}
                        colors={hexArray}
                    /></div>)}
                    <a onClick={() => setPickerVisible(!pickerVisible)}>
                        <div className={styles.pickedColor} style={{backgroundColor: hex}}/>
                    </a>
                    <h3 onClick={() => {sendPost(post)}} style={{color: '#FAFAFA'}} className={((post.length > 280) || (post.length == 0))?'no_click':'clickable'}>Send</h3>
                </div>
            </div>
        </div>
    )
}