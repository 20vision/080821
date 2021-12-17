import styles from "../../styles/forumLayout/bubble.module.css"

export default function Bubble({content}){

    return(
        <div className={styles.container}>
            <div className={styles.child} style={{backgroundColor: (content && content.hex_color)?content.hex_color:'#D2D1D1'}}>
                Hellow
            </div>
            <div className={styles.triangle} style={{borderTop: `25px solid ${(content && content.hex_color)?content.hex_color:'#D2D1D1'}`}}/>
        </div>
    )
}