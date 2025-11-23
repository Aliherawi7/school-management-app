import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BtnTypes from '../../constants/BtnTypes.js';
import { Teacher } from '../../Types/Types.ts';
import { getTeachers } from '../../Utils/DBService.ts';
import Button from '../UI/Button/Button.tsx';
import ButtonLoadingTemplate from '../UI/LoadingTemplate/ButtonLoadingTemplate.jsx';
import HeadingMenuTemplate from '../UI/LoadingTemplate/HeadingMenuTemplate.jsx';
import LoadingTemplateContainer from '../UI/LoadingTemplate/LoadingTemplateContainer.jsx';
import ShotLoadingTemplate from '../UI/LoadingTemplate/ShotLoadingTemplate.jsx';

const Teachers: React.FC = () => {
  const nav = useNavigate();
  // const [{ authentication },] = useStateValue()
  const [teachers, setTeachers] = useState<Teacher[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeachers()
      .then(res => setTeachers(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))

  }, []);


  if (loading) {
    return (
      <LoadingTemplateContainer>
        <ButtonLoadingTemplate />
        <HeadingMenuTemplate />
        <ShotLoadingTemplate />
      </LoadingTemplateContainer>
    );
  }


  return (
    <div>
      <Button
        text={t('add') + " " + t('teacher')}
        onClick={() => nav("add-Teacher")}
        btnType={BtnTypes.standard}
      />

      <div className='table_container  margin_top_20'>
        <table className="full_width custom_table table_row_hover">
          <thead >
            <tr><th colSpan={5}>{t('teachers')}</th></tr>
            <tr>
              <th>#</th>
              <th>{t('name')}</th>
              <th>{t('lastName')}</th>
              <th>{t('phoneNumber')}</th>
              <th>{t('className')}</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map((emp, index) => {
              return <tr
                className=" cursor_pointer hover"
                onClick={() => nav(`${emp.$loki}`)}
                key={emp.id}
              >
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.lastName}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.resClassName ? emp.resClassName.name : ""}</td>
              </tr>
            })
            }
            {teachers?.length === 0 &&
              <tr>
                <td colSpan={6}>{t('notExist')}</td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}



export default Teachers