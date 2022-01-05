import styles from '../../styles/forumLayout/view_bubble.module.css'
import Heart from '../../assets/Heart'
import { useRef, useState, useEffect } from 'react'

export default function BubbleView({message, mylike, isReplyActive, setLike}){
    const bubbleRef = useRef()
    const [isMyLike, setIsMyLike] = useState(false)
    useEffect(() => {
        if(mylike){
            setIsMyLike(true)
        }
    }, [mylike])
    return(
        <div className={styles.container} onClick={async evt => {
            if (bubbleRef.current && !bubbleRef.current.contains(evt.target)){
                isReplyActive()
            }else{
                try{
                    setIsMyLike(!isMyLike)
                    await setLike()
                }catch(err){
                    setIsMyLike(isMyLike)
                }
            }
        }}>
            <div>
                {message}
            </div>
            <a ref={bubbleRef}><Heart color={isMyLike?'#FF5B77':null}/></a>
        </div>
    )
}