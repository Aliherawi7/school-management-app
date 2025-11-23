import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { gregorianToJalali } from 'shamsi-date-converter';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate';
import Colors from '../../../constants/Colors';
import { getConsumptions, getConsumptionTypes } from '../../../Utils/DBService';
import { Consumption, ConsumptionType } from '../../../Types/Types';
import { convertToDate } from '../../../Utils/ServiceFunctions';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

// Dari month names array
const dariMonths = [
    "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"
];


// Convert Gregorian month number to Dari
const convertMonthToDari = (gregorianMonth: number): string => {
    return dariMonths[gregorianMonth - 1];
};

const ConsumptionsReport: React.FC = () => {
    const [data, setData] = useState<Consumption[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);  // For showing details of clicked year
    const [loading, setLoading] = useState(true);
    const [consumptionTypes, setconsumptionTypes] = useState<ConsumptionType[]>()
    const [tempConsumptions, settempConsumptions] = useState({});

    // Fetch data from Firestore
    useEffect(() => {
        getConsumptions()
            .then(res => setData(res))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        getConsumptionTypes()
            .then(res => {
                setconsumptionTypes(res)
                const temp = {};
                console.log(res);

                res.forEach(item => {
                    temp[item.name] = 0
                })
                console.log(temp);
                settempConsumptions(temp)


            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);


    // Group data by year
    const consumptionByYear: { [key: string]: { [key: string]: number } } = {};

    data.forEach(entry => {
        console.log(entry);

        const { type, amount, createdDate } = entry;
        const [shamsiYear,] = gregorianToJalali(convertToDate(createdDate));

        if (!consumptionByYear[shamsiYear]) {
            consumptionByYear[shamsiYear] = { ...tempConsumptions }
        }
        console.log(consumptionByYear);

        consumptionByYear[shamsiYear][type] += parseFloat(amount);
    });

    const sortedYears = Object.keys(consumptionByYear).sort((a, b) => Number(a) - Number(b));

    // Prepare the first bar chart (grouped by year)
    const barDataByYear = {
        labels: sortedYears,
        datasets: consumptionTypes?.map((type, index) => ({
            label: type.name,
            data: sortedYears.map(year => consumptionByYear[year][type.name]),
            backgroundColor: Colors[index],
            borderColor: Colors[index],
        }))
    };

    const barOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                ticks: {
                    maxTicksLimit: 12,
                    font: {
                        size: 14,  // Increased label font size
                    },
                },
            },
        },
    };

    // When a year is selected, prepare data for the second bar chart with all 12 months
    const months = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];

    // Track consumption types separately for each month
    const consumptionByMonth: { [key: string]: { [key: string]: { [key: string]: number } } } = {};

    data.forEach(entry => {
        const { type, amount, createdDate } = entry;
        const dateObj = convertToDate(createdDate);
        const [shamsiYear, shamsiMonth] = gregorianToJalali(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());

        if (!consumptionByMonth[shamsiYear]) {
            consumptionByMonth[shamsiYear] = {
                "حمل": { ...tempConsumptions },
                "ثور": { ...tempConsumptions },
                "جوزا": { ...tempConsumptions },
                "سرطان": { ...tempConsumptions },
                "اسد": { ...tempConsumptions },
                "سنبله": { ...tempConsumptions },
                "میزان": { ...tempConsumptions },
                "عقرب": { ...tempConsumptions },
                "قوس": { ...tempConsumptions },
                "جدی": { ...tempConsumptions },
                "دلو": { ...tempConsumptions },
                "حوت": { ...tempConsumptions },
            };
        }
        const monthInDari = convertMonthToDari(shamsiMonth);
        // console.log("type when adding: ", type, amount);

        consumptionByMonth[shamsiYear][monthInDari][type] += parseFloat(amount);
    });

    console.log(consumptionByMonth);


    const selectedBarData = selectedYear
        ? {
            labels: months,
            datasets: consumptionTypes?.map((type, index) => ({
                label: t('constantConsumptions'),
                data: months.map(month => consumptionByMonth[selectedYear]?.[month][type.name] ?? 0),
                backgroundColor: Colors[index],
                borderColor: Colors[index],
            })),
        }
        : null;

    if (loading) {
        return <ShotLoadingTemplate />;
    }
    console.log(selectedBarData);


    return (
        <div className='display_flex flex_direction_column align_items_center full_width'>
            <h2>{t('consumptionsReport')}</h2>

            {/* Bar Chart (Grouped by Year) */}
            <div className='input full_width padding_20' style={{ margin: '10px 30px', padding: '40px' }}>
                <h3 className='text_align_center'>{t('consumptionsSummerise')}</h3>
                <Bar
                    data={barDataByYear}
                    options={{
                        ...barOptions,
                        onClick: (event, elements) => {
                            if (elements.length > 0) {
                                const clickedIndex = elements[0].index;
                                const clickedYear = barDataByYear.labels[clickedIndex];
                                setSelectedYear(clickedYear as string);
                            }
                        },
                    }}
                />
            </div>

            {/* Show all 12 months of the selected year */}
            {selectedYear && selectedBarData && (
                <div className='input full_width padding_20' style={{ margin: '10px 30px', padding: '40px' }}>
                    <h3 className='text_align_center'>{t(`${t('detailsFor')} ${selectedYear}`)}</h3>
                    <Bar data={selectedBarData} options={{ responsive: true }} />
                </div>
            )}

            {/* Line Chart */}
            <div className='input full_width' style={{ margin: '10px 30px', padding: '40px' }}>
                <h3 className='text_align_center'>{t('Line Chart (Based on Date)')}</h3>
                <Line data={barDataByYear} options={{ responsive: true }} />
            </div>
        </div>
    );
};

export default ConsumptionsReport;
