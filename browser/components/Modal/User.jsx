import AvatarEditor from 'react-avatar-editor'

export default function User() {
    return (
        <AvatarEditor
            image="https://pbs.twimg.com/profile_images/1374034715041263617/mZvmvf12_400x400.jpg"
            width={250}
            height={250}
            border={50}
            borderRadius={500}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
        />
    )
}

function Profile(){
    
}
