export default function User( {color, backgroundColor} ) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
        style={{ 
            backgroundColor: backgroundColor?backgroundColor:'#FAFAFA',
            padding: '10px',
            borderRadius: '100%'
        }}
        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color?color:"#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )
}
