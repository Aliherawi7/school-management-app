import '../Reports.css';

import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { jalaliToGregorian } from 'shamsi-date-converter';

import Colors from '../../../constants/Colors';
import { DoughnutChartData, DoughnutDataSet, PatientPayment, Reception, Service } from '../../../Types/Types';
import { convertToDate } from '../../../Utils/ServiceFunctions';
import BarChart from '../../Charts/BarChart';
import DoughnutChart from '../../Charts/DoughnutChart';
import Button from '../../UI/Button/Button';
import CustomDatePicker from '../../UI/DatePicker/CustomDatePicker';
import LoadingTemplateContainer from '../../UI/LoadingTemplate/LoadingTemplateContainer';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate';
import MoneyStatus from '../../UI/MoneyStatus/MoneyStatus';

// import { getAllPayments, getFactors, getProducts } from '../../../Utils/FirebaseTools'


const getAllPayments = async () => [];
const getFactors = async () => [];
const getProducts = async () => [];


export interface PatientReportContainer {
    totalAllAmount: number,
    totalAllReceptions: number,
    totalPaidAmount: number,
}

const PatientReport: React.FC = () => {

    const [receptions, setReceptions] = useState<Reception[]>()
    const [customerPayments, setcustomerPayments] = useState<PatientPayment[]>([])
    const [services, setservices] = useState<Service[]>([])
    const [range, setRange] = useState<Date[]>([])
    const [patientsReport, setPatientReport] = useState<PatientReportContainer>({
        totalAllAmount: 0,
        totalAllReceptions: 0,
        totalPaidAmount: 0,

    })
    const [loading, setLoading] = useState<boolean>(false)

    const [servicesSales, setProductsSales] = useState<DoughnutChartData>()
    const [servicesNumber, setservicesNumber] = useState<DoughnutChartData>()


    useEffect(() => {
        setLoading(true)
        getFactors()
            .then(res => {
                setReceptions(res)
            })
        getAllPayments()
            .then(res => {
                setcustomerPayments(res)
            })
        getProducts().then(res => {
            setservices(res);
        })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        console.log('useEffect run for analysing data');

        if (receptions && customerPayments) {
            generateReport(receptions, customerPayments, range)
        }
        console.log('end useEffect run for analysing data');

    }, [receptions, customerPayments, services])



    const generateReport = (receptions: Reception[], customerPayments: PatientPayment[], range: Date[]) => {
        let payments: PatientPayment[] = customerPayments;
        let recepts: Reception[] = receptions;

        if (range.length === 1) {
            console.log(range);
            const startOfDay = range[0];
            startOfDay.setHours(0, 0, 0, 0); // Start of today (midnight)

            const endOfDay = new Date(range[0]);
            endOfDay.setHours(23, 59, 59, 999); // End of today

            recepts = receptions.filter(item => {

                const elementDate = convertToDate(item.date);
                // Convert Firebase Timestamp to JS Date
                return elementDate >= startOfDay && elementDate <= endOfDay;
            })
            payments = payments.filter(item => {
                const elementDate = convertToDate(item.date);
                // Convert Firebase Timestamp to JS Date
                return elementDate >= startOfDay && elementDate <= endOfDay;
            })
        }

        if (range.length >= 2) {
            const startOfDay = range[0];
            startOfDay.setHours(0, 0, 0, 0); // Start of today (midnight)

            const endOfDay = new Date(range[1]);
            endOfDay.setHours(23, 59, 59, 999); // End of today

            receptions = receptions.filter(item => {
                const elementDate = convertToDate(item.date); // Convert Firebase Timestamp to JS Date
                return elementDate >= startOfDay && elementDate <= endOfDay;
            })
            payments = payments.filter(item => {
                // the should be change to date field 
                const elementDate = convertToDate(item.date); // Convert Firebase Timestamp to JS Date
                return elementDate >= startOfDay && elementDate <= endOfDay;
            })
        }

        let report: PatientReportContainer = {
            totalAllAmount: 0,
            totalAllReceptions: receptions.length,
            totalPaidAmount: 0,
        }
        receptions.forEach(reception => {
            let totalServicesOfRecept: number = reception.service.reduce((a, b) => a + Number(b.price), 0);
            let paidAmount: number = Number(reception.paidAmount);

            report = {
                ...report,
                totalAllAmount: report.totalAllAmount + totalServicesOfRecept,
                totalAllReceptions: receptions.length,
                totalPaidAmount: report.totalPaidAmount + paidAmount
            }
        })
        let totalPaid = payments.reduce((a, b) => a + Number(b.amount), 0);
        report = {
            ...report,
            totalPaidAmount: totalPaid,
        }
        setPatientReport(report)
        patientActivity(receptions);

    }


    const patientActivity = (receptions: Reception[]) => {
        const name: string[] = [];
        const color: string[] = [];
        let priceDataSet: DoughnutDataSet = {
            backgroundColor: [],
            data: [],
            label: t('theAmountOfMoneySold')
        }
        let numberDataSet: DoughnutDataSet = {
            backgroundColor: [],
            data: [],
            label: t('totalNumberOFSold')
        }
        services.forEach((prd, index) => {
            let totalAmount: number = 0;
            let totalNumber: number = 0;

            receptions?.forEach(fac => {
                const result = fac.service.find(item => item.$loki === prd.$loki);
                if (result) {
                    totalAmount += Number(result.price);
                    totalNumber += result ? 1 : 0;
                }
            })
            priceDataSet.data.push(totalAmount);
            numberDataSet.data.push(totalNumber);
            name.push(prd.name);
            color.push(Colors[index])
        })
        priceDataSet.backgroundColor = color;
        numberDataSet.backgroundColor = color;

        setProductsSales({
            labels: name,
            datasets: [
                priceDataSet,
            ]
        })
        setservicesNumber({
            labels: name,
            datasets: [
                numberDataSet
            ]
        })
    }


    const getProductSalesInDatePeriod = async () => {
        const dates: Date[] = range.map(item => new Date(jalaliToGregorian(item.year, item.month.number, item.day).join('/')))
        console.log(dates);

        generateReport(receptions, customerPayments, dates)


    }


    if (!receptions) {
        return <LoadingTemplateContainer>
            <ShotLoadingTemplate />
        </LoadingTemplateContainer>
    }



    return (
        <div>
            <div className='text_align_center margin_top_20 margin_bottom_10 display_flex justify_content_center align_items_center'>
                {/* <span>{t('chooseDatePeriod')}: </span> */}
                <CustomDatePicker
                    range
                    onChange={(e: any) => setRange(e)}
                    placeholder={t('chooseDatePeriod')}
                />
                <Button
                    text={t('apply')}
                    onClick={getProductSalesInDatePeriod}
                />
            </div>
            {loading ? <ShotLoadingTemplate /> :
                <div className='display_flex margin_top_20 flex_flow_wrap flex_direction_column justify_content_center full_width'>
                    <div className='display_flex flex_flow_wrap justify_content_space_around'>
                        <div className='card_box data_card_info margin_5'>
                            <div>{t('theAmountOfMoneySold')}</div>
                            <div className='bold'>{patientsReport.totalAllAmount}</div>
                        </div>
                        <div className='card_box data_card_info margin_5'>
                            <div>{t('totalAllPaidAmount')}</div>
                            <div className='bold'>{patientsReport.totalPaidAmount}</div>
                        </div>
                        <div className='card_box data_card_info margin_5'>
                            <div>{t('totalRemainedAmount')}</div>
                            <div className='bold'>
                                {Math.abs(patientsReport.totalAllRemainedAmount)}
                                <MoneyStatus number={patientsReport.totalAllRemainedAmount} />
                            </div>
                        </div>
                        <div className='card_box data_card_info margin_5'>
                            <div>{t('totalProducts')}</div>
                            <div className='bold'>{patientsReport.totalSoldProducts}</div>
                        </div>
                    </div>
                    <div className=' full_width justify_content_space_around display_flex flex_flow_wrap margin_top_10' >
                        <div className='chart_container input'>
                            <p className='title_2 '>{t('theAmountOfMoneySold')}</p>
                            {servicesSales ?
                                <DoughnutChart data={servicesSales} unit='af' />
                                :
                                <ShotLoadingTemplate />
                            }
                        </div>
                        <div className=' chart_container input'>
                            <p className='title_2'>{t('totalNumberOFSold')}</p>
                            {servicesNumber ?
                                <BarChart chartData={servicesNumber} />
                                :
                                <ShotLoadingTemplate />
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PatientReport