/*!
 * Pintura Image Editor 8.25.1
 * (c) 2018-2022 PQINA Inc. - All Rights Reserved
 * License: https://pqina.nl/pintura/license/
 */
/* eslint-disable */

var FilePondPluginImageEditor = (function () {
    'use strict';

    var isFile = (v) => v instanceof File;

    var isImage = (file) => /^image/.test(file.type);

    var isString = (v) => typeof v === 'string';

    var h = (name, attributes, children = []) => {
        const el = document.createElement(name);
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(el.__proto__);
        for (const key in attributes) {
            if (key === 'style') {
                el.style.cssText = attributes[key];
            }
            else if ((descriptors[key] && descriptors[key].set) ||
                /textContent|innerHTML/.test(key) ||
                typeof attributes[key] === 'function') {
                el[key] = attributes[key];
            }
            else {
                el.setAttribute(key, attributes[key]);
            }
        }
        children.forEach((child) => el.appendChild(child));
        return el;
    };

    let result$4 = null;
    var isBrowser = () => {
        if (result$4 === null)
            result$4 = typeof window !== 'undefined' && typeof window.document !== 'undefined';
        return result$4;
    };

    // @ts-ignore
    const supportsReplaceChildren = isBrowser() && !!Node.prototype.replaceChildren;
    const fn = supportsReplaceChildren
        ? // @ts-ignore
            (parent, newChildren) => parent.replaceChildren(newChildren)
        : (parent, newChildren) => {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
            if (newChildren !== undefined) {
                parent.append(newChildren);
            }
        };

    const container = isBrowser() &&
        h('div', {
            class: 'PinturaMeasure',
            style: 'pointer-events:none;left:0;top:0;width:0;height:0;contain:strict;overflow:hidden;position:absolute;',
        });
    let timeoutId;
    var appendForMeasuring = (element) => {
        // replace element children with this child
        fn(container, element);
        // append to DOM if not in it atm
        if (!container.parentNode)
            document.body.append(container);
        // auto detach from DOM after it isn't used for a little while
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            container.remove();
        }, 500);
        // return added element for measuring
        return element;
    };

    let result$3 = null;
    var isSafari = () => {
        if (result$3 === null)
            result$3 = isBrowser() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return result$3;
    };

    var getImageElementSize = (imageElement) => new Promise((resolve, reject) => {
        let shouldAutoRemove = false;
        // test if image is attached to DOM, if not attached, attach so measurement is correct on Safari
        if (!imageElement.parentNode && isSafari()) {
            shouldAutoRemove = true;
            // has width 0 and height 0 to prevent rendering very big SVGs (without width and height) that will for one frame overflow the window and show a scrollbar
            imageElement.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;`;
            appendForMeasuring(imageElement);
        }
        // start testing size
        const measure = () => {
            const width = imageElement.naturalWidth;
            const height = imageElement.naturalHeight;
            const hasSize = width && height;
            if (!hasSize)
                return;
            // clean up image if was attached for measuring
            if (shouldAutoRemove)
                imageElement.remove();
            clearInterval(intervalId);
            resolve({ width, height });
        };
        imageElement.onerror = (err) => {
            clearInterval(intervalId);
            reject(err);
        };
        const intervalId = setInterval(measure, 1);
        measure();
    });

    var getImageSize = async (image) => {
        // the image element we'll use to load the image
        let imageElement = image;
        // if is not an image element, it must be a valid image source
        if (!imageElement.src) {
            imageElement = new Image();
            imageElement.src = isString(image) ? image : URL.createObjectURL(image);
        }
        let size;
        try {
            size = await getImageElementSize(imageElement);
        }
        finally {
            isFile(image) && URL.revokeObjectURL(imageElement.src);
        }
        return size;
    };

    var isBlob = (v) => v instanceof Blob && !(v instanceof File);

    var noop = (...args) => { };

    var releaseCanvas = (canvas) => {
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx && ctx.clearRect(0, 0, 1, 1);
    };

    let result$2 = null;
    var supportsWebGL2 = () => {
        if (result$2 === null) {
            if ('WebGL2RenderingContext' in window) {
                let canvas;
                try {
                    canvas = h('canvas');
                    result$2 = !!canvas.getContext('webgl2');
                }
                catch (err) {
                    result$2 = false;
                }
                canvas && releaseCanvas(canvas);
                canvas = undefined;
            }
            else {
                result$2 = false;
            }
        }
        return result$2;
    };

    var getWebGLContext = (canvas, attrs) => {
        if (supportsWebGL2())
            return canvas.getContext('webgl2', attrs);
        return (canvas.getContext('webgl', attrs) ||
            canvas.getContext('experimental-webgl', attrs));
    };

    let result$1 = null;
    var supportsWebGL = () => {
        if (result$1 === null) {
            let canvas = h('canvas');
            result$1 = !!getWebGLContext(canvas);
            releaseCanvas(canvas);
            canvas = undefined;
        }
        return result$1;
    };

    const isOperaMini = () => Object.prototype.toString.call(window['operamini']) === '[object OperaMini]';
    const hasPromises = () => 'Promise' in window;
    const hasCreateObjectURL = () => 'URL' in window && 'createObjectURL' in window.URL;
    const hasVisibility = () => 'visibilityState' in document;
    const hasTiming = () => 'performance' in window; // iOS 8.x
    const hasFileConstructor = () => 'File' in window; // excludes IE11
    let result = null;
    var isModernBrowser = () => {
        if (result === null)
            result =
                isBrowser() &&
                    // Can't run on Opera Mini due to lack of everything
                    !isOperaMini() &&
                    // Require these APIs to feature detect a modern browser
                    hasVisibility() &&
                    hasPromises() &&
                    hasFileConstructor() &&
                    hasCreateObjectURL() &&
                    hasTiming();
        return result;
    };

    /**
     * Image Edit Proxy Plugin
     */
    const plugin = (_) => {
        const { addFilter, utils, views } = _;
        const { Type, createRoute } = utils;
        const { fileActionButton } = views;
        const createQueue = ({ parallel = 1, autoShift = true }) => {
            const queue = [];
            let jobs = 0;
            const next = () => {
                // done
                if (!queue.length)
                    return api.oncomplete();
                // get next item
                jobs++;
                const job = queue.shift();
                // run
                job(() => {
                    jobs--;
                    // pick up next item
                    if (jobs < parallel)
                        runJobs();
                });
            };
            const runJobs = () => {
                for (let i = 0; i < parallel - jobs; i++) {
                    next();
                }
            };
            const api = {
                queue: (cb) => {
                    // queue job
                    queue.push(cb);
                    // run item immidiately
                    autoShift && runJobs();
                },
                runJobs,
                oncomplete: () => { },
            };
            return api;
        };
        const renderQueue = createQueue({ parallel: 1 });
        const getEditorSafe = (editor) => (editor === null ? {} : editor);
        addFilter('SHOULD_REMOVE_ON_REVERT', (shouldRemove, { item, query }) => new Promise((resolve) => {
            const { file } = item;
            // if this file is editable it shouldn't be removed immidiately even when instant uploading
            const canEdit = query('GET_ALLOW_IMAGE_EDITOR') &&
                query('GET_IMAGE_EDITOR_ALLOW_EDIT') &&
                query('GET_IMAGE_EDITOR_SUPPORT_EDIT') &&
                query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file);
            // if the file cannot be edited it should be removed on revert
            resolve(!canEdit);
        }));
        // open editor when loading a new item
        addFilter('DID_LOAD_ITEM', (item, { query, dispatch }) => new Promise((resolve, reject) => {
            // if is temp or local file
            if (item.origin > 1) {
                resolve(item);
                return;
            }
            // get file reference
            const { file } = item;
            if (!query('GET_ALLOW_IMAGE_EDITOR') ||
                !query('GET_IMAGE_EDITOR_INSTANT_EDIT' ))
                return resolve(item);
            // exit if this is not an image
            if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file))
                return resolve(item);
            // request editing of a file
            const requestEdit = () => {
                if (!editRequestQueue.length)
                    return;
                const { item, resolve, reject } = editRequestQueue[0];
                dispatch('EDIT_ITEM', {
                    id: item.id,
                    handleEditorResponse: createEditorResponseHandler(item, resolve, reject),
                });
            };
            // is called when the user confirms editing the file
            const createEditorResponseHandler = (item, resolve, reject) => (userDidConfirm) => {
                // remove item
                editRequestQueue.shift();
                // handle item
                if (userDidConfirm) {
                    resolve(item);
                }
                else {
                    reject(item);
                }
                // TODO: Fix, should not be needed to kick the internal loop in case no processes are running
                dispatch('KICK');
                // handle next item!
                requestEdit();
            };
            queueEditRequest({ item, resolve, reject });
            if (editRequestQueue.length === 1) {
                requestEdit();
            }
        }));
        // extend item methods
        addFilter('DID_CREATE_ITEM', (item, { query, dispatch }) => {
            item.extend('edit', () => {
                dispatch('EDIT_ITEM', { id: item.id });
            });
        });
        const editRequestQueue = [];
        const queueEditRequest = (editRequest) => {
            editRequestQueue.push(editRequest);
            return editRequest;
        };
        const couldTransformFile = (query) => {
            // no editor defined, then exit
            const { imageProcessor, imageReader, imageWriter } = getEditorSafe(query('GET_IMAGE_EDITOR'));
            return (query('GET_IMAGE_EDITOR_WRITE_IMAGE') &&
                query('GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE') &&
                imageProcessor &&
                imageReader &&
                imageWriter);
        };
        // generate preview
        const getPosterTargetSize = (query, targetSize) => {
            const posterHeight = query('GET_FILE_POSTER_HEIGHT');
            const maxPosterHeight = query('GET_FILE_POSTER_MAX_HEIGHT');
            if (posterHeight) {
                targetSize.width = posterHeight * 2;
                targetSize.height = posterHeight * 2;
            }
            else if (maxPosterHeight) {
                targetSize.width = maxPosterHeight * 2;
                targetSize.height = maxPosterHeight * 2;
            }
            return targetSize;
        };
        const createImagePoster = (query, item, done = () => { }) => {
            if (!item)
                return;
            const { imageProcessor, imageReader, imageWriter, editorOptions, imageState: imageBaseState, } = getEditorSafe(query('GET_IMAGE_EDITOR'));
            // need image processor to create image poster
            if (!imageProcessor)
                return;
            const [createImageReader, imageReaderOptions] = imageReader;
            const [createImageWriter = noop, imageWriterOptions] = imageWriter;
            const file = item.file;
            const imageState = item.getMetadata('imageState');
            const targetSize = getPosterTargetSize(query, {
                width: 512,
                height: 512,
            });
            const options = {
                ...editorOptions,
                imageReader: createImageReader(imageReaderOptions),
                imageWriter: createImageWriter({
                    // can optionally overwrite poster size
                    ...(imageWriterOptions || {}),
                    // limit memory so poster is created quicker
                    canvasMemoryLimit: targetSize.width * targetSize.height * 2,
                }),
                imageState: {
                    ...imageBaseState,
                    ...imageState,
                },
            };
            renderQueue.queue((next) => {
                imageProcessor(file, options).then(({ dest }) => {
                    item.setMetadata('poster', URL.createObjectURL(dest), true);
                    next();
                    done();
                });
            });
        };
        // called for each view that is created right after the 'create' method
        addFilter('CREATE_VIEW', (viewAPI) => {
            // get reference to created view
            const { is, view, query } = viewAPI;
            if (!query('GET_ALLOW_IMAGE_EDITOR'))
                return;
            if (!query('GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE'))
                return;
            const supportsFilePoster = query('GET_ALLOW_FILE_POSTER');
            // only run for either the file or the file info panel
            const shouldExtendView = (is('file-info') && !supportsFilePoster) || (is('file') && supportsFilePoster);
            if (!shouldExtendView)
                return;
            // no editor defined, then exit
            const { createEditor, imageReader, imageWriter, editorOptions, legacyDataToImageState, imageState: imageBaseState, } = getEditorSafe(query('GET_IMAGE_EDITOR'));
            if (!imageReader || !imageWriter || !editorOptions || !editorOptions.locale)
                return;
            // remove default image reader and writer if set
            delete editorOptions.imageReader;
            delete editorOptions.imageWriter;
            const [createImageReader, imageReaderOptions] = imageReader;
            // tests if file item has poster
            const getItemByProps = (props) => {
                const { id } = props;
                const item = query('GET_ITEM', id);
                return item;
            };
            const hasPoster = (props) => {
                if (!query('GET_ALLOW_FILE_POSTER'))
                    return false;
                const item = getItemByProps(props);
                if (!item)
                    return;
                // test if is filtered
                if (!query('GET_FILE_POSTER_FILTER_ITEM')(item))
                    return false;
                const poster = item.getMetadata('poster');
                return !!poster;
            };
            // opens the editor, if it does not already exist, it creates the editor
            const openImageEditor = ({ root, props, action }) => {
                const { handleEditorResponse } = action;
                // get item
                const item = getItemByProps(props);
                // file to open
                const file = item.file;
                // open the editor (sets editor properties and imageState property)
                const editor = createEditor({
                    ...editorOptions,
                    imageReader: createImageReader(imageReaderOptions),
                    src: file,
                });
                // when the image has loaded, update the editor
                editor.on('load', ({ size }) => {
                    // get current image edit state
                    let imageState = item.getMetadata('imageState');
                    imageState = legacyDataToImageState
                        ? legacyDataToImageState(editor, size, imageState)
                        : imageState;
                    // update editor view based on image edit state
                    editor.imageState = {
                        ...imageBaseState,
                        ...imageState,
                    };
                });
                editor.on('process', ({ imageState }) => {
                    // if already has post URL, try to revoke
                    // const poster = item.getMetadata('poster');
                    // poster && URL.revokeObjectURL(item.getMetadata('poster'));
                    // store state, two seperate actions because we want to trigger preparefile when setting `imageState`
                    // item.setMetadata('poster', URL.createObjectURL(dest));
                    item.setMetadata('imageState', imageState);
                    // used in instant edit mode
                    if (!handleEditorResponse)
                        return;
                    handleEditorResponse(true);
                });
                editor.on('close', () => {
                    // used in instant edit mode
                    if (!handleEditorResponse)
                        return;
                    handleEditorResponse(false);
                });
            };
            //#region view
            const didLoadItem = ({ root, props }) => {
                const { id } = props;
                // try to access item
                const item = query('GET_ITEM', id);
                if (!item)
                    return;
                // get the file object
                const file = item.file;
                // exit if this is not an image
                if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file))
                    return;
                if (query('GET_ALLOW_FILE_POSTER') && !item.getMetadata('poster')) {
                    root.dispatch('REQUEST_CREATE_IMAGE_POSTER', { id });
                }
                if (!query('GET_IMAGE_EDITOR_ALLOW_EDIT') || !query('GET_IMAGE_EDITOR_SUPPORT_EDIT'))
                    return;
                // draw edit button next to file name
                updateEditButton(root, props);
            };
            const updateEditButton = (root, props) => {
                // handle interactions
                if (!root.ref.handleEdit) {
                    root.ref.handleEdit = (e) => {
                        e.stopPropagation();
                        root.dispatch('EDIT_ITEM', { id: props.id });
                    };
                }
                if (hasPoster(props)) {
                    // remove current editButton
                    if (root.ref.editButton && root.ref.editButton.parentNode) {
                        root.ref.editButton.parentNode.removeChild(root.ref.editButton);
                    }
                    // add edit button to preview
                    const buttonView = view.createChildView(fileActionButton, {
                        label: 'edit',
                        icon: query('GET_IMAGE_EDITOR_ICON_EDIT'),
                        opacity: 0,
                    });
                    // edit item classname
                    buttonView.element.classList.add('filepond--action-edit-item');
                    buttonView.element.dataset.align = query('GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION');
                    buttonView.on('click', root.ref.handleEdit);
                    root.ref.buttonEditItem = view.appendChildView(buttonView);
                }
                // no poster
                else {
                    // remove current button
                    if (root.ref.buttonEditItem) {
                        root.removeChildView(root.ref.buttonEditItem);
                    }
                    // view is file info
                    const filenameElement = view.element.querySelector('.filepond--file-info-main');
                    const editButton = document.createElement('button');
                    editButton.className = 'filepond--action-edit-item-alt';
                    editButton.innerHTML = query('GET_IMAGE_EDITOR_ICON_EDIT') + '<span>edit</span>';
                    editButton.addEventListener('click', root.ref.handleEdit);
                    filenameElement.appendChild(editButton);
                    root.ref.editButton = editButton;
                }
            };
            //#endregion
            const didUpdateItemMetadata = ({ root, props, action }) => {
                // handle image state updates
                if (/imageState/.test(action.change.key) && query('GET_ALLOW_FILE_POSTER'))
                    return root.dispatch('REQUEST_CREATE_IMAGE_POSTER', { id: props.id });
                // no change to poster, skip
                if (!/poster/.test(action.change.key))
                    return;
                // no editor allowed so no need to show the button
                if (!query('GET_IMAGE_EDITOR_ALLOW_EDIT') || !query('GET_IMAGE_EDITOR_SUPPORT_EDIT'))
                    return;
                updateEditButton(root, props);
            };
            view.registerDestroyer(({ root }) => {
                if (root.ref.buttonEditItem) {
                    root.ref.buttonEditItem.off('click', root.ref.handleEdit);
                }
                if (root.ref.editButton) {
                    root.ref.editButton.removeEventListener('click', root.ref.handleEdit);
                }
            });
            const routes = {
                EDIT_ITEM: openImageEditor,
                DID_LOAD_ITEM: didLoadItem,
                DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
                DID_REMOVE_ITEM: ({ props }) => {
                    const { id } = props;
                    const item = query('GET_ITEM', id);
                    if (!item)
                        return;
                    const poster = item.getMetadata('poster');
                    poster && URL.revokeObjectURL(poster);
                },
                REQUEST_CREATE_IMAGE_POSTER: ({ root, props }) => createImagePoster(root.query, getItemByProps(props)),
                DID_FILE_POSTER_LOAD: undefined,
            };
            if (supportsFilePoster) {
                // view is file
                const didPosterUpdate = ({ root }) => {
                    if (!root.ref.buttonEditItem)
                        return;
                    root.ref.buttonEditItem.opacity = 1;
                };
                routes.DID_FILE_POSTER_LOAD = didPosterUpdate;
            }
            // start writing
            view.registerWriter(createRoute(routes));
        });
        //#region write image
        addFilter('SHOULD_PREPARE_OUTPUT', (shouldPrepareOutput, { query, change, item }) => new Promise((resolve) => {
            if (!query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(item.file))
                return resolve(false);
            if (change && !/imageState/.test(change.key))
                return resolve(false);
            resolve(!query('IS_ASYNC'));
        }));
        const shouldTransformFile = (query, file, item) => new Promise((resolve) => {
            // invalid item
            if (!couldTransformFile(query) ||
                item.archived ||
                (!isFile(file) && !isBlob(file)) ||
                !query('GET_IMAGE_EDITOR_SUPPORT_IMAGE')(file)) {
                return resolve(false);
            }
            // if size can't be read this browser doesn't support image
            getImageSize(file)
                .then(() => {
                const fn = query('GET_IMAGE_TRANSFORM_IMAGE_FILTER');
                if (fn) {
                    const filterResult = fn(file);
                    if (typeof filterResult === 'boolean') {
                        return resolve(filterResult);
                    }
                    if (typeof filterResult.then === 'function') {
                        return filterResult.then(resolve);
                    }
                }
                resolve(true);
            })
                .catch(() => {
                resolve(false);
            });
        });
        // subscribe to file transformations
        addFilter('PREPARE_OUTPUT', (file, { query, item }) => {
            const writeOutputImage = (file) => new Promise((resolve, reject) => {
                // test if has image poster yet, if not, create poster
                const prepare = () => {
                    // queue for preparing
                    renderQueue.queue((next) => {
                        const imageState = item.getMetadata('imageState');
                        // no editor defined, then exit
                        const { imageProcessor, imageReader, imageWriter, editorOptions, imageState: imageBaseState, } = getEditorSafe(query('GET_IMAGE_EDITOR'));
                        if (!imageProcessor || !imageReader || !imageWriter || !editorOptions)
                            return;
                        const [createImageReader, imageReaderOptions] = imageReader;
                        const [createImageWriter = noop, imageWriterOptions] = imageWriter;
                        imageProcessor(file, {
                            ...editorOptions,
                            imageReader: createImageReader(imageReaderOptions),
                            imageWriter: createImageWriter(imageWriterOptions),
                            imageState: {
                                ...imageBaseState,
                                ...imageState,
                            },
                        })
                            .then(resolve)
                            .catch(reject)
                            .finally(next);
                    });
                };
                if (query('GET_ALLOW_FILE_POSTER') && !item.getMetadata('poster')) {
                    // create poster
                    createImagePoster(query, item, prepare);
                }
                else {
                    prepare();
                }
            });
            return new Promise((resolve) => {
                shouldTransformFile(query, file, item).then((shouldWrite) => {
                    if (!shouldWrite)
                        return resolve(file);
                    writeOutputImage(file).then((res) => {
                        const afterFn = query('GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE');
                        // if a function is defined
                        if (afterFn)
                            return Promise.resolve(afterFn(res)).then(resolve);
                        // @ts-ignore
                        resolve(res.dest);
                    });
                });
            });
        });
        //#endregion
        // Expose plugin options
        return {
            options: {
                // enable or disable image editing
                allowImageEditor: [true, Type.BOOLEAN],
                // open editor when image is dropped
                imageEditorInstantEdit: [false, Type.BOOLEAN],
                // allow editing
                imageEditorAllowEdit: [true, Type.BOOLEAN],
                // cannot edit if no WebGL or is <=IE11
                imageEditorSupportEdit: [
                    isBrowser() && isModernBrowser() && supportsWebGL(),
                    Type.BOOLEAN,
                ],
                // receives file and should return true if can edit
                imageEditorSupportImage: [isImage, Type.FUNCTION],
                // cannot write if is <= IE11
                imageEditorSupportWriteImage: [isModernBrowser(), Type.BOOLEAN],
                // should output image
                imageEditorWriteImage: [true, Type.BOOLEAN],
                // receives written image and can return single or more images
                imageEditorAfterWriteImage: [undefined, Type.FUNCTION],
                // editor object
                imageEditor: [null, Type.OBJECT],
                // the icon to use for the edit button
                imageEditorIconEdit: [
                    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.5 17h1.586l7-7L15.5 8.414l-7 7V17zm-1.707-2.707l8-8a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-8 8A1 1 0 0 1 10.5 19h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707z" fill="currentColor" fill-rule="nonzero"/></svg>',
                    Type.STRING,
                ],
                // location of processing button
                styleImageEditorButtonEditItemPosition: ['bottom center', Type.STRING],
            },
        };
    };
    // fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
    if (isBrowser())
        document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));

    return plugin;

}());
