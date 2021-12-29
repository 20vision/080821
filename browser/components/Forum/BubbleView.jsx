import styles from '../../styles/forumLayout/view_bubble.module.css'

export default function BubbleView({message, setEditBubbleIndex}){
    return(
        <div className={styles.container} onClick={() => setEditBubbleIndex()}>
            {message}
        </div>
    )
}