import "./LoadingTemplate.css"

import React from 'react'

function AvatarLoadingTemplate({ size = "medium", style = {} }) {
    return (
        <div className={'loading-template animate-translate avatar ' + size} style={style}></div>
    )
}

export default AvatarLoadingTemplate