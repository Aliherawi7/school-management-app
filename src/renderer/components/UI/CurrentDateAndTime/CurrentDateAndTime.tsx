import 'moment/locale/fa'; // Persian (Farsi) for Gregorian
import 'moment-hijri'; // Hijri (Islamic) support
import "./ClockWithDate.css"

import React, { useEffect, useState } from 'react';

import HijriDate from 'hijri-date'
import { gregorianToJalali } from 'shamsi-date-converter';
import moment from 'moment';
import { StandardDayOfWeek } from '../../../constants/DayOfWeek';
import { t } from 'i18next';

const ClockWithDate = () => {
    const [time, setTime] = useState('');
    const [jalaliDate, setJalaliDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');
    const [hijriDate, setHijriDate] = useState('');
    const [zodiacSign, setZodiacSign] = useState('');

    // Zodiac signs based on Persian calendar
    const zodiacSigns = [
        'حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'
    ];

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            // Update time in "hh:mm:ss" format
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);

            // Get Jalali (Shamsi) Date
            const [year, month, day] = gregorianToJalali(now);
            setJalaliDate(`${t(StandardDayOfWeek[now.getDay()])}  ${day} ${getPersianMonthName(month)} ${year}`);

            // Get Zodiac Sign (based on the month in Jalali)
            setZodiacSign(zodiacSigns[month - 1]);

            // Get Gregorian Date
            setGregorianDate(`${moment(now).format('YYYY-MM-DD')} - ${moment(now).format('dddd')}`);

            // Hijri Date
            // const hijri = moment(now).format('iYYYY/iMM/iDD');
            // const hijriWithDay = moment(now).format('dddd - iDD iMMMM iYYYY');
            const hijriDate = new HijriDate();
            console.log(hijriDate);
            setHijriDate(hijriDate);
        };

        // Initial call to update date and time
        updateDateTime();

    }, []);

    // Helper function to get Persian month names
    const getPersianMonthName = (month) => {

        return zodiacSigns[month - 1];
    };

    return (
        <div className='input display_flex align_items_center justify_content_center flex_flow_wrap'>
            <p className='title_2 bold'>تاریخ امروز</p>
            <div
                className='display_flex justify_content_space_around full_width'>

                <div className='datebox'>
                    <p>خورشیدی</p>
                    <p>{jalaliDate}</p>
                    {/* <p>{`${moment().format('dddd')} - ${moment().format('D')}`}</p> */}
                </div>
                <div className='datebox'>
                    <p>میلادی</p>
                    <p>{gregorianDate}</p>
                </div>
                <div className='datebox'>
                    <p>قمری</p>
                    <p>{`${hijriDate.year}-${hijriDate.month}-${hijriDate.date}`}</p>
                </div>
            </div>
        </div>
    );
};

export default ClockWithDate;
