import User from '../../../assets/User'

import styles from './ProfilePicture.module.css'

import BounceLoader from "react-spinners/BounceLoader";

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

export default function ProfilePicture({loading, uri, type}) {
    return (
        <>
            {
                loading ?
                    <Loading type={type}/>
                :uri?
                    <ProfileImg uri={uri} type={type}/>
                :
                    <ProfileSvg type={type}/>
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
                <BounceLoader css={'opacity: 0.2'} speedMultiplier={0.8} size={type=='large'?60:45} color="#FAFAFA"/>
            </div>
        </div>
        
    )
}

function ProfileImg({uri, type}){
    return(
        <div className={
            type=='large'?
                styles.large
            :
                styles.medium
            }>
            <img className={styles.img} src={uri}/>
        </div>
        
    )
}

function ProfileSvg({type}){
    return(
        <div className={
            type=='large'?
                styles.large
            :
                styles.medium
            }>   
            <div className={styles.svg}>
                <User size={type=='large'?'35':null}/>
            </div>
        </div>
    )
}
