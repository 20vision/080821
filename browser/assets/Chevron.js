export default function Chevron( {color, direction, size} ) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"28"} height={size?size:"28"} viewBox="0 0 24 24" fill="none" stroke={color?color:"#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: direction?('rotate('+direction+'deg)'):null}}><polyline points="18 15 12 9 6 15"></polyline></svg>
    )
}
