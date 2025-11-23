import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { jalaliToGregorian } from 'shamsi-date-converter';

import { actionTypes } from '../../../context/reducer';
import { useStateValue } from '../../../context/StateProvider';
import { Consumption, ConsumptionType, Log } from '../../../Types/Types';
import { convertToJalali } from '../../../Utils/DateTimeUtils';
import { addLog, deleteConsumption, getConsumptions, getConsumptionTypes } from '../../../Utils/DBService';
import { convertToDate } from '../../../Utils/ServiceFunctions';
import Button from '../../UI/Button/Button';
import CustomDatePicker from '../../UI/DatePicker/CustomDatePicker';
import HeadingLoadingTemplate from '../../UI/LoadingTemplate/HeadingLoadingTemplate';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate';
import ICONS from '../../../constants/Icons';
import BtnTypes from '../../../constants/BtnTypes';


const ConsumptionsManagement: React.FC = () => {
    const [consumptions, setconsumptions] = useState<Consumption[]>([])
    const [consumptionTypes, setconsumptionTypes] = useState<ConsumptionType[]>([])
    const [filtered, setFiltered] = useState<Consumption[]>([])
    const [loading, setLoading] = useState(true)
    const [{ authentication }, dispatch] = useStateValue()
    const [range, setrange] = useState<Date[]>([])
    const [type, settype] = useState('all')

    useEffect(() => {
        getConsumptionTypes()
            .then(res => setconsumptionTypes(res))
            .catch(err => console.log(err));

        getConsumptions()
            .then(res => {
                console.log(res);

                setconsumptions(res)
                setFiltered(res)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))

    }, [])


    useEffect(() => {

        if (type === 'all') {
            setFiltered(consumptions)
        }
        else {
            const fil = consumptions.filter(item => {
                return item.type === type
            })
            setFiltered(fil);
        }

    }, [type, consumptions])


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

                    data: { ...filtered[index] }
                };

                addLog(log);
                toast.success(t('successfullyDeleted'))
                const temp = [...consumptions];
                temp.splice(index, 1);
                setconsumptions(temp);
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

    const totalAll = (): number => {
        let total = 0;
        filtered.forEach(item => total += Number(item.amount))
        return total;
    }

    const getProductSalesInDatePeriod = async () => {
        const dates: Date[] = range.map(item => new Date(jalaliToGregorian(item.year, item.month.number, item.day).join('/')))
        let consumps: Consumption[] = type === 'all' ? consumptions : consumptions.filter(item => item.type === type);
        console.log(dates);

        if (range.length === 1) {
            console.log(range);
            consumps = consumps.filter(item => {
                const elementDate = convertToDate(item.createdDate); // Convert Firebase Timestamp to JS Date

                // Create a range for the entire day, accounting for time (start of day to end of day)
                const startOfDay = new Date(dates[0].setHours(0, 0, 0, 0));  // Start of the day (00:00:00)
                const endOfDay = new Date(dates[0].setHours(23, 59, 59, 999)); // End of the day (23:59:59)

                // Check if the element's date falls within the entire day
                return elementDate >= startOfDay && elementDate <= endOfDay;
            });
        }


        if (range.length >= 2) {
            console.log(range);
            const startDay = new Date(dates[0].setHours(0, 0, 0, 0));
            const endDay = new Date(dates[1].setHours(23, 59, 59, 999));

            consumps = consumps
                .filter(item => {
                    console.log(item,);

                    const elementDate = convertToDate(item.createdDate); // Convert Firebase Timestamp to JS Date
                    return elementDate >= startDay && elementDate <= endDay;
                })
        }

        setFiltered(consumps)

    }

    const clearFilter = () => {
        settype('all')
        setrange([])
    }


    return (
        <div>

            <div className='display_flex align_items_center margin_top_20 margin_bottom_10'>
                <div className='display_flex justify_content_center align_items_center full_width '>
                    <label htmlFor="">{t('type')}: </label>
                    <select name="" id=""
                        onChange={(e) => settype(e.target.value)}
                        value={type}
                    >
                        <option value={'all'}>{t('all')}</option>
                        {consumptionTypes.map(key => {
                            return <option value={key.name} key={key.name}>{t(key.name)}</option>
                        })}
                    </select>
                </div>

                <div className='display_flex justify_content_center align_items_center full_width'>
                    <label htmlFor="">{t('period')}: </label>
                    <CustomDatePicker
                        range
                        value={range}
                        onChange={(e: any) => setrange(e)}
                        placeholder={t('chooseDatePeriod')}
                    />
                    <Button
                        text={t('apply')}
                        onClick={getProductSalesInDatePeriod}
                    />
                </div>
                <Button
                    icon={ICONS.trash}
                    btnType={BtnTypes.danger}
                    onClick={clearFilter}
                    id='clearbtn'
                />
                <Tooltip
                    anchorSelect="#clearbtn"
                    place="top"
                    className="toolTip_style"
                >
                    {t("clear")} {t("filters")}
                </Tooltip>
            </div>
            <div className='margin_top_20'>
                {loading ? <HeadingLoadingTemplate /> :
                    <div className='full_width  display_flex justify_content_end'>
                        <div className='input display_flex justify_content_end'>
                            <span className='bold'>{t('totalAll')}: </span>
                            <span>{totalAll()}</span>
                        </div>
                    </div>
                }
                {loading ? <ShotLoadingTemplate /> :
                    <div className="full_width overflow_x_scroll">
                        <table className='custom_table full_width'>
                            <thead >
                                <tr><th colSpan={7}>{type === 'all' ? t('consumptions') : type}</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>{t('date')}</th>
                                    <th>{t('amount')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('registrar')}</th>
                                    <th>{t('descriptions')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><span className='bullet full_width margin_auto'>{convertToJalali(item.createdDate)}</span></td>
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
                                {filtered.length === 0 && <tr><td colSpan={7}>{t('notExist')}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>

    )
}

export default ConsumptionsManagement