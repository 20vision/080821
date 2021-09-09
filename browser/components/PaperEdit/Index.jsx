import { useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../styles/paperEditLayout/edit.module.css'
import { useRouter } from 'next/router'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import FilePondPluginImageEditor from 'filepond-plugin-image-editor';
import usePaperSocket from '../../hooks/Socket/usePaperSocket'

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFilePoster, FilePondPluginImageEditor)

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
    const router = useRouter()
    const socket = usePaperSocket()

    useEffect(() => {
        if(socket){
            socket.on('connect', msg => {
                console.log('hello world')
            })
        }
    }, [socket])

    return(
        <div className={styles.editContainer}>
            <FilePond
                acceptedFileTypes= {['image/png', 'image/jpeg']}
                name="filepond"
                imageEditorInstantEdit={true}
                allowMultiple={false}
                server={{
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
                    },
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
                        
                        class: 'ignore_click_outside_paper-image_modal',

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
                <input className={styles.header} maxLength="100" placeholder="Header" onChange={e => {e.target.value = e.target.value.replace('_', ' '); setHeader(e.target.value);}}/>
                <div className={styles.body}>
                    <TextareaAutosize 
                        minRows={6}
                        placeholder="Sub-/Paper  - What did you do that brings you closer to you Vision. Your products, services or results."
                        onChange={e => {setBody(e.target.value);}}
                    />
                </div>
            </div>
        </div>
    )
}