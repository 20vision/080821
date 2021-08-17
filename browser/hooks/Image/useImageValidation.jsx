import { useState, useEffect } from "react";

const useImageValidation = () => {
    const [image, validateImage] = useState()
    const [imageValidationError, setError] = useState('')
    const [validImage, setValidImage] = useState('')
    let reader = new FileReader()

    useEffect(() => {
        if(image){
            if (!image.name.match(/\.(jpg|jpeg|png)$/)) {
                setError('Please select a valid image.')
                setValidImage(null)
            }else{
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        setValidImage(image)
                        setError('')
                    };
                    img.onerror = () => {
                        setError('Invalid image content.')
                        setValidImage(null)
                    };
                    img.src = e.target.result;
                }
                reader.readAsDataURL(image)
            }
           
            
        }else{
            setError('')
            setValidImage(null)
        }
    }, [image])


    return [validateImage, imageValidationError, validImage]
}

export default useImageValidation