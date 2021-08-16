export default function User( {color, size} ) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size?size:"24"} height={size?size:"24"} viewBox="0 0 24 24" fill="none" stroke={color?color:"#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )
}
