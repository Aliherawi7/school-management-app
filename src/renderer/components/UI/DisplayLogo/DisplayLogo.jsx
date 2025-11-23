import "./DisplayLogo.css"

import React, { useState } from 'react'

import AvatarLoadingTemplate from '../LoadingTemplate/AvatarLoadingTemplate'

function DisplayLogo({ imgURL, alt, width = "120px", height = "120px", className = 'margin_auto' }) {
    const [loaded, setloaded] = useState(true)
    return (
        <div className={'logo_container border_radius_50 box_shadow ' + className} style={{ width: width, height: height }}>
            {loaded && <AvatarLoadingTemplate style={{ width: width, height: height }} />}
            <img src={imgURL} alt={alt} onLoad={() => setloaded(false)} />
        </div>
    )
}

export default DisplayLogo
