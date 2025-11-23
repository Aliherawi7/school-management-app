import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/modal/Modal';
import { Time } from '../../Types/Types';
import { addTime, deleteTime, getTimes } from '../../Utils/DBService';
import ICONS from '../../constants/Icons';
import BtnTypes from '../../constants/BtnTypes';

const DailyTimes = () => {
    const [times, settimes] = useState<Time[]>([]);
    const [showModal, setshowModal] = useState(false);
    const [dailyTime, setdailyTime] = useState<Time>({
        startTime: '',
        endTime: '',
    })


    useEffect(() => {
        getTimes()
            .then(res => settimes(res))
            .catch(err => console.log(err))
    }, [])

    const handleSave = () => {
        if (dailyTime.startTime && dailyTime.endTime) {
            addTime(dailyTime)
                .then(res => {
                    settimes([...times, res])
                    toast.success(t('successfullyAdded'))
                    setshowModal(false);
                }).catch(err => {
                    console.log(err);
                    toast.error(t('operationFailed'))
                })
            return;
        }
        toast.error(t('fillTheBoxed'))

    }
    return (
        <div>
            <Button
                text={t('add')}
                onClick={() => setshowModal(true)}
            />
            <Modal show={showModal} modalClose={() => setshowModal(false)}>
                <div className='display_flex flex_direction_column align_items_center'>
                    <p className='title'>{t('add')} {t('time')}</p>
                    <div className='display_flex margin_top_20 margin_bottom_10'>
                        <div className='margin_10'>
                            <label htmlFor="">{t('startTime')}: </label>
                            <input
                                type="time"
                                value={dailyTime.startTime}
                                onChange={e => setdailyTime({ ...dailyTime, startTime: e.target.value })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('endTime')}: </label>
                            <input
                                type="time"
                                value={dailyTime.endTime}
                                onChange={e => setdailyTime({ ...dailyTime, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button
                        text={t('save')}
                        onClick={handleSave}
                    />
                </div>
            </Modal>

            <table className='custom_table full_width margin_top_20'>
                <thead>
                    <tr>
                        <th colSpan={4}>{t('dailyTimes')}</th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>{t('startTime')}</th>
                        <th>{t('endTime')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {times.map((item, index) => {
                        return <tr>
                            <td>{index + 1}</td>
                            <td>{item.startTime}</td>
                            <td>{item.endTime}</td>
                            <td>
                                <div className='display_flex justify_content_center'>
                                    <Button
                                        icon={ICONS.pencil}
                                        btnType={BtnTypes.success}
                                        onClick={() => {
                                            setdailyTime(item)
                                            setshowModal(true)
                                        }}
                                    />
                                    <Button
                                        icon={ICONS.trashFill}
                                        btnType={BtnTypes.danger}
                                        onClick={() => {
                                            deleteTime(item)
                                        }}
                                    />
                                </div>

                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default DailyTimes