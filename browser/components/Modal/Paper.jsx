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
import { toast } from 'react-toastify';
import axios from 'axios'

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
    const [base64Image, setBase64Image] = useState()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    let pond = useRef()

    return(
        <div className={styles.editContainer}>
            <FilePond
                ref={(ref) => (pond = ref)}
                acceptedFileTypes= {['image/png', 'image/jpeg']}
                name="filepond"
                imageEditorInstantEdit={true}
                allowMultiple={false}
                instantUpload={false}
                allowProcess={false}
                onupdatefiles = {(item) => {
                    console.log(item[0])
                    // if (err) {
                    //     toast.error('An error occurred')
                    //     console.warn(err);
                    //     return;
                    // }
                    console.log(item[0].getFileEncodeBase64String())
                    setBase64Image(item[0].getFileEncodeBase64String())
                }}
                // onupdatefiles={(files, err) => {
                //     console.log('update')
                //     // if (err) {
                //     //     toast.error('An error occurred')
                //     //     console.warn(err);
                //     //     return;
                //     // }
                //     // console.log('changed')
                //     // console.log(files[0].getFileEncodeBase64String())
                //     // setBase64Image(files[0].getFileEncodeBase64String())
                // }}
                // imageEditorAfterWriteImage={(res) => {
                //     console.log(res.dest.getFileEncodeBase64String())
                //     return res.dest;
                // }}
                /*onaddfile= {(err, item) => {
                    console.log(item)
                    if (err) {
                        toast.error('An error occurred')
                        console.warn(err);
                        return;
                    }
                    console.log(item.getFileEncodeBase64String())
                    setBase64Image(item.getFileEncodeBase64String())
                }}*/
                /*server={{
                    url: 'http://localhost:4000/post/paper_image',
                    process: {
                        url: `/process${
                            !isNaN(parseInt(router.query.paper_uid))
                            ?
                                `?paper_uid=${router.query.paper_uid}&mission_title=${router.query.mission}&page_name=${router.query.page}`
                            :
                                `?mission_title=${router.query.mission}&page_name=${router.query.page}`
                        }`,
                        onload: (response) => {
                            if(JSON.parse(response).paper_uid){
                                router.push(`/${router.query.page}/${router.query.mission}/${JSON.parse(response).paper_uid}/edit`, undefined, {shallow: true})
                            }
                            return JSON.parse(response).url
                        },
                        withCredentials: true
                    }
                }}*/
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
                <input className={styles.header} maxLength="100" placeholder="Header" onChange={e => {e.target.value = e.target.value.replace(/_/g, ' ');; setHeader(e.target.value);}}/>
                <div className={styles.body}>
                    <TextareaAutosize 
                        minRows={6}
                        placeholder="Sub-/Paper  - What did you do that brings you closer to you Vision. Your products, services or results."
                        onChange={e => {setBody(e.target.value);}}
                    />
                </div>
            </div>

            <div onClick={async() => {
                const base64Image = pond.getFile().getFileEncodeDataURL()
                try{
                    setLoading(true)
                    const response = await axios.post(`http://localhost:4000/post/paper`,{image: base64Image, header: header, body: body},{withCredentials: true})
                    setLoading(false)
                }catch(err){
                    console.log(err)
                    setLoading(false)
                    if(err.response.status && (err.response.status != 500)) return toast.error(err.response.data)
                    toast.error('An error occurred')
                }
            }}className={styles.button}>
                <h2>
                    Publish
                </h2>
            </div>

        </div>
    )
}


/*export default function Paper(){
    return(
        <div style={{width: '600px'}}>
            <div>

            </div>
        </div>
    )
}*/
