import { Timestamp } from 'firebase/firestore';
// import * as shamsi from 'shamsi-date-converter';
import { Doctor, DoctorContract, Employee, Reception, salaryHistory } from '../Types/Types';
import { convertFirebaseDatesToDate, getDaysOfPersianMonth, getMonthsBetweenDates, getTheMonthDays } from './DateTimeUtils';
import { gregorianToJalali } from 'shamsi-date-converter';
import { MonthlySalaries } from '../components/Teachers/Teacher/EmployeeSalaries/Teachers';
import { getTotalDaysBetween } from './UtilsFunctions';
import { DoctorContractType } from '../constants/Others';

export const convertToDate = (value: Date | Timestamp): Date => {
    // console.log("convert-Date: ", value);
    return value instanceof Timestamp ? value.toDate() : new Date(value);
}




export const calculateEmployeeMonthlySalaries = (employee: Employee) => {
    console.log(employee);

    // const currentDate = new Date();
    let total: number = 0;
    const salaryHistory: salaryHistory[] = employee.salaryHistory.map(sh => ({ ...sh, date: convertToDate(sh.date) }))
    const salaries: MonthlySalaries[] = [];

    employee.employmentPeriods.forEach(period => {

        const joinedDate = convertToDate(period.startDate); // Convert Firestore timestamp to JS date
        const periodEndDate = period.endDate ? convertToDate(period.endDate) : new Date();

        // const thisPeriodSalaryHistory = salaryHistory
        //     .filter(item => item.date >= joinedDate && item.date <= periodEndDate) || []; // Fallback to an empty array if salaryHistory is undefined

        const totalMonths = getMonthsBetweenDates(joinedDate, periodEndDate); // Ensure this function is correct
        console.log("period:", period);
        console.log('total months ', totalMonths);

        console.log("this_period_salaryHist: ", salaryHistory);


        // Get the day of the month from the joinedDate to use as a base
        const joinedDay = joinedDate.getDate();

        for (let monthIndex = 0; monthIndex < totalMonths.length; monthIndex++) {
            // Set start date to the same day as joinedDate for the current month
            let monthStartDate = new Date(joinedDate);
            monthStartDate.setMonth(joinedDate.getMonth() + monthIndex);
            monthStartDate.setDate(joinedDay);

            // Set applicable salary for this month, defaulting to the employee's current salary
            let applicableSalary = salaryHistory[0].amount;

            // Find the most recent salary change applicable for this month
            console.log("salary arra: ", salaryHistory);

            for (let i = salaryHistory.length - 1; i >= 0; i--) {
                const salaryChangeDate = salaryHistory[i]?.date;

                // the convert can make some differece in log term this for that
                // salaryChangeDate.setDate(salaryChangeDate.getDate() - 10)
                console.log(`salarychange check:   salaryChangeDate:${salaryChangeDate.toLocaleDateString()} <=  monthStartDate:${monthStartDate.toLocaleDateString()}`);
                if (salaryChangeDate <= monthStartDate) {
                    applicableSalary = salaryHistory[i].amount;
                    break;
                }
            }



            // Calculate the end date of the current month, making it the same day in the following month
            let monthEndDate = new Date(monthStartDate);
            monthEndDate.setMonth(monthEndDate.getMonth() + 1);
            monthEndDate.setDate(joinedDay - 1); // Set the end date to the day before the start of the next cycle

            if (monthIndex === totalMonths.length - 1) {
                console.log("end of period:", monthIndex);

                const workedDays = getTotalDaysBetween(monthStartDate, periodEndDate);
                monthEndDate = periodEndDate;
                const monthdays = getDaysOfPersianMonth(monthEndDate)

                console.log(`salary: ${applicableSalary}, monthEnd: ${monthEndDate.toLocaleDateString()}, monthdays:${monthdays}, woredDays:${workedDays}`);

                applicableSalary = parseInt(`${(applicableSalary / monthdays) * workedDays}`);
                console.log("applicableSal:", applicableSalary);

            }

            total += Number(applicableSalary);

            // Push the data for the current month to the salaries array
            salaries.push({
                date: new Date(monthStartDate), // Start date of the month
                persianDate: gregorianToJalali(monthStartDate).join('/'),
                endDate: new Date(monthEndDate), // End date of the month
                persianEndDate: gregorianToJalali(monthEndDate).join('/'),
                salary: applicableSalary,
            });
        }
        console.log("=================period end========================");

    })


    return { total: total, monthlySalary: salaries.sort((a, b) => a.date.getTime() - b.date.getTime()) };
};

export function calculateDoctorMonthlySalariesForTest(contracts: DoctorContract[], receptions: Reception[]) {
    const salaries: MonthlySalaries[] = [];
    const now = new Date();
    let total: number = 0;

    contracts.forEach(period => {

        const startDate = convertToDate(period.startDate); // Convert Firestore timestamp to JS date
        let endDate = convertToDate(period.endDate || now);
        endDate = endDate < now ? endDate : new Date();

        const totalMonths = getMonthsBetweenDates(startDate, endDate); // Ensure this function is correct
        console.log("period:", period);
        console.log('total months ', totalMonths);


        // Get the day of the month from the startDate to use as a base
        const joinedDay = startDate.getDate();

        for (let monthIndex = 0; monthIndex < totalMonths.length; monthIndex++) {
            // Set start date to the same day as startDate for the current month
            let monthStartDate = new Date(startDate);
            monthStartDate.setMonth(startDate.getMonth() + monthIndex);
            monthStartDate.setDate(joinedDay);

            // Set applicable salary for this month, defaulting to the employee's current salary
            let applicableSalary = period.amount;

            if (period.type === DoctorContractType.CONTRACT_BASED_PATIENT) {
                applicableSalary = receptions
                    .filter(reception => {
                        const receptionDate = convertToDate(reception.date);
                        return (
                            reception.doctor.$loki == doctorId &&
                            receptionDate >= monthStartDate &&
                            receptionDate <= monthEndDate
                        );
                    })
                    .length * period.amount;
            }

            // Calculate the end date of the current month, making it the same day in the following month
            let monthEndDate = new Date(monthStartDate);
            monthEndDate.setMonth(monthEndDate.getMonth() + 1);
            monthEndDate.setDate(joinedDay - 1); // Set the end date to the day before the start of the next cycle

            if (monthIndex === totalMonths.length - 1 && period.type === DoctorContractType.CONTRACT_BASED_SALARY) {
                console.log("end of period:", monthIndex);

                const workedDays = getTotalDaysBetween(monthStartDate, endDate);
                monthEndDate = endDate;
                const monthdays = getDaysOfPersianMonth(monthEndDate)

                console.log(`salary: ${applicableSalary}, monthEnd: ${monthEndDate.toLocaleDateString()}, monthdays:${monthdays}, woredDays:${workedDays}`);

                applicableSalary = parseInt(`${(applicableSalary / monthdays) * workedDays}`);

                console.log("applicableSal:", applicableSalary);

            }
            total += Number(applicableSalary);

            // Push the data for the current month to the salaries array
            salaries.push({
                date: new Date(monthStartDate), // Start date of the month
                persianDate: gregorianToJalali(monthStartDate).join('/'),
                endDate: new Date(monthEndDate), // End date of the month
                persianEndDate: gregorianToJalali(monthEndDate).join('/'),
                salary: applicableSalary,
            });
        }

    })

    return { total: total, monthlySalary: salaries.sort((a, b) => a.date.getTime() - b.date.getTime()) };;
}

export function calculateDoctorMonthlySalaries(contracts: DoctorContract[], receptions: Reception[]): MonthlySalaries[] {
    const salaries: MonthlySalaries[] = [];
    const now = new Date();

    contracts.forEach(contract => {
        const { type, amount, startDate, endDate, doctorId } = contract;
        const start = convertToDate(startDate);
        const end = endDate ? convertToDate(endDate) : new Date();

        let current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const finalDate = end > now ? now : new Date(end.getFullYear(), end.getMonth() + 1, 0);

        while (current <= finalDate) {
            const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
            let salary = 0;

            if (type === DoctorContractType.CONTRACT_BASED_SALARY) {
                salary = amount;
            } else if (type === DoctorContractType.CONTRACT_BASED_PATIENT) {
                salary = receptions
                    .filter(reception => {
                        const receptionDate = convertToDate(reception.date);
                        return (
                            reception.doctor.$loki == doctorId &&
                            receptionDate >= current &&
                            receptionDate <= nextMonth
                        );
                    })
                    .reduce((sum, reception) => sum + reception.paidAmount, 0) * amount;
            }

            salaries.push({
                date: new Date(current),
                endDate: new Date(nextMonth),
                persianDate: "",
                persianEndDate: '',
                salary,
            });

            current = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
        }
    });

    console.log("salaries: ", salaries);

    return salaries;
}


export function getEmployeeStatus(employee: Employee): boolean {
    const employeePeriods = employee.employmentPeriods
        .sort((a, b) => convertToDate(a.startDate).getTime() - convertToDate(b.startDate).getTime());

    return employeePeriods[employeePeriods.length - 1].endDate == null;
}


