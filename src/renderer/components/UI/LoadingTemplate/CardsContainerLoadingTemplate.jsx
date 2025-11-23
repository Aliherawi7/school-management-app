import "./LoadingTemplate.css"

import CardLoadingTemplate from './CardLoadingTemplate'
import React from 'react'

function CardsContainerLoadingTemplate() {
    return (
        <div className='display_flex flex_direction_column'>
            <div className='display_flex flex_flow_wrap justify_content_center'>
                <CardLoadingTemplate />
                <CardLoadingTemplate />
                <CardLoadingTemplate />
            </div>
            <div className='display_flex flex_flow_wrap justify_content_center'>
                <CardLoadingTemplate />
                <CardLoadingTemplate />
                <CardLoadingTemplate />
            </div>
        </div>
    )
}

export default CardsContainerLoadingTemplate