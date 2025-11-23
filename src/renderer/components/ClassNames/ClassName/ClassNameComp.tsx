import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ICONS from '../../../constants/Icons.js';
import { actionTypes } from '../../../context/reducer.js';
import { useStateValue } from '../../../context/StateProvider.js';
import usePersistentComponent from '../../../Hooks/usePersistentComponent.js';
import NotFound from '../../../pages/NotFound/NotFound.jsx';
import { addClassName, deleteClassName, getClassNameById, updateClassName } from '../../../Utils/DBService.ts';
import Button from '../../UI/Button/Button.tsx';
import AvatarLoadingTemplate from '../../UI/LoadingTemplate/AvatarLoadingTemplate.jsx';
import ButtonLoadingTemplate from '../../UI/LoadingTemplate/ButtonLoadingTemplate.jsx';
import HeadingMenuTemplate from '../../UI/LoadingTemplate/HeadingMenuTemplate.jsx';
import LoadingTemplateContainer from '../../UI/LoadingTemplate/LoadingTemplateContainer.jsx';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate.jsx';
import Menu from '../../UI/Menu/Menu.jsx';
import TabMenu from '../../UI/TabMenu/TabMenu.jsx';
import ClassNameInfo from './ClassNameInfo/ClassNameInfo.jsx';
import ClassNameSchedule from './ClassNameSchedule/ClassNameSchedule.tsx';
import { ClassSubjects } from './ClassSubjects/ClassSubjects.tsx';
import { ClassName } from '../../../Types/Types.ts';
import Modal from '../../UI/modal/Modal.jsx';
import { toast } from 'react-toastify';

// components for tabs
const components = {
    PersonalInformation: { componentName: "PersonalInformation", component: ClassNameInfo, },
    ClassSubjects: { componentName: "ClassSubjects", component: ClassSubjects },
    ClassNameSchedule: { componentName: "ClassNameSchedule", component: ClassNameSchedule },

};


function ClassNameComp() {
    const { classNameId } = useParams();
    const [, dispatch] = useStateValue()
    const navigate = useNavigate();
    const [className, setClassName] = useState<ClassName>()
    const [displayComponent, setDisplayComponent] = usePersistentComponent(components, components.PersonalInformation.componentName);
    const [showModal, setshowModal] = useState(false);



    useEffect(() => {
        if (classNameId)
            getClassNameById(Number(classNameId))
                .then(res => setClassName(res))
                .catch(err => console.log(err))

    }, [classNameId])

    const showDeleteModal = () => {
        dispatch({
            type: actionTypes.SHOW_ASKING_MODAL,
            payload: {
                show: true,
                message: "deleteMessage",
                btnAction: removeEmployee,
                id: classNameId,
            },
        });
    };


    const removeEmployee = async () => {
        dispatch({
            type: actionTypes.SET_GLOBAL_LOADING,
            payload: { value: true },
        });
        dispatch({
            type: actionTypes.HIDE_ASKING_MODAL,
        });
        deleteClassName(className)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            }).finally(() => {
                dispatch({
                    type: actionTypes.SET_GLOBAL_LOADING,
                    payload: { value: false },
                });
            })
    };

    const handleSave = () => {
        if (className?.name && className?.number) {
            updateClassName(className)
                .then(res => {
                    setClassName(res)
                    setshowModal(false);
                    toast.success(t("successfullyUpdated"));
                }).catch(err => {
                    console.log(err);
                    toast.error(t("operaionFailed"))

                })
            return;
        }
        toast.error(t('fillTheBoxed'))

    }


    if (!className) {
        return (
            <LoadingTemplateContainer>
                <LoadingTemplateContainer className="display_flex justify_content_space_between align_items_center ">
                    <ButtonLoadingTemplate />
                    <AvatarLoadingTemplate size="xlarge" />
                </LoadingTemplateContainer>
                <HeadingMenuTemplate />
                <ShotLoadingTemplate />
            </LoadingTemplateContainer>
        );
    }

    return (
        <div className=''>
            <section
                className={`profile_header display_flex justify_content_space_between `}>
                {/* Profile Menu */}
                <Menu >
                    <Button
                        icon={ICONS.trash}
                        text={t("delete")}
                        onClick={showDeleteModal}
                    />
                    <Button
                        icon={ICONS.edit}
                        text={t("updateInformation")}
                        onClick={() =>
                            setshowModal(true)
                        }
                    />
                </Menu>
                {/* User Profile Image */}
                <div className=" display_flex align_items_center" >
                    <h1 className='margin_right_10 margin_left_10'> {className?.name}</h1>
                </div>
            </section>


            <Modal show={showModal} modalClose={() => setshowModal(false)}>
                <div className='display_flex flex_direction_column align_items_center'>
                    <p className='title'>{t('add')} {t("className")}</p>
                    <div className='display_flex margin_top_20 margin_bottom_10'>
                        <div className='margin_10'>
                            <label htmlFor="">{t('name')}: </label>
                            <input
                                type="text"
                                value={className.name}
                                onChange={e => setClassName({ ...className, name: e.target.value })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('number')}: </label>
                            <input
                                type="number"
                                className='input'
                                value={className.number}
                                max={12} min={1}
                                onChange={e => setClassName({ ...className, number: Number(e.target.value) })}
                            />
                        </div>
                        <div className='margin_10'>
                            <label htmlFor="">{t('totalHours')}: </label>
                            <input
                                type="number"
                                className='input'
                                value={className.totalHours}
                                max={12} min={1}
                                onChange={e => setClassName({ ...className, totalHours: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <Button
                        text={t("save")}
                        onClick={handleSave}
                    />
                </div>
            </Modal>

            {/* the navbar of the profile page */}

            <TabMenu>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.PersonalInformation?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.PersonalInformation)}
                >
                    {t("personalInformation")}
                </li>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.ClassSubjects?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.ClassSubjects)}
                >
                    {t('subjects')}
                </li>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.ClassNameSchedule?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.ClassNameSchedule)}
                >
                    {t('classNameSchedule')}
                </li>
            </TabMenu>

            <div>
                {<displayComponent.component data={className} />}
            </div>

        </div >
    )
}

export default ClassNameComp