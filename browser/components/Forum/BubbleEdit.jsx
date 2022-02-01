import { useEffect, useState, useRef } from "react"
import styles from '../../styles/forumLayout/edit_bubble.module.css'
import TextareaAutosize from 'react-textarea-autosize';
import {TwitterPicker} from "react-color"
import OutsideClickHandler from 'react-outside-click-handler';

export default function BubbleEdit({setEditHexColor, sendPost, clickOutsideBubbleEdit}){
    const [post, setPost] = useState('')
    const [pickerVisible, setPickerVisible] = useState(false)
    const [hex, setHex] = useState()
    const bubbleEditRef = useRef()
    const [listening, setListening] = useState(false);

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
        if((post.length == 0) && (listening == false)){
            setListening(true)
        }else if((post.length > 0) && (listening == true)){
            setListening(false)
        }
    }, [post])

    useEffect(() => {
        const hexIndex = Math.floor(Math.random()*9)
        setEditHexColor(hexArray[hexIndex].replace('#',''))
        setHex(hexArray[hexIndex])
    }, [])

    return(
        <OutsideClickHandler onOutsideClick={() => clickOutsideBubbleEdit()}>
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
        </OutsideClickHandler>
    )
}