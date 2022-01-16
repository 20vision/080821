import styles from '../../styles/forumLayout/view_bubble.module.css'
import Heart from '../../assets/Heart'
import { useRef, useState, useEffect } from 'react'
import { useForumStore } from '../../store/forum'

export default function BubbleView({message, index, mylike, setLike}){
    const bubbleRef = useRef()
    const [isMyLike, setIsMyLike] = useState(false)
    const setReplyIndex = useForumStore(state => state.setReplyIndex)

    useEffect(() => {
        if(mylike == 1){
            setIsMyLike(true)
        }else{
            setIsMyLike(false)
        }
    }, [mylike])
    return(
        <div className={styles.container} onClick={async evt => {
            if (bubbleRef.current && !bubbleRef.current.contains(evt.target)){
                setReplyIndex(index)
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
            <a ref={bubbleRef}><Heart color={(isMyLike == true)?'#FF5B77':null}/></a>
        </div>
    )
}