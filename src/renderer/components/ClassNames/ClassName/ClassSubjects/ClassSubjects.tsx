import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ClassName, Subject } from '../../../../Types/Types';
import { addSubject, deleteSubject, getSubjectsByclassId, updateSubject } from '../../../../Utils/DBService';
import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/modal/Modal';
import ICONS from '../../../../constants/Icons';
import { toast } from 'react-toastify';
import BtnTypes from '../../../../constants/BtnTypes';

interface prop {
    data: ClassName,
    setData: Function
}
export const ClassSubjects: React.FC<prop> = ({ data, setData }) => {
    const { classNameId } = useParams();
    const [showModal, setshowModal] = useState(false);
    const [subject, setsubject] = useState<Subject>({
        className: data,
        name: '',
        coefficient: 1,
    })
    const [subjects, setsubjects] = useState<Subject[]>([]);


    useEffect(() => {
        getSubjectsByclassId(Number(classNameId))
            .then(res => {
                setsubjects(res);
            })
            .catch(err => console.log(err))

    }, [classNameId])

    const handleSave = () => {

        if (subject.name && subject.coefficient) {
            if (subject.$loki) {
                updateSubject(subject)
                    .then(res => {
                        const temp = [...subjects];
                        const index = temp.findIndex(item => item.$loki === subject.$loki);
                        temp[index] = res;
                        setsubjects(temp)
                        toast.success(t('successfullyAdded'));
                        setsubject({ ...subject, name: '', coefficient: NaN })
                        setshowModal(false)
                    })
                    .catch(err => {
                        console.log(err);

                    })
            }
            addSubject(subject)
                .then(res => {
                    setsubjects([...subjects, res])
                    toast.success(t('successfullyAdded'));
                    setsubject({ ...subject, name: '', coefficient: NaN })
                    setshowModal(false)
                })
                .catch(err => {
                    console.log(err);

                })
            return;
        }
        toast.error(t('fillTheBoxed'))
        console.log(subject);

    }

    return (
        <div>


            <Modal show={showModal} modalClose={() => setshowModal(false)}>
                <div className='display_flex flex_direction_column align_items_center'>
                    <p className='title'>{t('add')} {t('subject')}</p>
                    <div className='display_flex margin_top_20 margin_bottom_10'>
                        <div className='margin_10'>
                            <label htmlFor="">{t('name')}: </label>
                            <input
                                type="text"
                                value={subject.name}
                                autoFocus
                                onChange={e => setsubject({ ...subject, name: e.target.value })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('coefficient')}: </label>
                            <input
                                type="number"
                                value={subject.coefficient}
                                onChange={e => setsubject({ ...subject, coefficient: Number(e.target.value) })}
                            />
                        </div>
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
                <div className='input'>
                    <span>{t('collection')} {t('coefficient')}: </span>
                    <span>{subjects.reduce((a, b) => a + b.coefficient, 0)}</span>
                </div>
            </div>
            <div>
                <table className='custom_table full_width'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('name')}</th>
                            <th>{t('coefficient')}</th>
                            <th>{t('id')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects?.map((sub, index) => {
                            return (<tr>
                                <td>{index + 1}</td>
                                <td>{sub.name}</td>
                                <td>{sub.coefficient}</td>
                                <td>{sub.$loki}</td>
                                <td>
                                    <div className='display_flex justify_content_center'>
                                        <Button
                                            icon={ICONS.pencil}
                                            onClick={() => {
                                                setsubject(sub);
                                                setshowModal(true);
                                            }}
                                            btnType={BtnTypes.success}
                                        />
                                        <Button
                                            icon={ICONS.trashFill}
                                            btnType={BtnTypes.danger}
                                            onClick={() => {
                                                deleteSubject(sub)
                                                    .then(res => {
                                                        const temp = [...subjects]
                                                        temp.splice(index, 1);
                                                        setsubjects(temp);
                                                        toast.success(t("successfullyDeleted"))
                                                    })
                                                    .catch(err => {
                                                        toast.error(t('operationFialed'))
                                                    })
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
