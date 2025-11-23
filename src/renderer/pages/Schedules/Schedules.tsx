import React, { useEffect, useRef, useState } from 'react'
import { ClassName, Schedule, Subject, Teacher, Time } from '../../Types/Types'
import { addSchedule, getClassNames, getSchedules, getSubjects, getTeachers, getTimes } from '../../Utils/DBService'
import DayOfWeek from '../../constants/DayOfWeek'
import { t } from 'i18next'
import { formatTime } from '../../Utils/DateTimeUtils'
import Menu from '../../components/UI/Menu/Menu'
import Button from '../../components/UI/Button/Button'
import ICONS from '../../constants/Icons'
import ReactToPrint from 'react-to-print'
import { gregorianToJalali } from 'shamsi-date-converter'
import print from '../../constants/PrintCssStyles'
import { useStateValue } from '../../context/StateProvider'
import { actionTypes } from '../../context/reducer'
import Colors from '../../constants/Colors'

interface DailySchedule {
    [className: string]: {
        [time: string]: {
            subject: string;
            teacher: string;
            classNumber: number;
        };
    };
}

interface WeeklySchedule {
    [day: string]: DailySchedule;
}


const Schedules = () => {
    const [, dispatch] = useStateValue()
    const [schedules, setschedules] = useState<Schedule[]>([]);
    const [classes, setclasses] = useState<ClassName[]>([]);
    const [times, settimes] = useState<Time[]>([]);
    const [teachers, setteachers] = useState<Teacher[]>([]);
    const [subjects, setsubjects] = useState<Subject[]>([]);
    const [showPrintModal, setshowPrintModal] = useState(false);
    const [transformedSchedules, setTransformedSchedules] = useState<WeeklySchedule>();
    let scheduleTable = useRef();
    useEffect(() => {
        getSchedules()
            .then(res => setschedules(res))
            .catch(err => console.log(err))
        getClassNames()
            .then(res => setclasses(res.sort((a, b) => b.number - a.number)));
        getTimes()
            .then(res => settimes(res))
        getSubjects()
            .then(res => setsubjects(res))
        getTeachers()
            .then(res => setteachers(res))

    }, []);



    const generateRandomSchedule = (
        teachers: Teacher[],
        classes: ClassName[],
        subjects: Subject[],
        times: Time[], // Array of Time objects
        days: string[] // Array of days starting from Saturday
    ): Schedule[] => {
        const schedules: Schedule[] = [];

        // Track subjects taught per class per day
        const subjectTracker: { [day: string]: { [className: string]: Set<string> } } = {};

        // Track how many times a subject is taught per class in a week
        const subjectWeeklyTracker: { [className: string]: { [subjectName: string]: number } } = {};

        // Track teacher availability per day and hour
        const teacherAvailability: { [day: string]: { [teacherId: string]: Set<string> } } = {};

        // Initialize trackers
        days.forEach(day => {
            subjectTracker[day] = {};
            teacherAvailability[day] = {};
            classes.forEach(cls => {
                subjectTracker[day][cls.name] = new Set<string>();
            });
            teachers.forEach(teacher => {
                teacherAvailability[day][teacher.$loki] = new Set<string>();
            });
        });

        // Initialize subject weekly tracker
        classes.forEach(cls => {
            subjectWeeklyTracker[cls.name] = {};
            subjects.forEach(sub => {
                if (sub.className.name === cls.name) {
                    subjectWeeklyTracker[cls.name][sub.name] = 0; // Initialize subject count for the week
                }
            });
        });

        // Assign first hour to each teacher for their respective class every day
        days.forEach(day => {
            teachers.forEach(teacher => {
                if (!teacher.resClassName) return;
                const firstHourSubjects = teacher.subjects.filter(sub => sub.className.$loki === teacher.resClassName.$loki);

                // Try to assign the first subject
                if (firstHourSubjects.length > 0) {
                    let assigned = false;
                    for (let i = 0; i < firstHourSubjects.length; i++) {
                        const subject = firstHourSubjects[i];
                        if (subjectWeeklyTracker[teacher.resClassName.name][subject.name] < subject.coefficient) {
                            const firstHourSchedule: Schedule = {
                                className: teacher.resClassName,
                                subject: subject,
                                teacher: teacher,
                                time: times[0], // Use the first time slot for the first hour
                                day: day
                            };
                            subjectTracker[day][teacher.resClassName.name].add(subject.name);
                            teacherAvailability[day][teacher.$loki].add(times[0].startTime);
                            subjectWeeklyTracker[teacher.resClassName.name][subject.name] += 1;
                            schedules.push(firstHourSchedule);
                            assigned = true;
                            break; // Assign only one subject per teacher per day
                        }
                    }

                    // If no subject was assigned (coefficient not enough), assign the next available subject
                    if (!assigned && firstHourSubjects.length > 0) {
                        const subject = firstHourSubjects[0]; // Assign the first subject as a fallback
                        const firstHourSchedule: Schedule = {
                            className: teacher.resClassName,
                            subject: subject,
                            teacher: teacher,
                            time: times[0], // Use the first time slot for the first hour
                            day: day
                        };
                        subjectTracker[day][teacher.resClassName.name].add(subject.name);
                        teacherAvailability[day][teacher.$loki].add(times[0].startTime);
                        subjectWeeklyTracker[teacher.resClassName.name][subject.name] += 1;
                        schedules.push(firstHourSchedule);
                    }
                }
            });
        });

        // Assign remaining hours based on class totalHours
        days.forEach(day => {
            console.log('day:', day, "---------------------------------");

            classes.forEach(cls => {
                console.log('class: ', cls);
                const classTeachers = teachers.filter(teacher =>
                    teacher.subjects.some(sub => sub.className.name === cls.name)
                );
                console.log('class teachers: ', classTeachers);

                // Calculate the number of hours to allocate for this class on this day
                const hoursToAllocate = cls.totalHours; // Use the totalHours directly
                console.log("hoursto allocate: ", hoursToAllocate);

                for (let i = 1; i <= hoursToAllocate; i++) { // Start from 1 and include the last hour
                    const currentTime = times[i - 1]; // Adjust index to match times array
                    const availableTeachers = classTeachers.filter(teacher =>
                        !teacherAvailability[day][teacher.$loki]?.has(currentTime.startTime)
                    );
                    console.log('teacher-availability: ', teacherAvailability);

                    console.log("available-teachers: ", availableTeachers);

                    if (availableTeachers.length > 0) {
                        // Shuffle available teachers to randomize selection
                        const shuffledTeachers = availableTeachers.sort(() => Math.random() - 0.5);

                        let assigned = false;
                        for (const teacher of shuffledTeachers) {
                            const availableSubjects = teacher.subjects.filter(sub =>
                                sub.className.name === cls.name &&
                                !subjectTracker[day][cls.name].has(sub.name) &&
                                subjectWeeklyTracker[cls.name][sub.name] < sub.coefficient
                            );

                            if (availableSubjects.length > 0) {
                                // Shuffle available subjects to randomize selection
                                const shuffledSubjects = availableSubjects.sort(() => Math.random() - 0.5);

                                for (const subject of shuffledSubjects) {
                                    const schedule: Schedule = {
                                        className: cls,
                                        subject: subject,
                                        teacher: teacher,
                                        time: currentTime,
                                        day: day
                                    };
                                    subjectTracker[day][cls.name].add(subject.name);
                                    teacherAvailability[day][teacher.$loki]?.add(currentTime.startTime);
                                    subjectWeeklyTracker[cls.name][subject.name] += 1;
                                    schedules.push(schedule);
                                    assigned = true;
                                    break; // Assign only one subject per hour
                                }
                            }

                            if (assigned) {
                                break; // Move to the next hour once a subject is assigned
                            }
                        }

                        // If no subject was assigned due to coefficient constraints, assign any available subject
                        if (!assigned) {
                            for (const teacher of shuffledTeachers) {
                                const availableSubjects = teacher.subjects.filter(sub =>
                                    sub.className.name === cls.name &&
                                    !subjectTracker[day][cls.name].has(sub.name)
                                );

                                if (availableSubjects.length > 0) {
                                    const subject = availableSubjects[0]; // Assign the first available subject
                                    const schedule: Schedule = {
                                        className: cls,
                                        subject: subject,
                                        teacher: teacher,
                                        time: currentTime,
                                        day: day
                                    };
                                    subjectTracker[day][cls.name].add(subject.name);
                                    teacherAvailability[day][teacher.$loki]?.add(currentTime.startTime);
                                    subjectWeeklyTracker[cls.name][subject.name] += 1;
                                    schedules.push(schedule);
                                    assigned = true;
                                    break; // Assign only one subject per hour
                                }
                            }
                        }
                    }
                }
            });
        });

        return schedules;
    };


    const transformSchedule = (schedules: Schedule[]): WeeklySchedule => {
        const weeklySchedule: WeeklySchedule = {};
        console.log("total-schedule : ", schedules.length);


        schedules.forEach(schedule => {
            const day = schedule.day;
            const className = schedule.className.number;

            if (!weeklySchedule[day]) {
                weeklySchedule[day] = {};
            }
            if (!weeklySchedule[day][className]) {
                weeklySchedule[day][className] = {};
            }

            weeklySchedule[day][className][schedule.time.startTime] = {
                subject: schedule.subject.name,
                teacher: schedule.teacher.name,
                classNumber: schedule.className.number,
                time: schedule.time.startTime
            };
        });

        return weeklySchedule;
    };


    const showDeleteModal = () => {

    }

    const showGenerateRandomScheduleModal = () => {
        dispatch({
            type: actionTypes.SHOW_ASKING_MODAL,
            payload: {
                show: true,
                message: "generateScheduleMessage",
                btnAction: handleGenerateRandomSchedule,
            },
        });
    }

    const handleGenerateRandomSchedule = () => {
        dispatch({
            type: actionTypes.SET_GLOBAL_LOADING,
            payload: { value: true },
        });
        const randomSchedule = generateRandomSchedule(teachers, classes, subjects, times, DayOfWeek);
        const transformedSchedules: WeeklySchedule = transformSchedule(randomSchedule);
        setschedules(randomSchedule);
        setTransformedSchedules(transformedSchedules);

        dispatch({ type: actionTypes.SET_GLOBAL_LOADING, payload: { value: false } });

    }

    const handleSave = () => {
        schedules.forEach(sch => {
            addSchedule(sch)
        })


    }





    return (
        <div>
            <div className=' padding_top_10'>
                {schedules.length > 0 &&

                    <div className='display_flex justify_content_end'>
                        <Button
                            icon={ICONS.save}
                            text={t("save")}
                            onClick={handleSave}
                        />
                        <Button
                            icon={ICONS.trash}
                            text={t("delete")}
                            onClick={showDeleteModal}
                        />
                        <Button
                            icon={ICONS.repeat}
                            text={t("generateRandomSchedule")}
                            onClick={showGenerateRandomScheduleModal}
                        />
                        <ReactToPrint
                            content={() => scheduleTable}
                            trigger={() => <Button text={t("print")} icon={ICONS.printer} />}
                            copyStyles={true}
                            onBeforePrint={() => {
                                dispatch({
                                    type: actionTypes.SET_GLOBAL_LOADING,
                                    payload: { value: true },
                                });
                            }}
                            onAfterPrint={() => {
                                dispatch({
                                    type: actionTypes.SET_GLOBAL_LOADING,
                                    payload: { value: false },
                                });
                            }}
                            pageStyle={print({ pageSize: "A4", orientation: "portrait" })}
                            documentTitle={t("factor for customer")}
                        />
                    </div>

                }

                {schedules.length === 0 ?
                    (<div
                        className='display_flex  flex_direction_column align_items_center justify_content_center'
                        style={{
                            height: '80vh'
                        }}
                    >
                        <p className='title_2 margin_bottom_10'>{t('scheduleNotExist')}</p>
                        <Button
                            text={t('generateRandomSchedule')}
                            onClick={handleGenerateRandomSchedule}
                        />
                    </div>) :
                    <div
                        className='overflow_x_scroll'
                        ref={(value) => (scheduleTable = value)}>
                        <p className='title margin_auto'>{t('scheduleTableOfSchedule')} { } {t('year')}: {gregorianToJalali(new Date())[0]}</p>
                        <table className='custom_table full_width margin_top_20'

                        >
                            <thead>
                                <tr>
                                    <th>{t('dayOfWeek')}</th>
                                    {classes.map(cls => {
                                        return (
                                            <th colSpan={cls.totalHours} style={{ background: Colors[cls.number] }} >{cls.name}</th>
                                        )

                                    })}
                                </tr>
                                <tr>
                                    <th></th>
                                    {classes.map(cls => {
                                        return times
                                            .slice(0, cls.totalHours)
                                            .map(item => {
                                                return (
                                                    <td
                                                        style={{ fontSize: '8px' }}
                                                        style={{ fontSize: '8px', background: Colors[cls.number] }}
                                                    >
                                                        <span className='bullet'>{formatTime(item.startTime)}</span>
                                                        <span className='bullet'> {formatTime(item.endTime)}</span>
                                                    </td>
                                                )
                                            })
                                    })}
                                </tr>

                            </thead>
                            <tbody>
                                {Object.keys(transformedSchedules).map(sc => {
                                    //    console.log("fir: ", transformedSchedules[sc]);
                                    return (
                                        <tr>
                                            <td>{t(sc)}</td>
                                            {Object.keys(transformedSchedules[sc])
                                                .sort((a, b) => {
                                                    return Number(b) - Number(a);
                                                })
                                                .map(tm => {
                                                    //   console.log("tm: ", tm);

                                                    // console.log("tims: ", transformedSchedules[sc][tm]);

                                                    return Object.keys(transformedSchedules[sc][tm])
                                                        .map(sctm => {
                                                            // console.log(transformedSchedules[sc][tm]);
                                                            let counter = 0;
                                                            // console.log("sctm: ", sctm);
                                                            // console.log(" transformedSchedules[sc]: ", transformedSchedules[sc]);
                                                            Object.keys(transformedSchedules[sc]).forEach(key => {
                                                                //      console.log(transformedSchedules[sc][key]);
                                                                Object.keys(transformedSchedules[sc][key]).forEach(item => {
                                                                    // console.log(transformedSchedules[sc][key][item]);
                                                                    if (transformedSchedules[sc][key][item].teacher == transformedSchedules[sc][tm][sctm].teacher && transformedSchedules[sc][key][item].teacher == transformedSchedules[sc][tm][sctm]?.time) {
                                                                        counter++;
                                                                    }
                                                                })



                                                            })
                                                            // const isDupTeacher = 
                                                            return <td style={{ background: Colors[transformedSchedules[sc][tm][sctm].classNumber] }}>
                                                                <div className='border_1px_solid border_radius_8 cursor_pointer'
                                                                    style={{
                                                                        fontSize: "12px",
                                                                        backgroundColor: counter > 1 ? 'red' : ''

                                                                    }}
                                                                    draggable
                                                                >
                                                                    <p>{transformedSchedules[sc][tm][sctm].subject}: {transformedSchedules[sc][tm][sctm].classNumber}</p>
                                                                    <span className='bullet'>{transformedSchedules[sc][tm][sctm].teacher}</span>
                                                                    <span className='bullet'>{formatTime(transformedSchedules[sc][tm][sctm]?.time)}</span>
                                                                </div>
                                                            </td>;

                                                        })

                                                    // return <td></td>
                                                })}

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}

export default Schedules