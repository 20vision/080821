import User from '../../../assets/User'

import styles from '../../../styles/user/ProfilePicture.module.css'

import BounceLoader from "react-spinners/BounceLoader";
import config from '../../../public/config.json';
import PageIcon from '../../../assets/PageIcon/PageIcon'

/*
    Properties:
    loading:Boolean -> loading animation
    uri:{
        String -> img profilePicture src
        Null -> placeholder Svg
    }
    type:String{
        large: 60px
        medium: 45px(standard)
    }
*/

export default function ProfilePicture({loading, uri, type, page}) {
    return (
        <>
            {
                loading ?
                    <Loading type={type}/>
                :uri?
                    <ProfileImg uri={uri} type={type} page={page}/>
                :
                    <ProfileSvg type={type} page={page}/>
            }
        </>
    )
}


function Loading({type}){
    return(
        <div className={
            type=='large'?
                styles.large
            :
                styles.medium
            }>
            <div className={styles.loading}>
                <BounceLoader css={'opacity: 0.2'} speedMultiplier={0.8} size={type=='large'?150:45} color="#FAFAFA"/>
            </div>
        </div>
        
    )
}

function ProfileImg({uri, type, page}){
    return(
        <div className={
            type=='small'?
                styles.small
            :
            type=='large'?
                styles.large
            :
                styles.medium
            }>
            {/* LARGE STARTS AT 200 -> get downsized to 150 and medium is 48px. 400 is XL */}
            <img style={{...type=='small'?{height:'35px', width: '35px'}:null,...page?{borderRadius:35}:null}} className={styles.img} src={config.FILE_SERVER_URL+uri+(type=='large'?'200x200':'48x48')+'.webp'}/>
        </div>
        
    )
}

function ProfileSvg({type, page}){
    return(
        <div className={
            type=='small'?
                styles.small
            :
            type=='large'?
                styles.large
            :
                styles.medium
            }>   
            <div className={styles.svg} style={page?{borderRadius: 35, backgroundColor: '#'+page.page_icon}:null}>
                {page?
                    <svg xmlns="http://www.w3.org/2000/svg" width="87" height="87" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>                
                :<User size={type=='large'?'87':null}/>}
            </div>
        </div>
    )
}
