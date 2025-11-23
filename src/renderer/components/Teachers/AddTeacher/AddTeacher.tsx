import './AddTeacher.css';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useStateValue } from '../../../context/StateProvider.js';
import { addLog, addTeacher, getClassNames, getTeacherById, updateTeacher } from '../../../Utils/DBService.ts';
import Button from '../../UI/Button/Button.tsx';
import { ClassName, Teacher } from '../../../Types/Types.ts';

function AddTeacher({ updateMode = false }) {
    const nav = useNavigate();
    const { teacherId } = useParams();
    const [loading, setloading] = useState(false)
    const [{ authentication },] = useStateValue();
    const [classes, setclasses] = useState<ClassName[]>([])


    const [formData, setformData] = useState<Teacher>({
        name: '',
        lastName: '',
        phoneNumber: '',
        createdDate: new Date(),
        subjects: [],
        resClassName: null,

    })
    const [teacher, setTeacher] = useState()

    useEffect(() => {
        getClassNames()
            .then(res => {
                setclasses(res)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])


    useEffect(() => {
        if (updateMode) {
            getTeacherById(teacherId)
                .then(data => {
                    // setfileURL(url)
                    setformData({ ...data })
                    setTeacher({ ...data })
                }).catch(err => {
                    console.log(err);
                })
        }

    }, [teacherId, updateMode])


    const sendDataToAPI = async () => {
        console.log('send method called: ', formData);
        setloading(true);

        if (updateMode) {
            // Update mode logic (same as before)
            console.log('In update mode');
            updateTeacher(formData)
                .then(res => {
                    toast.success(t('successfullyUpdated'));
                    nav('/teachers/' + teacherId);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    console.log('Closing the loading and setting submission to false');
                    setloading(false);
                    // setSubmitting(false);
                })

        } else {
            addTeacher({
                ...formData,
                createdDate: new Date()
            })
                .then(res => {
                    nav('/teachers');
                    toast.success(t('successfullyAdded'));
                })
                .catch(err => {
                    console.error('Error occurred:', err);
                }).finally(() => {
                    console.log('Closing the loading and setting submission to false');
                    setloading(false);
                })
        }

    }


    console.log(formData);

    return (
        <Formik
            initialValues={formData}
            validationSchema={TeacherSchema}
            onSubmit={sendDataToAPI}
            enableReinitialize
        >
            <div className='add_teacher padding_bottom_10'>
                <Button
                    text={t('back')}
                    onClick={() => nav(-1)}
                />
                <h1 className='title'>{updateMode ? t('update') : t('add')} {t('teacher')}</h1>
                <Form className="add_form display_flex flex_direction_column"
                    onChange={e => {
                        const name = e.target.name

                        if (name === 'resClassName') {
                            formData[name] = classes.find(cl => cl.$loki == e.target.value);
                            setformData({ ...formData, })
                            return;
                        }
                        formData[name] = e.target.value;
                        setformData({ ...formData, })
                    }}
                >
                    <div className="form_inputs margin_top_20 display_flex flex_flow_wrap justify_content_center " >
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
                            <label htmlFor="lastName">{t('lastName')}</label>
                            <Field
                                name="lastName"
                                type="text"
                                className="input"
                                min={1}
                            />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="error_msg"
                            />
                        </div>
                        <div className='display_flex flex_direction_column margin_5'>
                            <label htmlFor="phoneNumber">{t('phoneNumber')}</label>
                            <Field
                                name="phoneNumber"
                                type="text"
                                className="input"
                                min={10}
                            />
                            <ErrorMessage
                                name="phoneNumber"
                                component="div"
                                className="error_msg"
                            />
                        </div>
                        <div className='display_flex flex_direction_column margin_5'>
                            <label htmlFor="resClassName">{t('resClassName')}</label>
                            <Field
                                name="resClassName"
                                as="select"
                                className="input"

                            >
                                <option value="">{t('choose')}</option>
                                {classes.map(cls => {
                                    return (
                                        <option value={cls.$loki}>{cls.name}</option>
                                    )
                                })}

                            </Field>
                            <ErrorMessage
                                name="resClassName"
                                component="div"
                                className="error_msg"
                            />
                        </div>


                    </div>
                    <div className=' margin_top_10 display_flex justify_content_center'>
                        <Button
                            type="submit"
                            id="addButton"
                            text={t("save")}
                            loading={loading}
                        // onClick={sendDataToAPI}
                        />
                    </div>
                </Form>
            </div >
        </Formik>
    )
}

// Define the validation schema using Yup
const TeacherSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, `${t("name")} ${t("isShortText")}`)
        .max(40, `${t("name")} ${t("isLongText")}`)
        .required(`${t("name")} ${t("isRequireText")}`),
    lastName: yup
        .string()
        .min(3, `${t("lastName")} ${t("isShortText")}`)
        .max(30, `${t("lastName")} ${t("isLongText")}`)
        .required(`${t("lastName")} ${t("isRequireText")}`),
    phoneNumber: yup
        .string()
        .matches(/^07[0-9]{8}$/, t("invalidContactNumber"))
        .required(`${t("contactNumber")} ${t("isRequireText")}`),
});

export default AddTeacher