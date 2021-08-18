import indexStyles from '../../styles/modal/index.module.css'
import styles from '../../styles/modal/addPage.module.css'
import Loading from '../../assets/Loading/Loading'
import axios from 'axios'
import { useState, useEffect } from 'react'
import usePagenameValidation from '../../hooks/Page/usePagenameValidation'
import TextareaAutosize from 'react-textarea-autosize';

export default function AddPage() {
    const [selectedRoute, setSelectedRoute] = useState(1)

    return (
        
        <div>
            <div className={indexStyles.header}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?indexStyles.highlight:null}>
                    Create
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?indexStyles.highlight:null}>
                    My Pages
                </h1>
                <h1 onClick={() => setSelectedRoute(2)} className={selectedRoute == 2?indexStyles.highlight:null}>
                    Invites
                </h1>
            </div>
            
            <div className={styles.contentContainer}>
                {selectedRoute == 0?
                    <Create/>
                :selectedRoute == 1?
                    <My_Pages/> 
                :
                    <Invites/>
                }
            </div>
        </div>

    )
}

function Create(){
    const [setNewPagename, pagename, pagenameError, validPagenameLoading] = usePagenameValidation()
    const [vision, setVision] = useState('')
    const [error, setError] = useState('')
    const [valid, setValid] = useState(false)

    function createPage(){
        axios.post('http://localhost:4000/post/create_page',{pagename: pagename, vision: vision},{
        withCredentials: true
        }).then(response => {
            console.log('success!!')
        })
        .catch(error =>{
            setError(error.response.data)
        })
    }

    useEffect(() => {
        if(pagename && (vision.length >= 4) && (vision.length <= 500)){
            setValid(true)
        }else{
            setValid(false)
        }
    }, [pagename, vision])

    return(
        <div className={styles.createContainer}>

            <div className={`areaLine ${styles.contentArea}`}>
                <div className={`${styles.pagenameContainer}`}>
                    <h2>/</h2><input placeholder="Pagename" onChange={e => setNewPagename(e.target.value)}/>
                </div>
                <div className={`${styles.visionContainer}`}>
                    <TextareaAutosize 
                    placeholder="Vision - Why do you do what you do ?" 
                    onChange={e => setVision(e.target.value)}/>
                </div>
            </div>

            <div className={`${(vision.length > 500)?styles.invalidVision:null} ${styles.visionCount}`}>{500 - vision.length}</div>
            
            {error || pagenameError ? <div className={styles.errorMsg}>{error}<br/>{pagenameError}</div>:null}

            <a onClick={createPage} className={`${styles.createPageButton} ${!valid?styles.invalidButton:null}`}>
                {!validPagenameLoading?
                    <div>
                        <h2>Create Page</h2>
                    </div>
                :
                    <Loading/>
                }
            </a>

        </div>
    )
}

function My_Pages(){
    return(
        <div>
            My Pages
        </div>
    )
}

function Invites(){
    return(
        <div>
            Invites
        </div>
    )
}