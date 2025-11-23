import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BtnTypes from '../../constants/BtnTypes';
import { ClassName } from '../../Types/Types';
import { addClassName, getClassNames } from '../../Utils/DBService';
import Button from '../UI/Button/Button';
import ButtonLoadingTemplate from '../UI/LoadingTemplate/ButtonLoadingTemplate';
import HeadingMenuTemplate from '../UI/LoadingTemplate/HeadingMenuTemplate';
import LoadingTemplateContainer from '../UI/LoadingTemplate/LoadingTemplateContainer';
import ShotLoadingTemplate from '../UI/LoadingTemplate/ShotLoadingTemplate';
import Modal from '../UI/modal/Modal';
import { toast } from 'react-toastify';


function ClassNames() {
    const nav = useNavigate();
    // const [searchValue, setsearchValue] = useState('');
    const [loading, setloading] = useState(true);
    const [classNames, setClassNames] = useState<ClassName[]>([]);
    const [showModal, setshowModal] = useState(false);
    const [className, setclassName] = useState<ClassName>({
        name: "",
        number: NaN,
        createdDate: new Date(),
        totalHours: 5,
    })

    useEffect(() => {
        getClassNames()
            .then(res => {
                setClassNames(res)
            })
            .finally(() => {
                setloading(false)
            })
    }, [])

    const handleSave = () => {
        if (className.name && className.number) {
            addClassName(className)
                .then(res => {
                    setClassNames([...classNames, res])
                    setshowModal(false);
                    toast.success(t("successfullyAdded"));
                    setclassName({ name: '', number: NaN, createdDate: new Date() })
                }).catch(err => {
                    console.log(err);
                    toast.error(t("operaionFailed"))

                })
            return;
        }
        toast.error(t('fillTheBoxed'))

    }



    if (!classNames) {
        return (
            <LoadingTemplateContainer>
                <ButtonLoadingTemplate />
                <HeadingMenuTemplate />
            </LoadingTemplateContainer>
        );
    }


    return (
        <div >
            <Button
                text={t('add') + " " + t('className')}
                onClick={() => setshowModal(true)}
                btnType={BtnTypes.standard}
            />

            <Modal show={showModal} modalClose={() => setshowModal(false)}>
                <div className='display_flex flex_direction_column align_items_center'>
                    <p className='title'>{t('add')} {t("className")}</p>
                    <div className='display_flex margin_top_20 margin_bottom_10'>
                        <div className='margin_10'>
                            <label htmlFor="">{t('name')}: </label>
                            <input
                                type="text"
                                value={className.name}
                                onChange={e => setclassName({ ...className, name: e.target.value })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('number')}: </label>
                            <input
                                type="number"
                                className='input'
                                value={className.number}
                                max={12} min={1}
                                onChange={e => setclassName({ ...className, number: Number(e.target.value) })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('totalHours')}: </label>
                            <input
                                type="number"
                                className='input'
                                value={className.totalHours}
                                max={12} min={1}
                                onChange={e => setclassName({ ...className, totalHours: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <Button
                        text={t("save")}
                        onClick={handleSave}
                    />
                </div>
            </Modal>

            <div className='table_container margin_top_20'>
                {loading ? <ShotLoadingTemplate /> :
                    <table className="full_width custom_table table_row_hover overflow_hidden">
                        <thead >
                            <tr><th colSpan={5}>{t('classNames')}</th></tr>
                            <tr>
                                <th>#</th>
                                <th>{t('name')}</th>
                                <th>{t('number')}</th>
                                <th>{t('totalHours')}</th>
                                <th>{t('id')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classNames?.map((emp, index) => {
                                return <tr
                                    className=" cursor_pointer hover"
                                    onClick={() => nav('/classNames/' + emp.$loki)}
                                    key={emp.$loki}
                                >
                                    <td>{index + 1}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.number}</td>
                                    <td>{emp.totalHours}</td>
                                    <td>{emp.$loki}</td>
                                </tr>
                            })
                            }
                            {classNames?.length === 0 && <tr>
                                <td colSpan={4}>{t('notExist')}</td>
                            </tr>}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}




export default ClassNames