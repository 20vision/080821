export default function Check({color, size}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"24"} height={size?size:"24"} viewBox="0 0 24 24" fill="none" stroke={color?color:"#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
}
