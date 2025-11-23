import "./LoadingTemplate.css"

import React from 'react'

function ShotLoadingTemplate({ style = null }) {
    return (
        <div className='loading-template full_width animate-translate shot' style={style}></div>
    )
}

export default ShotLoadingTemplate