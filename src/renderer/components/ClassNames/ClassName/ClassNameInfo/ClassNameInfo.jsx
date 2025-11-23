import { t } from 'i18next';
import React from 'react';

import { formatFirebaseDates } from '../../../../Utils/DateTimeUtils';
import LoadingTemplateContainer from '../../../UI/LoadingTemplate/LoadingTemplateContainer';
import ShotLoadingTemplate from '../../../UI/LoadingTemplate/ShotLoadingTemplate';


function ClassNameInfo({ data }) {

    if (!data) {
        return <LoadingTemplateContainer>
            <ShotLoadingTemplate />
        </LoadingTemplateContainer>
    }

    return (
        <div className='personal_info display_flex flex_flow_wrap justify_content_center '>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span >{t('name')} </span>
                <span>{data.name}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('number')} </span>
                <span>{data.number}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('totalHours')} </span>
                <span>{data?.totalHours}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('createdDate')} </span>
                <span>{data?.createdDate && formatFirebaseDates(data.createdDate)}</span>
            </div>

        </div>
    )
}

export default ClassNameInfo