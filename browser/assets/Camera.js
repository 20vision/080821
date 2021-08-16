export default function camera({color, size}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"24"} height={size?size:"24"} viewBox="0 0 24 24" fill="none" stroke={color?color:'#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
    )
}
