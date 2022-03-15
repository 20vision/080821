import { useState, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../styles/paperEditLayout/edit.module.css'
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
import Dragable from '../User/Dragable/Dragable'

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

setPlugins(plugin_crop, plugin_finetune, plugin_annotate, plugin_sticker);

export default function Edit(){
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')
    const [imageExists, setImageExists] = useState(false)
    const [base64Image, setBase64Image] = useState()
    const [loading, setLoading] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState(0)
    const [papers, setPapers] = useState([
        {id:0, name: 'okk'},
        {id:1, name: 'okkasf'},
        {id:2, name: 'okkdsafsda'},
        {id:3, name: 'okkadsfasdfsad'},
        {id:4, name: 'okkadfasdfdasfdas'}
    ])
    const setModal = useModalStore(state => state.setModal)
    const router = useRouter()
    let pond = useRef()

    return(
        <div className={styles.parentContainer}>
            <div className={`noselect ${styles.nav}`}>
                <h1 onClick={() => setSelectedRoute(0)} style={{marginLeft: '10px'}} className={`${selectedRoute == 0?styles.highlight:null}`}>
                    Component
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} style={{marginRight: '10px'}} className={`${selectedRoute == 1?styles.highlight:null}`}>
                    Sub-Components
                </h1>
                {/* <h1 onClick={() => setSelectedRoute(2)} style={{marginLeft: '10px'}} className={`${selectedRoute == 2?styles.highlight:null}`}>
                    %
                </h1> */}
            </div>
            {(selectedRoute == 0)?
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
                                return console.log(error)
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
                                placeholder="Paper - What did or do you do that brings you closer towards achieving your Mission ? (products, services or results)"
                                onChange={e => {setBody(e.target.value);}}
                            />
                        </div>
                        <div className={`${styles.maxTextLength} ${((500-body.length) < 0)?styles.highlight:null}`}>
                            {500 - body.length}
                        </div>
                    </div>

                </div>
            :
                <div className={styles.subComp}>
                    <Dragable/>
                </div>
            }
            <div onClick={async() => {
                if(!pond.getFile()) return toast.error('Image not found')
                const base64Image = pond.getFile().getFileEncodeDataURL()
                try{
                    setLoading(true)
                    const response = await axios.post(`http://localhost:4000/post/paper`,{
                        image: base64Image, 
                        header: header, 
                        body: body, 
                        pagename: router.query.page,
                        mission: router.query.mission
                    },{withCredentials: true})
                    setModal(0)
                }catch(err){
                    console.log(err)
                    setLoading(false)
                    if(err.response.status && (err.response.status != 500)) return toast.error(err.response.data)
                    toast.error('An error occurred')
                }
            }} className={`${styles.button} ${(
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