import './QuickStartSetup.css';

import { addDoc, collection } from 'firebase/firestore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

import { db } from '../../constants/FirebaseConfig';
import { addSystemConfig, getSystemInfo2 } from '../../Utils/DBService';
import Configuration from '../Settings/Configuration/Configuration';
import ConfigurationQuick from '../Settings/Configuration/ConfigurationQuick';

const modelConfig = {
    heightModel: ['گرد', 'تلیزدار', 'راسته'],
    sleeveModel: ['شهبازی', 'چپه', 'پاکستانی', 'کرزی', 'سرشانه', 'عربی'],
    cuffsModel: ['کفک دار', 'محراب دار', 'ساده', 'بندک دار'],
    pantsModel: ['بزرگ', 'متوسط', 'خورد'],
    tailFootModel: ['لایی دار', 'بی لایی'],
}

function QuickStartSetup({ setActive, active }) {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [config, setConfig] = useState();
    const [formData,] = useState({
        name: '',
        lastName: '',
        businessName: '',
        registrationKey: '',
        phoneNumber: '',
        address: ''
    });
    const [tryAgain, setTryAgain] = useState(false)
    const [allowNext, setAllowNext] = useState(true)
    const [systemInfo, setsystemInfo] = useState()

    const onComplete = async () => {
        addSystemConfig(config)
            .then(res => {
                setActive({ quickSetupDone: true })
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getSystemInfo2()
            .then(res => {
                console.log(res);
                setsystemInfo(res)
            })
            .catch(err => {
                console.log(err);
            })
    }, []);


    const saveDataToApi = async (conf) => {
        const data = {
            systemInfo: systemInfo,
            date: new Date().toISOString(),
            appName: 'TMS-APP v-1.1.0',
            config: conf
        }
        console.log("in send data: ", data);

        const usersCollectionRef = collection(db, 'Users');
        return await addDoc(usersCollectionRef, data);
    }


    function simulateDateCheck() {
        setAllowNext(false)
        setTryAgain(false)
        setProgress(0);
        fetchRemoteTime()
            .then(res => {
                console.log("date: ", res);
                const date = new Date(res.date_time);
                if (date.getMonth() > 4) {
                    const interval = setInterval(() => {
                        setProgress((prev) => {
                            if (prev >= 55) {
                                setTryAgain(true);
                                clearInterval(interval);
                            }
                            return prev + 10;
                        });
                    }, 4000);
                    return;
                }
                const conf = {
                    ...config,
                    startDate: date,
                    xd: date,
                }
                setConfig(conf);
                const interval = setInterval(() => {
                    setProgress((prev) => {
                        return prev + 10;
                    });
                }, 10000);

                saveDataToApi(conf)
                    .then(res => {
                        nextStep();
                        clearInterval(interval);
                    })
                    .catch(err => {
                        console.log(err);
                        clearInterval(interval);
                        setTryAgain(true);
                    })


            }).catch(err => {
                setProgress(15)
                setTryAgain(true);
                console.log('err: ', err);
            })


    }

    const fetchRemoteTime = async () => {
        try {
            const response = await fetch('https://api.ipgeolocation.io/timezone?apiKey=213a042041e0459ebbd7708dd2915055');
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        } catch (err) {
            console.log("erro: ", err);

            throw new Error(err)
        }
    };


    const handleSubmitForm = (values, { setSubmitteing }) => {
        const conf = {
            ...config,
            ...values,
            quickSetupDone: true,
            sewModels: modelConfig
        }
        setConfig(conf)
        console.log("submistion:", conf);
        nextStep()
        setAllowNext(true)
    }

    function nextStep() {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
    }

    function prevStep() {
        setAllowNext(true)
        if (step > 0) {
            setStep(step - 1);
        }
    }


    const steps = [
        {
            title: "به برنامه مدیریت خیاطی (TMS) خوش آمدید",
            content: (
                <div>
                    <p>
                        TMS-APP یک راه‌حل جامع برای مدیریت وظایف شماست. بیایید نسخه آزمایشی خود را به سرعت راه‌اندازی کنیم تا بتوانید استفاده از برنامه را شروع کنید.
                    </p>
                </div>
            ),
        },
        {
            title: "اطلاعات کاربری",
            content: (
                <Formik
                    initialValues={formData}
                    validationSchema={yup.object({
                        name: yup
                            .string()
                            .required(`${t("name")} ${t("isRequireText")}`),
                        lastName: yup
                            .string()
                            .required(`${t("lastName")} ${t("isRequireText")}`),
                        businessName: yup
                            .string()
                            .required(`${t("businessName")} ${t("isRequireText")}`),
                        phoneNumber: yup
                            .string()
                            .required(`${t("phoneNumber")} ${t("isRequireText")}`),
                        address: yup
                            .string()
                            .required(`${t("address")} ${t("isRequireText")}`),
                        registrationKey: yup
                            .string()
                            .required(`${t("registrationKey")} ${t("isRequireText")}`),
                    })}
                    enableReinitialize
                    onSubmit={handleSubmitForm}
                >

                    <Form className="display_flex flex_direction_column align_items_center margin_top_20">
                        <div className="  full_width">
                            {/* Display error message */}
                            <div className="login_form_input_box  margin_5">
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="name">{t('name')}</label>
                                    <Field
                                        name="name"
                                        id="name"
                                        type={"text"}
                                    // placeholder={t("name")}
                                    />
                                </div>
                                {/* Display validation error for email */}
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="login_form_input_box margin_5">
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="lastName">{t('lastName')}</label>
                                    <Field
                                        name="lastName"
                                        id="lastName"
                                        type={"text"}
                                    // placeholder={t("lastName")}
                                    />
                                </div>

                                {/* Display validation error for email */}
                                <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="login_form_input_box margin_5">
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="businessName">{t('businessName')}</label>
                                    <Field
                                        name="businessName"
                                        id="lastName"
                                        type={"text"}

                                    />
                                </div>
                                {/* Display validation error for password */}
                                <ErrorMessage
                                    name="businessName"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="login_form_input_box margin_5">
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="phoneNumber">{t('phoneNumber')}</label>
                                    <Field
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        type={"text"}

                                    />
                                </div>
                                {/* Display validation error for password */}
                                <ErrorMessage
                                    name="phoneNumber"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                        </div>
                        <div className='full_width'>
                            <div className="login_form_input_box margin_5">
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="address">{t('address')}</label>
                                    <Field
                                        name="address"
                                        id="address"
                                        type={"text"}

                                    />
                                </div>
                                {/* Display validation error for password */}
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="login_form_input_box  margin_5" >
                                <div className="display_flex flex_direction_column">
                                    <label htmlFor="registrationKey">{t('registrationKey')}</label>
                                    <Field
                                        name="registrationKey"
                                        id="registrationKey"
                                        type={"text"}

                                    />
                                </div>
                                {/* Display validation error for password */}
                                <ErrorMessage
                                    name="registrationKey"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>

                        </div>
                        <div className="login_form_input_box  margin_5" >
                            <button type="submit">{t('next')}</button>
                        </div>
                    </Form>

                </Formik>
            ),
        },
        {
            title: " پیکربندی مدل ها",
            content: (
                <div>
                    <ConfigurationQuick config={config} />
                </div>
            ),
        },
        {
            title: "دریافت اطلاعات",
            content: (
                <div>

                    <h2>در حال بررسی اطلاعات...</h2>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>

                    {!tryAgain ? <p>لطفاً منتظر بمانید تا تنظیمات شما آماده شود...</p> :
                        <>
                            <p style={{ color: 'red' }}>خطا در بارگیری اطلاعات!</p>
                            < button onClick={simulateDateCheck}>امتحان دوباره</button>
                        </>
                    }

                </div>
            ),
            onEnter: () => simulateDateCheck(),
        },
        {
            title: "پایان تنظیمات",
            content: (
                <div>
                    <h1>تنظیمات شما با موفقیت انجام شد!</h1>
                    <p>
                        از اینکه TMS-APP را انتخاب کردید سپاسگزاریم. اکنون می‌توانید مدیریت وظایف خود را آغاز کنید.
                    </p>
                    <button onClick={onComplete}>پایان</button>
                </div>
            ),
        },
    ];


    React.useEffect(() => {
        if (steps[step].onEnter) {
            steps[step].onEnter();
        }
    }, [step]);

    console.log(step, step);


    return (
        <div className="quick-start-setup">
            <div className="step-container">
                <h1>{steps[step].title}</h1>
                <div className="content">{steps[step].content}</div>
            </div>
            <div className="navigation">

                {(step > 0 && step !== steps.length - 1) && <button onClick={prevStep}>قبلی</button>}

                {step !== 1 && ((step < steps.length - 1) && allowNext) && (
                    <button onClick={nextStep}>بعدی</button>
                )}
            </div>
        </div>
    );
}

export default QuickStartSetup;
