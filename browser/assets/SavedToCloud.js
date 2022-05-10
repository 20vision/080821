import React from 'react'

export default function SavedToCloud( {color} ) {
    return (
        <svg width="24" height="24" fill="none" stroke={color?color:"#444"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        <polyline transform="translate(-8.1158 7.9729)" points="17 11 19 13 23 9"/>
        </svg>
    )
}
