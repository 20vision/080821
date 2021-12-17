import { useState } from "react"
import styles from "../../styles/forumLayout/bubble.module.css"
import TextareaAutosize from 'react-textarea-autosize';

export default function Bubble({content}){
    const [inputActive, setInputActive] = useState(false)

    return(
        <div className={styles.container}>
            <div onClick={()=> setInputActive(true)} className={styles.child} style={{backgroundColor: (content && content.hex_color)?content.hex_color:'#D2D1D1'}}>
                {inputActive?
                    <Input/>
                :
                    <View/>
                }
            </div>
            <div className={styles.triangle} style={{borderTop: `25px solid ${(content && content.hex_color)?content.hex_color:'#D2D1D1'}`}}/>
        </div>
    )
}

function Input(){
    const [post, setPost] = useState()
    return(
        <div className={styles.textareaContainer}>
            <TextareaAutosize 
                minRows={6}
                ref={post}
                placeholder="Add Constructive feedback..."
                onChange={e => {setPost(e.target.value);}}
            />
            <div>

            </div>
        </div>
    )
}

function View(){
    return(
        <div>

        </div>
    )
}