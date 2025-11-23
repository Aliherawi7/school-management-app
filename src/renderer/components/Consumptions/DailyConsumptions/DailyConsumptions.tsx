import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import BtnTypes from '../../../constants/BtnTypes';
import ICONS from '../../../constants/Icons';
import { actionTypes } from '../../../context/reducer';
import { useStateValue } from '../../../context/StateProvider';
import { Consumption, Log } from '../../../Types/Types';
import { formatFirebaseDates } from '../../../Utils/DateTimeUtils';
import { addLog, deleteConsumption, getTodayConsumptions } from '../../../Utils/DBService';
import Button from '../../UI/Button/Button';
import HeadingLoadingTemplate from '../../UI/LoadingTemplate/HeadingLoadingTemplate';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate';

const DailyConsumptions: React.FC = () => {
    const nav = useNavigate();
    const [consumptions, setConsumptions] = useState<Consumption[]>([])
    const [loading, setloading] = useState(true)
    const [{ authentication }, dispatch] = useStateValue()


    useEffect(() => {
        getTodayConsumptions()
            .then(res => {
                setConsumptions(res)
            }).finally(() => setloading(false))

    }, [])


    const totalAll = (): number => {
        let total = 0;
        consumptions.forEach(item => total += Number(item.amount))
        return total;
    }


    const showDeleteModal = (index: number) => {
        dispatch({
            type: actionTypes.SHOW_ASKING_MODAL,
            payload: {
                show: true,
                message: "deleteMessage",
                btnAction: () => deleteCons(index)
            },
        });
    };



    const deleteCons = async (index: number) => {
        dispatch({
            type: actionTypes.SET_GLOBAL_LOADING,
            payload: { value: true },
        });
        dispatch({
            type: actionTypes.HIDE_ASKING_MODAL,
        });

        deleteConsumption(consumptions[index])
            .then(res => {
                const consumption = consumptions[index];
                const log: Log = {
                    createdDate: new Date(),
                    registrar: `${authentication.name || ''} ${authentication.lastname || ''}`, // Assume you have a way to track the current user
                    title: `${t('delete')} ${t('consumptions')}`,
                    message: ` ${t('consumptions')} [${t('type')}:(${t(consumption.type)}) ${t('amount')}: (${consumption.amount})  ${t('successfullyDeleted')}`,

                    data: { ...consumptions[index] }
                };

                addLog(log);
                toast.success(t('successfullyDeleted'))
                const temp = [...consumptions];
                temp.splice(index, 1);
                setConsumptions(temp);
            })
            .catch(err => {
                toast.error(err.message)
            })
            .finally(() => {
                dispatch({
                    type: actionTypes.SET_GLOBAL_LOADING,
                    payload: { value: false },
                });
            })


    }

    return (
        <div>
            <p className='title'>{t('dailyConsumptions')}</p>
            <div>
                <Button
                    icon={ICONS.plus}
                    text={t('add')}
                    onClick={() => nav('add')}
                    btnType={BtnTypes.standard}
                />
            </div>


            <div className='margin_top_20'>
                {loading ? <HeadingLoadingTemplate /> :
                    <div className='full_width  display_flex justify_content_end'>
                        <div className='input display_flex justify_content_end'>
                            <span>{t('totalAll')}: </span>
                            <span>{totalAll()}</span>
                        </div>
                    </div>
                }
                {loading ? <ShotLoadingTemplate /> :
                    <div className="full_width overflow_x_scroll">
                        <table className='custom_table full_width'>
                            <thead >
                                <tr><th colSpan={8}>{t('todayConsumptions')}</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>{t('createdDate')}</th>
                                    <th>{t('amount')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('registrar')}</th>
                                    <th>{t('descriptions')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consumptions.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><span className='bullet margin_auto full_width'>{formatFirebaseDates(item.createdDate)}</span></td>
                                        <td>{item.amount}</td>
                                        <td>{item.type}</td>
                                        <td>{item.registrar}</td>
                                        <td>{item.descriptions}</td>
                                        <td>
                                            <Button
                                                text={t('delete')}
                                                onClick={() => showDeleteModal(index)}
                                                btnType={'crossBtn'}
                                                id={'delete_row' + index}
                                            />
                                            <Tooltip
                                                anchorSelect={"#delete_row" + index}
                                                place="right"
                                                className="toolTip_style"
                                            >
                                                {t("delete")}
                                            </Tooltip>
                                        </td>
                                    </tr>
                                })}
                                {consumptions.length === 0 && <tr><td colSpan={7}>{t('notExist')}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                }
            </div>

        </div>
    )
}

export default DailyConsumptions