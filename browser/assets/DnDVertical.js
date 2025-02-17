export default function DnDVertical({color}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color?color:'#444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
            <circle cx="20" cy="12" r="1"></circle>
            <circle cx="20" cy="5" r="1"></circle>
            <circle cx="20" cy="19" r="1"></circle>
        </svg>
    )
}