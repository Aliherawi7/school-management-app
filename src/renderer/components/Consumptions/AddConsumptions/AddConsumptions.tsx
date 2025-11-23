import { ErrorMessage, Field, Form, Formik } from 'formik';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jalaliToGregorian } from 'shamsi-date-converter';
import * as yup from 'yup';

import BtnTypes from '../../../constants/BtnTypes';
import { ConsumptionsType } from '../../../constants/Others';
import { useStateValue } from '../../../context/StateProvider';
import { Consumption, ConsumptionType, Log } from '../../../Types/Types';
import { addConsumption, addLog, getConsumptionTypes } from '../../../Utils/DBService';
import { convertToDate } from '../../../Utils/ServiceFunctions';
import Button from '../../UI/Button/Button';
import CustomDatePicker from '../../UI/DatePicker/CustomDatePicker';



const AddConsumptions: React.FC = () => {
    const nav = useNavigate();
    const [{ authentication },] = useStateValue();
    const [consumption, setconsumption] = useState<Consumption>({
        id: '',
        amount: 0,
        createdDate: new Date(),
        date: new Date(),
        descriptions: '',
        registrar: `${authentication.name || ''} ${authentication.lastname || ''}`,
        type: '',
    })
    const [loading, setloading] = useState(false)
    const [consumptionTypes, setconsumptionTypes] = useState<ConsumptionType[]>()

    useEffect(() => {
        getConsumptionTypes()
            .then(res => setconsumptionTypes(res))
            .catch(err => console.log(err))

    }, [])


    const sendDataToAPI = async () => {
        if (consumption.type.length === 0 || consumption.amount === 0) {
            toast.error(t('pleaseFillTheForm'));
            return;
        }
        setloading(true)

        addConsumption(consumption)
            .then(res => {
                const log: Log = {
                    createdDate: new Date(),
                    registrar: `${authentication.name} ${authentication.lastname}`, // Assume you have a way to track the current user
                    title: `${t('add')} ${t('consumptions')} `,
                    message: ` ${t('consumptions')} [${t('type')}:(${t(consumption.type)}) ${t('amount')}: (${consumption.amount}) ${consumption.type === ConsumptionsType.WITHDRAW ? t('toAccount') + ": (" + consumption.to?.name + " " + consumption.to?.lastName : ''})] ${t('successfullyAdded')}`,
                    data: { ...consumption }
                };

                addLog(log);
                toast.success(t('successfullyAdded'))
                nav("/consumptions")
            })
            .catch(err => {
                toast.error(err.message)
            })
            .finally(() => {
                setloading(false)
            })
    }


    const handleFormChanges = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        const temp = { ...consumption };
        temp[name] = value;
        setconsumption(temp)
    }

    console.log(consumption);

    // if (!authentication.sectionsAccess.includes(SystemSections.Sales) && !authentication.roles.includes(Roles.SUPER_ADMIN)) {
    //     return <NotFound />
    // }


    return (
        <div>
            <div className='add_product'>
                <Button
                    text={t('back')}
                    onClick={() => nav(-1)}

                    btnType={BtnTypes.standard}
                />
                <Formik
                    initialValues={consumption}
                    validationSchema={Schema}
                // onSubmit={sendDataToAPI}
                // enableReinitialize={true}
                >
                    <Form
                        className="add_form display_flex flex_direction_column"
                        onChange={handleFormChanges}
                    >
                        <div className="full_width margin_top_10 display_flex flex_direction_column">
                            <div className="form_inputs margin_top_20  " >
                                <div className='display_flex flex_direction_column margin_5'>
                                    <label htmlFor="visitorContractType">{t('type')}</label>
                                    <Field
                                        name="type"
                                        as='select'
                                        className="input"
                                    >
                                        <option value={''}></option>
                                        {consumptionTypes?.map((type, inx) => <option value={type.name} key={inx}>{type.name}</option>)}
                                    </Field>
                                    <ErrorMessage
                                        name="type"
                                        component="div"
                                        className="error_msg"
                                    />
                                </div>
                                <div className='display_flex flex_direction_column margin_5'>
                                    <label htmlFor="amount">{t('amount')}</label>
                                    <Field
                                        name="amount"
                                        type="number"
                                        className="input"
                                    />
                                    <ErrorMessage
                                        name="amount"
                                        component="div"
                                        className="error_msg"
                                    />
                                </div>

                                <div className='display_flex flex_direction_column margin_5' style={{ direction: "rtl" }}>
                                    <label htmlFor="date">{t('date')}</label>
                                    <CustomDatePicker
                                        name={'createdDate'}

                                        value={convertToDate(consumption.createdDate)}
                                        onChange={(e) => {
                                            console.log(e);

                                            // Convert Jalali to Gregorian
                                            const dateArray = jalaliToGregorian(e.year, e.month.number, e.day);

                                            // Ensure leading zeros for month and day
                                            const year = dateArray[0];
                                            const month = String(dateArray[1]).padStart(2, '0');
                                            const day = String(dateArray[2]).padStart(2, '0');

                                            // Capture current time for accurate time details
                                            const currentHours = new Date().getHours();
                                            const currentMinutes = new Date().getMinutes();
                                            const currentSeconds = new Date().getSeconds();

                                            // Construct date string with the exact time
                                            const dateString = `${year}-${month}-${day}T${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
                                            const date = new Date(dateString);

                                            // Check if date is valid
                                            if (isNaN(date.getTime())) {
                                                console.error("Invalid Date after conversion:", date);
                                                toast.error(t('Invalid Date Detected'));
                                                return;
                                            }

                                            // Store in Firebase Timestamp with accurate time
                                            setconsumption({
                                                ...consumption,
                                                createdDate: date
                                            });
                                        }}
                                    />

                                    <ErrorMessage
                                        name="joinedDate"
                                        component="div"
                                        className="error_msg"
                                    />
                                </div>
                                <div className='display_flex flex_direction_column margin_5'>
                                    <label htmlFor="descriptions">{t('descriptions')}</label>
                                    <Field
                                        name="descriptions"
                                        as="textarea"
                                        type="text"
                                        className="input"
                                        autoFocus
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="error_msg"
                                    />
                                </div>

                            </div>

                        </div>
                        <div className=' margin_top_10 margin_left_10 margin_right_10'>
                            <Button
                                text={t('save')}
                                type={'submit'}
                                loading={loading}
                                onClick={sendDataToAPI}
                            />
                        </div>
                    </Form>
                </Formik>

            </div >




        </div >
    )
}

export default AddConsumptions

// Define the validation schema using Yup
const Schema = yup.object().shape({
    type: yup
        .string()
        .min(2, `${t("type")} ${t("isShortText")}`)
        .max(40, `${t("type")} ${t("isLongText")}`)
        .required(`${t("type")} ${t("isRequireText")}`),
    descriptions: yup
        .string()
        .min(3, `${t("descriptions")} ${t("isShortText")}`)
        .max(300, `${t("descriptions")} ${t("isLongText")}`)
        .required(`${t("descriptions")} ${t("isRequireText")}`),
    date: yup
        .date()
        .required(`${t("descriptions")} ${t("isRequireText")}`),
    amount: yup
        .number()
        .required(`${t("amount")} ${t("isRequireText")}`),


});
