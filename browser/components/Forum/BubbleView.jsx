import styles from '../../styles/forumLayout/view_bubble.module.css'
import Heart from '../../assets/Heart'
import { useRef, useState, useEffect } from 'react'

export default function BubbleView({message, setEditBubbleIndex, like, setLike}){
    const bubbleRef = useRef()
    const [isLike, setIsLike] = useState(false)
    useEffect(() => {
        console.log(like)
        if(like){
            setIsLike(true)
        }
    }, [like])
    return(
        <div className={styles.container} onClick={async evt => {
            if (bubbleRef.current && !bubbleRef.current.contains(evt.target)){
                setEditBubbleIndex()
            }else{
                try{
                    setIsLike(!isLike)
                    await setLike()
                }catch(err){
                    setIsLike(isLike)
                }
            }
        }}>
            <div>
                {message}
            </div>
            <a ref={bubbleRef}><Heart color={isLike?'#FF5B77':null}/></a>
        </div>
    )
}