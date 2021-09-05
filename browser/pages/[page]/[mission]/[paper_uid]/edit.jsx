import PaperEditLayout from '../../../../layouts/paperEdit'
import {useQuery} from 'react-query' 
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import styles from '../../../../styles/paperEditLayout/edit.module.css'

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import FilePondPluginImageEditor from 'filepond-plugin-image-editor';

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


export default function edit() {
    const router = useRouter()
    const [papers, setPapers] = useState()

    const page = useQuery(
        `page/${router.query.page}`,
        async () => {
            const res = await axios.get(`http://localhost:4000/get/page/${router.query.page}?missions=false&role=0`,{withCredentials: true})
            return res.data.page
        },
        {
            enabled: router.isReady,
            refetchOnWindowFocus: false,
            refetchOnmount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 1000 * 60 * 60 * 24,
            onError: (error) => {
                if(error.response.status == '403'){
                    router.push(`/${router.query.page}`)
                }else{
                    console.error(error)
                }
            }
        }
    )

    return (
        <>
        {page.data?
            <PaperEditLayout page={page.data}>
                <Edit/>
            </PaperEditLayout>
        :
            null
        }
        </>
    )
}

function Edit(){
    const [header, setHeader] = useState('')
    const [body, setBody] = useState('')
    const router = useRouter()
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
                                `?paper_uid=${router.query.paper_uid}`
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
