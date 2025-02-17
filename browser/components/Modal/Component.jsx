import { useState, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../styles/component/editModal.module.css'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import FilePondPluginImageEditor from 'filepond-plugin-image-editor';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../../assets/Loading/Loading'
import { useModalStore } from '../../store/modal'
//import Dragable from '../User/Dragable/Dragable'
import config from '../../public/config.json'

registerPlugin(FilePondPluginFileEncode, FilePondPluginFileValidateType, FilePondPluginFilePoster, FilePondPluginImageEditor)

import {
    openEditor,
    processImage,
    createDefaultImageReader,
    createDefaultImageWriter,

    legacyDataToImageState,

    // Import the editor default configuration
    setPlugins,

    plugin_crop,
    plugin_finetune,
    plugin_annotate,
    plugin_sticker,

    locale_en_gb,
    plugin_crop_locale_en_gb,
    plugin_finetune_locale_en_gb,
    plugin_annotate_locale_en_gb,
    plugin_sticker_locale_en_gb,

    markup_editor_locale_en_gb,

    // Import the default configuration for the markup editor and finetune plugins
    markup_editor_defaults,
    plugin_finetune_defaults,

} from 'pintura'
//import Checkbox from '../User/Checkbox/Checkbox';

setPlugins(plugin_crop, plugin_finetune, plugin_annotate, plugin_sticker);

export default function Edit(){
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')
    const [imageExists, setImageExists] = useState(false)
    const [base64Image, setBase64Image] = useState()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('r')
    // const [selectedComponents, setSelectedComponents] = useState()
    // const [components, setComponents] = useState([
    //     {id:0, uid: 'ds1212af', content: 'okk'},
    //     {id:1, uid: 'ds5435af', content: 'okkasf'},
    //     {id:2, uid: 'dsa434f', content: 'okkdsafsda'},
    //     {id:3, uid: 'dsaf12213', content: 'okkadsfasdfsad'},
    //     {id:4, uid: 'dsaf32', content: 'okkadfasdfdasfdas'}
    // ])
    const setModal = useModalStore(state => state.setModal)
    const router = useRouter()
    let pond = useRef()

    return(
        <div className={styles.parentContainer}>
            <div className={`noselect ${styles.nav}`}>
                <h1 onClick={() => setType('r')} style={{marginRight: '10px'}} className={`${type == 'r'?styles.highlightR:null}`}>
                    Result
                </h1>
                <h1 onClick={() => setType('p')} style={{marginLeft: '10px'}} className={`${type == 'p'?styles.highlightP:null}`}>
                    Product
                </h1>
                <h1 onClick={() => setType('s')} style={{marginRight: '10px'}} className={`${type == 's'?styles.highlightS:null}`}>
                    Service
                </h1>
            </div>

            <div className={styles.editContainer}>
                <FilePond
                    ref={(ref) => (pond = ref)}
                    acceptedFileTypes= {['image/png', 'image/jpeg']}
                    name="filepond"
                    className={styles.filepond}
                    imageEditorInstantEdit={true}
                    allowMultiple={false}
                    instantUpload={false}
                    allowProcess={false}
                    onaddfile={(err, file) => {
                        if(err){
                            return console.log((error && error.response)?error.response:error)
                        }
                        setImageExists(true)
                    }}
                    onremovefile={(err, file) => {
                        setImageExists(false)
                    }}
                    labelIdle={
                        `<div>
                            Drag & Drop your files or <span class="filepond--label-action">Browse</span>
                        </div>
                        <div class="smalltext">
                            A picture is worth a thousand words
                        </div>`
                    }
                    imageEditor={{
                        legacyDataToImageState: legacyDataToImageState,
                        createEditor: openEditor,
                        imageReader: [
                            createDefaultImageReader
                        ],
                        imageWriter: [
                            createDefaultImageWriter,
                            {
                                canvasMemoryLimit: 4096 * 4096,
                                targetSize: {
                                    width: 512,
                                    height: 512,
                                },
                            },
                        ],
                        imageProcessor: processImage,
                        editorOptions: {
                            ...markup_editor_defaults,

                            // The finetune util controls
                            ...plugin_finetune_defaults,

                            imageCropAspectRatio: 1,
                            cropAutoCenterImageSelectionTimeout: 1,
                            
                            class: 'ignore_click_outside_page ignore_click_outside_modal',

                            locale: {
                                ...locale_en_gb,
                                ...plugin_crop_locale_en_gb,
                                ...plugin_finetune_locale_en_gb,
                                ...plugin_annotate_locale_en_gb,
                                ...markup_editor_locale_en_gb,
                                ...plugin_sticker_locale_en_gb
                            },
                        },
                    }}
                />

                <div className={`areaLine ${styles.text}`}>
                    <input disabled={loading} className={styles.header} maxLength="100" placeholder="Header" onChange={e => {e.target.value = e.target.value.replace(/_/g, ' ');; setHeader(e.target.value);}}/>
                    <div className={styles.body}>
                        <TextareaAutosize 
                            disabled={loading}
                            style={{overflow: 'auto'}}
                            minRows={6}
                            placeholder="Component - What did or do you do that brings you closer towards achieving your Mission ?"
                            onChange={e => {setBody(e.target.value);}}
                        />
                    </div>
                    <div className={`${styles.maxTextLength} ${((500-body.length) < 0)?styles.highlight:null}`}>
                        {500 - body.length}
                    </div>
                </div>

            </div>

            <div onClick={async() => {
                if(!pond.getFile()) return toast.error('Image not found')
                const base64Image = pond.getFile().getFileEncodeDataURL()
                try{
                    setLoading(true)
                    const response = await axios.post(`${config.HTTP_SERVER_URL}/post/component`,{
                        image: base64Image, 
                        type: type,
                        header: header, 
                        body: body, 
                        pagename: router.query.page,
                        mission: router.query.mission,
                        uid: router.query.component
                    },{withCredentials: true})

                    router.reload(window.location.pathname)
                }catch(err){
                    console.log((err && err.response)?err.response:err)
                    setLoading(false)
                    if(err && err.response && err.response.status && (err.response.status != 500)) return toast.error(err.response.data)
                    toast.error('An error occurred')
                }
            }} 
            style={{backgroundColor: type=='p'?'var(--blue)':type=='s'?'var(--yellow)':'var(--green)'}}
            className={`${styles.button}
            ${(
                loading || 
                (body.length > 500) ||
                (body.length < 5) ||
                (header.length > 100) ||
                (header.length < 3) ||
                (!imageExists)
            )?'no_click':null}`}>
                {loading == false?
                    <h2>
                        Publish
                    </h2>
                :    
                    <Loading/>
                }
            </div>
        </div>
    )
}