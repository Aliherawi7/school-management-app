import { Timestamp } from 'firebase/firestore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useStateValue } from '../../context/StateProvider.js';
import { addClassName, addLog, getClassNameById, updateClassName } from '../../Utils/DBService.ts';
import Button from '../UI/Button/Button.tsx';
import LoadingTemplateContainer from '../UI/LoadingTemplate/LoadingTemplateContainer.jsx';
import ShotLoadingTemplate from '../UI/LoadingTemplate/ShotLoadingTemplate.jsx';


function AddClassName({ updateMode = false }) {
    const nav = useNavigate();
    const { classNameId } = useParams();
    const [{ authentication },] = useStateValue()

    const [formData, setformData] = useState({
        name: '',
        number: NaN,
        totalHours: 5,
        createdDate: Timestamp.fromDate(new Date()),
    });
    const [className, setClassName] = useState();

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (updateMode) {
            getClassNameById(classNameId)
                .then(res => {
                    setformData(res)
                    setClassName(res)
                })
                .catch(err => console.log(err))
        }

    }, [classNameId, updateMode])


    const sendDataToAPI = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            if (updateMode) {
                updateClassName({ ...className, ...values })
                    .then(res => {
                        const log = {
                            createdDate: new Date(),
                            registrar: `${authentication.name} ${authentication.lastname}`,
                            title: `${t('update')} ${t('className')}`,
                            message: `${t('className')} [${className.name} ${className.number}] ${t('successfullyUpdated')}`,
                            data: { ...formData, id: classNameId }
                        };
                        addLog(log);
                        toast.success(t('successfullyUpdated'));
                        nav('/classNames/' + classNameId);
                    })
                    .catch(err => {
                        console.log(err);
                        toast.error(t('operationFailed'));
                    })
                    .finally(() => {
                        setLoading(false);
                        setSubmitting(false);
                    })

            } else {
                addClassName({
                    ...formData,
                    createdDate: Timestamp.fromDate(new Date())
                })
                    .then(res => {
                        const log = {
                            createdDate: new Date(),
                            registrar: `${authentication.name} ${authentication.lastname}`,
                            title: `${t('add')} ${t('className')}`,
                            message: `${t('className')} [${values.name} ${values.number}] ${t('successfullyAdded')}`,
                            data: { ...values, id: res.$loki }
                        };
                        addLog(log);

                        toast.success(t('successfullyAdded'));
                        nav('/classNames');

                    }).catch(err => {

                    })
                    .finally(() => {
                        setLoading(false);
                        setSubmitting(false);
                    })

            }
        } catch (err) {
            console.error('Error occurred:', err);
            toast.error(err.message || t('errorOccurred'));
        }
    };


    // if (!authentication.isAuthenticated) {
    //     return <Circle />; // or return null; for no UI during loading
    // }

    // if (!authentication.sectionsAccess.includes(SystemSections.ClassNames) && !authentication.roles.includes(Roles.SUPER_ADMIN)) {
    //     return <NotFound />
    // }

    if (updateMode && !className) {
        return <LoadingTemplateContainer>
            <ShotLoadingTemplate />
        </LoadingTemplateContainer>
    }

    return (
        <Formik
            initialValues={formData}
            validationSchema={ClassNameSchema}
            onSubmit={sendDataToAPI}
            enableReinitialize={true}
        >
            <div>
                <Button
                    text={t('back')}
                    onClick={() => nav(-1)}
                />
                <h1 className='title'>{updateMode ? t('update') : t('add')}  {t('className')}</h1>
                <Form
                    className="add_form display_flex flex_direction_column"
                    style={{ gap: "3px" }}
                    onChange={e => {
                        const name = e.target.name
                        formData[name] = e.target.value;
                        setformData({ ...formData, })
                    }}
                >
                    <div className="full_width" >
                        <div className='display_flex flex_direction_column margin_5'>
                            <label htmlFor="name">{t('name')}</label>
                            <Field
                                name="name"
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
                        <div className='display_flex flex_direction_column margin_5'>
                            <label htmlFor="number">{t('number')}</label>
                            <Field
                                name="number"
                                type="number"
                                className="input"
                            />
                            <ErrorMessage
                                name="number"
                                component="div"
                                className="error_msg"
                            />
                        </div>
                        <div className='display_flex flex_direction_column margin_5'>
                            <label htmlFor="totalHours">{t('totalHours')}</label>
                            <Field
                                name="totalHours"
                                type="number"
                                className="input"
                            />
                            <ErrorMessage
                                name="totalHours"
                                component="div"
                                className="error_msg"
                            />
                        </div>

                    </div>
                    <div className=' margin_top_10 margin_left_10 margin_right_10'>
                        <Button
                            type="submit"
                            id="addButton"
                            text={t("save")}
                            loading={loading}
                        />
                    </div>
                </Form>
            </div>
        </Formik>
    )
}


// Define the validation schema using Yup
const ClassNameSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, `${t("name")} ${t("isShortText")}`)
        .max(40, `${t("name")} ${t("isLongText")}`)
        .required(`${t("name")} ${t("isRequireText")}`),
    number: yup
        .number()
        .min(1, `${t("number")} ${t("isShortText")}`)
        .max(12, `${t("number")} ${t("isLongText")}`)
        .required(`${t("number")} ${t("isRequireText")}`),
    totalHours: yup
        .number()
        .min(1, `${t("totalHours")} ${t("isShortText")}`)
        .max(7, `${t("totalHours")} ${t("isLongText")}`)
        .required(`${t("totalHours")} ${t("isRequireText")}`),

});

export default AddClassName