export default function arrowDown( {color, direction, size, strokeWidth} ) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"24"} height={size?size:"24"} viewBox="0 0 24 24" fill="none" stroke={color?color:'#444'} strokeWidth={strokeWidth?strokeWidth:"2"} style={{ transform: direction?('rotate('+direction+'deg)'):null}} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
    )
}
