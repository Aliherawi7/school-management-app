import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import ICONS from '../../../constants/Icons.js';
import { actionTypes } from '../../../context/reducer.js';
import { useStateValue } from '../../../context/StateProvider.js';
import usePersistentComponent from '../../../Hooks/usePersistentComponent.js';
import { addLog, deleteTeacher, getTeacherById } from '../../../Utils/DBService.ts';
import Button from '../../UI/Button/Button.tsx';
import AvatarLoadingTemplate from '../../UI/LoadingTemplate/AvatarLoadingTemplate.jsx';
import ButtonLoadingTemplate from '../../UI/LoadingTemplate/ButtonLoadingTemplate.jsx';
import HeadingMenuTemplate from '../../UI/LoadingTemplate/HeadingMenuTemplate.jsx';
import LoadingTemplateContainer from '../../UI/LoadingTemplate/LoadingTemplateContainer.jsx';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate.jsx';
import Menu from '../../UI/Menu/Menu.jsx';
import TabMenu from '../../UI/TabMenu/TabMenu.jsx';
import PersonalInformation from './PersonalInformation/PersonalInformation.tsx';
import TeacherSubject from './TeacherSubject/TeacherSubject.tsx';
import TeacherSchedule from './TeacherSchedule/TeacherSchedule.tsx';

// components for tabs
const components = {
    PersonalInformation: {
        componentName: "PersonalInformation",
        component: PersonalInformation,
    },
    Subjects: {
        componentName: "Subjects",
        component: TeacherSubject,
    },
    Schedule: {
        componentName: "Schedule",
        component: TeacherSchedule,
    },
};


function Teacher() {
    const { teacherId } = useParams();
    const [{ authentication }, dispatch] = useStateValue()
    const navigate = useNavigate();
    const [teacher, setteacher] = useState()
    const [displayComponent, setDisplayComponent] = usePersistentComponent(
        components,
        components.PersonalInformation.componentName
    );

    useEffect(() => {
        getTeacherById(Number(teacherId))
            .then(res => {
                setteacher(res)
            })
            .catch(err => {
                console.log(err);
            })
    }, [teacherId])

    const showDeleteModal = () => {
        dispatch({
            type: actionTypes.SHOW_ASKING_MODAL,
            payload: {
                show: true,
                message: "deleteMessage",
                btnAction: removeTeacher,
                id: teacherId,
            },
        });
    };

    const removeTeacher = async () => {
        dispatch({
            type: actionTypes.SET_GLOBAL_LOADING,
            payload: { value: true },
        });
        dispatch({
            type: actionTypes.HIDE_ASKING_MODAL,
        });

        deleteTeacher(teacher)
            .then(res => {
                navigate("/teachers");
                toast.success('successfullyDeleted')
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                dispatch({
                    type: actionTypes.SET_GLOBAL_LOADING,
                    payload: { value: false },
                });
            })

    };


    if (!teacher) {
        return (
            <LoadingTemplateContainer>
                <LoadingTemplateContainer className="display_flex justify_content_space_between align_items_center">
                    <ButtonLoadingTemplate />
                    <AvatarLoadingTemplate size="xlarge" />
                </LoadingTemplateContainer>
                <HeadingMenuTemplate />
                <ShotLoadingTemplate />
            </LoadingTemplateContainer>
        );
    }

    return (
        <div className='teacher'>
            <section className="profile_header display_flex justify_content_space_between">
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
                            navigate("update")
                        }
                    />
                </Menu>

                {/* User Profile Image */}
                <div className=" display_flex align_items_center" >
                    <h1 className='margin_right_10 margin_left_10'>
                        {teacher?.name}{" "}
                        {teacher?.lastName}
                    </h1>
                    {/* <DisplayLogo imgURL={imageURL} /> */}
                </div>
            </section>


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
                            components?.Subjects?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.Subjects)}
                >
                    {t("subjects")}
                </li>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.Schedule?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.Schedule)}
                >
                    {t("schedule")}
                </li>
            </TabMenu>

            <div>
                {<displayComponent.component data={teacher} setData={setteacher} />}
            </div>

        </div>
    )
}

export default Teacher