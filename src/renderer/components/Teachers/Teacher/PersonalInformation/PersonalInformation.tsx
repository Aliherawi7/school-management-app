import '../Teacher.css';

import { t } from 'i18next';
import React from 'react';

import { formatFirebaseDates } from '../../../../Utils/DateTimeUtils';
import { Teacher } from '../../../../Types/Types';

interface prop {
    data: Teacher,
    setData: Function
}
const PersonalInformation: React.FC<prop> = ({ data, setData }) => {
    // const [{ authentication },] = useStateValue()


    return (
        <div className='personal_info display_flex flex_flow_wrap justify_content_center '>
            <div className='info_card  display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('name')} </span>
                <span>{data.name}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('lastName')} </span>
                <span>{data.lastName}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('phoneNumber')} </span>
                <span>{data.phoneNumber}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('resClassName')} </span>
                <span>{data?.resClassName?.name}</span>
            </div>
            <div className='info_card display_flex flex_direction_column border_1px_solid padding_10 border_radius_6 margin_5'>
                <span>{t('createdDate')} </span>
                <span>{data?.createdDate && formatFirebaseDates(data?.createdDate)}</span>
            </div>
        </div >
    )
}

export default PersonalInformation