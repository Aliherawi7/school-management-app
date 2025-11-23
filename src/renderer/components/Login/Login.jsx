import "./Login.css"
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { auth } from '../../constants/FirebaseConfig';
import { getUserByEmail } from '../../Utils/FirebaseTools.ts';
import { t } from 'i18next';
import BtnTypes from '../../constants/BtnTypes.js';
import Button from '../UI/Button/Button';
import ICONS from '../../constants/Icons';
import { actionTypes } from '../../context/reducer';
import login_bg from "../../../assets/img/login_bg.jpg"
import { encryptData } from '../../Utils/Encryption.ts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';

function Login() {
    const [, dispatch] = useStateValue();
    const [error, setError] = useState(null); // Define error state
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for displaying password
    const navigate = useNavigate();

    const login = async (values, { setSubmitting }) => {
        setLoading(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then(res => {
                dispatch({
                    type: actionTypes.SET_SMALL_LOADING,
                    payload: true
                })
                console.log(res);

                getUserByEmail(values.email)
                    .then(user => {
                        console.log(user);

                        setSubmitting(true);
                        if (!user.disabled) {
                            // Encrypt and store each item in localStorage
                            const itemsToStore = {
                                name: user.name,
                                lastname: user.lastName,
                                email: user.email,
                                originalEntityId: user.originalEntityId,
                                userType: user.userType,
                                userId: user.id,
                                roles: user?.roles?.join(','), // Encrypt as comma-separated string
                                sectionsAccess: user.sectionsAccess.join(','),
                                locale: 'fa',
                            };

                            // Loop through each item and encrypt the key-value pair
                            Object.entries(itemsToStore).forEach(([key, value]) => {
                                const { encryptedKey, encryptedValue } = encryptData(key, value);
                                localStorage.setItem(encryptedKey, encryptedValue);
                            });
                            localStorage.setItem('locale', 'fa')
                            console.log('dispatching data');
                            dispatch({
                                type: actionTypes.SET_AUTHENTICATION,
                                payload: {
                                    name: user.name,
                                    lastname: user.lastName,
                                    email: user.email,
                                    originalEntityId: user?.originalEntityId,
                                    userType: user.userType,
                                    userId: user.id,
                                    roles: user?.roles,
                                    sectionsAccess: user.sectionsAccess,
                                }
                            });
                            console.log('nav to home');
                            navigate("/");
                        } else {
                            dispatch({
                                type: actionTypes.LOGOUT,
                            });

                        }
                    })
                    .catch(err => {
                        console.log(err);

                        dispatch({
                            type: actionTypes.LOGOUT,
                        });
                        setError(err.message);
                    })
                    .finally(() => {
                        setSubmitting(false);
                        setError(t('accountLocked'))
                        dispatch({
                            type: actionTypes.SET_SMALL_LOADING,
                            payload: false
                        })
                    })
            })
            .catch(err => {
                if (err.message.includes('auth/invalid-credential')) {
                    setError(t('authInvalidCredential'))
                } else
                    setError(err.message);
            })
            .finally(() => {
                setLoading(false);
                setSubmitting(false);
                // dispatch({
                //     type: actionTypes.SET_SMALL_LOADING,
                //     payload: false
                // })
            })
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            validationSchema={yup.object({
                email: yup
                    .string()
                    .email(t("invalidEmail"))
                    .max(50, t("emailMaxWidth"))
                    .required(`${t("email")} ${t("isRequireText")}`),
                password: yup
                    .string()
                    .min(5, t("passwordMinWidth"))
                    .required(`${t("passwordPlaceholder")} ${t("isRequireText")}`),
            })}
            onSubmit={login}
        >
            <div className="login display_flex" style={{ backgroundImage: `url(${login_bg})` }}>

                <div
                    className="login_form   full_width display_flex flex_direction_column justify_content_center align_items_center">
                    <h1 className=' title text_align_center bold'>{t('CMS')}</h1>
                    <div className="login_form_container">
                        <h2 className="text_align_center bold">{t("loginPageTitle")}</h2>
                        <Form className="display_flex flex_direction_column">
                            {error && (
                                <div className="not_found_email_error_msg">{error}</div>
                            )}{" "}
                            {/* Display error message */}
                            <div className="login_form_input_box">
                                <Field
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                />
                                {/* Display validation error for email */}
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="login_form_input_box">
                                <div className="login_password_input_container">
                                    <Field
                                        name="password"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("passwordPlaceholder")}
                                    />
                                    <span onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <i className={ICONS.eyeSlash}></i>
                                        ) : (
                                            <i className={ICONS.eye}></i>
                                        )}
                                    </span>
                                </div>
                                {/* Display validation error for password */}
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="error_msg"
                                />
                            </div>
                            <div className="button_container display_flex justify_content_center align_items_center">
                                <Button
                                    text={loading ? t("signInLoading") : t("signInBtn")}
                                    btnType={BtnTypes.modern}
                                    type={'submit'}
                                />
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </Formik>
    );
}

export default Login