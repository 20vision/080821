import styles from '../../styles/forumLayout/layout_bubble.module.css'
import ProfilePicture from '../User/ProfilePicture/ProfilePicture'
import disableScroll from 'disable-scroll';
import { DateTime, Interval } from "luxon";

export default function BubbleBasicLayout({children, mirror, color, profile, postDate, isReplyActive, makeScroll, isInTheBackground}){
    
    return(
        <div style={{display:'flex', minWidth: 0}}>
            <div style={{marginRight: '10px', opacity: isInTheBackground?'0':'1'}}>
                <ProfilePicture type={'small'} uri={profile.profilePicture}/>
            </div>

            <div style={{flexGrow: 1, flexShrink: 1, minWidth: 0}} className={mirror?styles.mirror:null}>
                <h3 style={{margin: '10px 0px 15px 0px', opacity: isInTheBackground?'0':'1'}} className={mirror?styles.mirror:null}>@{profile.username} {postDate?<><span>·</span> <span style={{fontSize: 14,fontWeight: '400'}}>{
                    DateTime.fromISO(postDate).toLocaleString(DateTime.DATE_MED)
                }</span></>:null}</h3>
                <div style={{display:'flex'}}>
                    <div className={styles.triangle} style={{borderTop: `25px solid ${'#'+color}`}}/>
                    <div className={styles.bubble} style={{minWidth: 0,backgroundColor: '#'+color}} onWheel={info => makeScroll(info)} onMouseEnter={e => disableScroll.on()} onMouseLeave={() => disableScroll.off()}>
                        <div className={mirror?styles.mirror:null}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}