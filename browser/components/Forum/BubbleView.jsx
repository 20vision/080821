import styles from '../../styles/forumLayout/view_bubble.module.css'
import Heart from '../../assets/Heart'
import { useRef, useState, useEffect } from 'react'

export default function BubbleView({message, mylike, setLike, onClickReply, inFront}){
    const bubbleRef = useRef()
    const [isMyLike, setIsMyLike] = useState(false)

    useEffect(() => {
        if(mylike == 1){
            setIsMyLike(true)
        }else{
            setIsMyLike(false)
        }
    }, [mylike])

    return(
        <div className={styles.container} onClick={async evt => {
            if(!inFront) return
            if (bubbleRef.current && !bubbleRef.current.contains(evt.target)){
                onClickReply()
            }else{
                try{
                    setIsMyLike(!isMyLike)
                    await setLike()
                }catch(err){
                    setIsMyLike(isMyLike)
                }
            }
        }}>
            <div style={{minWidth: 0, wordWrap: 'break-word'}}>
                {inFront?message:''}
            </div>
            <div style={{height: 18, marginTop: 20}}>
                <div ref={bubbleRef} style={{float: 'right'}}>
                    <Heart color={(isMyLike == true)?'#FF5B77':null}/>
                </div>
            </div>
        </div>
    )
}