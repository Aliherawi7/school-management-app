import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BtnTypes from '../../../../constants/BtnTypes';
import ICONS from '../../../../constants/Icons';
import { ClassName, Subject, Teacher } from '../../../../Types/Types';
import { getClassNames, getSubjects, getTeachers, updateTeacher } from '../../../../Utils/DBService';
import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/modal/Modal';

interface props {
    data: Teacher,
    setData: Function
}
const TeacherSubject: React.FC<props> = ({ data, setData }) => {
    const [showModal, setshowModal] = useState(false);

    const [allSubs, setallSubs] = useState<Subject[]>([]);
    const [classes, setclasses] = useState<ClassName[]>([]);
    const [chooseSubjects, setchooseSubjects] = useState<Subject[]>([]);
    const [teachers, setteachers] = useState<Teacher[]>([]);

    useEffect(() => {
        getSubjects()
            .then(res => {
                setallSubs(res)
            })
            .catch(err => {
                console.log(err);
            })

        getClassNames()
            .then(res => {
                setclasses(res)
            })
            .catch(err => {
                console.log(err);
            })

        getTeachers()
            .then(res => {
                setteachers(res.filter(item => item.$loki !== data.$loki))
            })

        if (data.subjects) {
            setchooseSubjects([...data?.subjects])
        }


    }, [])

    console.log(chooseSubjects);

    const handleSave = () => {
        const teacherTemp = { ...data };
        teacherTemp.subjects = chooseSubjects;
        updateTeacher(teacherTemp)
            .then(res => {
                setData(teacherTemp);
                toast.success(t('successfullyAdded'));
                setshowModal(false);
            })
            .catch(err => {
                toast.error(t('operationFailed'))
            })
    }

    const checkResClassSubject = () => {
        if (data.resClassName) {
            const totalCoefficientsOfSub = chooseSubjects.filter(sub => sub.className.$loki === data.resClassName.$loki)
                .reduce((a, b) => a + b.coefficient, 0);
            return totalCoefficientsOfSub < 6
        }
        return false;

    }


    return (
        <div>

            <Modal show={showModal} modalClose={() => setshowModal(false)} >
                <div className=' display_flex flex_direction_column align_items_center'>
                    <p className='title'>{t('add')} {t('subject')}</p>
                    <div className='display_flex flex_direction_column overflow_x_scroll  margin_bottom_10 border_1px_solid full_width padding_10'>
                        {classes.map(cls => {
                            return (
                                <div key={cls.name}>
                                    <p>{cls.name}:</p>
                                    <div className='display_flex '>
                                        {allSubs
                                            .filter(item => item.className.$loki === cls.$loki)
                                            .map(sub => {
                                                const isAv = teachers.filter(teacher => teacher?.subjects?.some(ts => ts.$loki === sub.$loki)).length > 0
                                                return (
                                                    <div
                                                        key={sub.className + sub.name}
                                                        className='display_flex align_items_center margin_5 border_1px_solid'
                                                        style={{
                                                            padding: '0 4px',
                                                            background: isAv ? 'red' : ''
                                                        }}
                                                    >
                                                        <label htmlFor="">{sub.name}</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={chooseSubjects.some(cs => cs.$loki === sub.$loki)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setchooseSubjects([...chooseSubjects, sub])
                                                                } else {
                                                                    const temp = [...chooseSubjects];
                                                                    const ind = temp.findIndex(cs => cs.$loki === sub.$loki);
                                                                    temp.splice(ind, 1);
                                                                    setchooseSubjects(temp)
                                                                }
                                                            }}
                                                            disabled={isAv}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    <Button
                        text={t('save')}
                        onClick={handleSave}
                    />
                </div>
            </Modal>

            <div className='display_flex justify_content_space_between'>
                <Button
                    text={t('add')}
                    onClick={() => setshowModal(true)}
                />
                <div className='input'><span>{t('totalHours')}: </span>{data.subjects.reduce((a, b) => a + b.coefficient, 0)}</div>
            </div>

            {checkResClassSubject() &&
                <div className='warning padding_10 margin_top_20'
                    style={{ background: 'red', color: '#fff' }}

                >
                    <span className='bold'>{t('note')}: </span>
                    <span>{t('teacherInResClassIsNotEnough')}</span>
                </div>
            }
            <table className='custom_table full_width margin_top_20'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('name')}</th>
                        <th>{t('name')} {t('className')}</th>
                        <th>{t('coefficient')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.subjects?.map((sub, i) => {
                        return (<tr>
                            <td>{i + 1}</td>
                            <td>{sub.name}</td>
                            <td>{sub.className.name}</td>
                            <td>{sub.coefficient}</td>
                            <td>
                                <Button
                                    icon={ICONS.trashFill}
                                    btnType={BtnTypes.danger}
                                    onClick={() => {
                                        const temp = { ...data };
                                        temp.subjects.splice(i, 1);
                                        updateTeacher(temp)
                                            .then(res => {
                                                setData(temp);
                                                toast.success(t("successfullyDeleted"))
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                toast.error(t('operationFailed'))
                                            })
                                    }}
                                />
                            </td>
                        </tr>)
                    })}

                </tbody>
            </table>
        </div>
    )
}

export default TeacherSubject