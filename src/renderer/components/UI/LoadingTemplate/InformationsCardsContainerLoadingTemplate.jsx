import InformationCardLoadingTemplate from './InformationCardLoadingTemplate'
import LoadingTemplateContainer from './LoadingTemplateContainer'
import React from 'react'

function InformationsCardsContainerLoadingTemplate() {
    return (
        <LoadingTemplateContainer className="display_flex justify_content_center">
            <InformationCardLoadingTemplate />
            <InformationCardLoadingTemplate />
            <InformationCardLoadingTemplate />
            <InformationCardLoadingTemplate />
        </LoadingTemplateContainer>
    )
}

export default InformationsCardsContainerLoadingTemplate