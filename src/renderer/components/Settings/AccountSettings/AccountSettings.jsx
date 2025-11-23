import { ErrorMessage, Field, Form, Formik } from 'formik';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import BtnTypes from '../../../constants/BtnTypes';
import { getSystemConfig, updateSystemConfig } from '../../../Utils/DBService';
import Button from '../../UI/Button/Button';

function AccountSettings() {
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [systemConfig, setsystemConfig] = useState({
    name: '',
    lastName: '',
    businessName: '',
    registrationKey: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    getSystemConfig()
      .then(res => {
        console.log(res);

        setsystemConfig(res)
      })
      .catch(err => {
        console.log(err);
      })

  }, [])


  const handleFormChange = (values, { setSubmitting }) => {
    setloading(true);
    const temp = { ...systemConfig, ...values }
    updateSystemConfig((temp))
      .then(res => {
        setsystemConfig(temp)
        toast.success(t('successfullyUpdated'))
      })
      .finally(() => {
        setloading(false);
        setSubmitting(false)
      })
  }


  return (
    <div>
      <p className="title">{t('accountSettings')}</p>

      <Formik
        initialValues={systemConfig}
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
        onSubmit={handleFormChange}
      >

        <Form className="display_flex flex_direction_column align_items_center margin_top_20">
          {error && (
            <div className="not_found_email_error_msg">{error}</div>
          )}{" "}

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


          <div className="button_container display_flex justify_content_center align_items_center">

            <Button
              text={!loading ? `${t('save')}` : t("updating")}
              btnType={BtnTypes.modern}
              type={'submit'}
              loading={loading}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default AccountSettings;
