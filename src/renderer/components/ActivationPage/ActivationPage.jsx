import './ActivationPage.css';

import React, { useState } from 'react';

import { updateSystemConfig } from '../../Utils/DBService';
import { generateActivationCode } from '../../Utils/Encryption';

const ActivationPage = ({ hashedCode, setActive, sysConfig }) => {
    const [userCode, setUserCode] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [errMsg, seterrMsg] = useState('')
    const handleCopy = () => {
        navigator.clipboard.writeText(hashedCode);
        setCopySuccess("کد با موفقیت کپی شد!");
        setTimeout(() => setCopySuccess(""), 2000);
    };

    const handleInputChange = (e) => {
        setUserCode(e.target.value);
        seterrMsg('')
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // alert(`کد که را وارد کردید اشتباه است`);
        const hashedCodeGenerated = generateActivationCode(hashedCode);
        if (userCode === hashedCodeGenerated) {
            updateSystemConfig({ ...sysConfig, registrationKey: userCode })
            setActive({ isActive: true, sysConfig: { ...sysConfig, registrationKey: userCode } })
            return
        }
        seterrMsg("کد وارد شده اشتباه است")
    };

    return (
        <div className="activation-code-container">
            <h2 className="title">فعال‌سازی برنامه</h2>
            <p className="instruction">
                لطفاً کد زیر را کپی کرده و برای توسعه‌دهنده ارسال کنید. پس از دریافت کد تأیید،
                آن را در کادر زیر وارد کنید و روی دکمه «ارسال» کلیک کنید.
            </p>

            <div className="code-box display_flex flex_direction_column align_items_start">
                <button className="copy-btn" onClick={handleCopy}>
                    کپی کردن کد
                </button>
                <div className="code ">{hashedCode}</div>
            </div>

            {copySuccess && <p className="copy-success">{copySuccess}</p>}

            <form className="input-form" onSubmit={handleSubmit}>
                <label htmlFor="userCode" className="input-label">
                    وارد کردن کد تایید:
                </label>
                <input
                    type="text"
                    id="userCode"
                    className="input-field"
                    value={userCode}
                    onChange={handleInputChange}
                />
                <p className='bullet'>{errMsg}</p>
                <button type="submit" className="submit-btn" onClick={handleSubmit}>
                    ارسال
                </button>
            </form>
        </div>
    );
};

export default ActivationPage;
