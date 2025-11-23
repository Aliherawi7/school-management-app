import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { ConsumptionType } from '../../../Types/Types';
import { formatFirebaseDates } from '../../../Utils/DateTimeUtils';
import BtnTypes from '../../../constants/BtnTypes';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/modal/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { addConsumptionType, deleteConsumptionType, getConsumptionTypes } from '../../../Utils/DBService';
import ICONS from '../../../constants/Icons';
import { useStateValue } from '../../../context/StateProvider';
import { actionTypes } from '../../../context/reducer';
import { toast } from 'react-toastify';

const Types = {
    returnable: "returnable",
    nonReturnable: 'nonReturnable',
}

const ConsumptionsConfig: React.FC = () => {
    const [, dispatch] = useStateValue()
    const [consumptionsTypes, setconsumptionstypes] = useState<ConsumptionType[]>();
    const [showModal, setshowModal] = useState(false);
    const [newcons, setnewcons] = useState<ConsumptionType>({
        createdDate: new Date(),
        name: '',
        type: Types.nonReturnable
    })
    const [loading, setloading] = useState(false)
    useEffect(() => {
        getConsumptionTypes()
            .then(res => setconsumptionstypes(res))
            .catch(err => console.log(err))
            .finally()
    }, [])

    const handleFormSubmit = (values, { setSubmitting }) => {
        setloading(true)
        console.log(values);
        addConsumptionType(values)
            .then(res => {
                getConsumptionTypes()
                    .then(res => setconsumptionstypes(res))
                setshowModal(false);
                toast.success(t('successfullyAdded'))
            })
            .catch(err => {
                console.log(err);
                toast.error(t('operationFailed'))
            }).finally(() => {
                setloading(false)
            })
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



    const deleteCons = (index: number) => {
        if (consumptionsTypes) {
            dispatch({
                type: actionTypes.SET_GLOBAL_LOADING,
                payload: { value: true },
            });
            dispatch({
                type: actionTypes.HIDE_ASKING_MODAL,
            });
            deleteConsumptionType(consumptionsTypes[index])
                .then(res => {
                    consumptionsTypes?.splice(index, 1);
                    setconsumptionstypes([...consumptionsTypes]);
                    toast.success(t('successfullyDeleted'))
                })
                .catch(err => {
                    toast.error(t('operationFailed'))
                })
                .finally(() => {
                    dispatch({
                        type: actionTypes.SET_GLOBAL_LOADING,
                        payload: { value: false },
                    });
                })
        }
    }

    return (
        <div>
            <Button
                text={t('add') + " " + t('new')}
                btnType={BtnTypes.standard}
                onClick={() => setshowModal(true)}
            />

            <Modal show={showModal} modalClose={() => setshowModal(false)}>
                <div className='display_flex flex_direction_column align_items_center'>
                    <h2>{t('add') + " " + t('new')}</h2>
                    <div>
                        <Formik
                            initialValues={newcons}
                            validationSchema={Schema}
                            onSubmit={handleFormSubmit}
                            enableReinitialize={true}
                        >
                            <Form className="add_form display_flex flex_direction_column">
                                <div className="form_inputs margin_top_20  " >
                                    <div className='display_flex flex_direction_column margin_5'>
                                        <label htmlFor="name">{t('name')}</label>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="input"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="error_msg"
                                        />
                                    </div>

                                    <div className='display_flex flex_direction_column margin_5'>
                                        <div className='display_flex flex_direction_column margin_5'>
                                            <label htmlFor="type">{t('type')}</label>
                                            <Field
                                                name="type"
                                                as='select'
                                                className="input"
                                            >
                                                <option value={'returnable'}>{t('returnable')}</option>
                                                <option value={'nonReturnable'}>{t('nonReturnable')}</option>
                                            </Field>
                                            <ErrorMessage
                                                name="type"
                                                component="div"
                                                className="error_msg"
                                            />
                                        </div>

                                    </div>

                                </div>
                                <div className='display_flex justify_content_center margin_top_10 '>
                                    <Button
                                        text={t('save')}
                                        type={'submit'}
                                        loading={loading}
                                    />
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </Modal>


            <div className='table_container '>
                <table className="full_width custom_table table_row_hover">
                    <thead >
                        <tr className='margin_10 '>
                            <th colSpan={5}>
                                {t('consumptionTypes')}
                            </th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>{t('name')}</th>
                            <th>{t('type')}</th>
                            <th>{t('createdDate')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumptionsTypes?.map((emp, index) => {
                            return <tr
                                className=" cursor_pointer hover"
                                key={index}
                            >
                                <td>{index + 1}</td>
                                <td>{emp.name}</td>
                                <td>{t(emp.type)}</td>
                                <td>{formatFirebaseDates(emp.createdDate)}</td>
                                <td>
                                    <Button
                                        icon={ICONS.trash}
                                        onClick={() => showDeleteModal(index)}
                                        btnType={BtnTypes.danger}
                                    />
                                </td>
                            </tr>
                        })
                        }
                        {consumptionsTypes?.length === 0 &&
                            <tr>
                                <td colSpan={5}>{t('notExist')}</td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const Schema = yup.object().shape({
    type: yup
        .string()
        .min(2, `${t("type")} ${t("isShortText")}`)
        .max(40, `${t("type")} ${t("isLongText")}`)
        .required(`${t("type")} ${t("isRequireText")}`),
    name: yup
        .string()
        .min(3, `${t("name")} ${t("isShortText")}`)
        .max(300, `${t("name")} ${t("isLongText")}`)
        .required(`${t("name")} ${t("isRequireText")}`),
});

export default ConsumptionsConfig