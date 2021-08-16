export default function Edit({color, size}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"24"} height={size?size:"24"} viewBox="0 0 24 24" fill="none" stroke={color?color:"#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    )
}
