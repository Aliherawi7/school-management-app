import './Configuration.css';

import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { updateSystemConfig } from '../../../Utils/DBService';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/modal/Modal';

const modelType = {
  heightModel: 'heightModel',
  sleeveModel: 'sleeveModel',
  cuffsModel: 'cuffsModel',
  pantsModel: 'pantsModel',
  tailFootModel: 'tailFootModel'
}

function ConfigurationQuick({ config }) {

  const [modalShow, setmodalShow] = useState(false)
  const [modelform, setmodelform] = useState({
    name: '',
    type: modelType.heightModel
  })



  const closeModal = () => {
    setmodalShow(!modalShow)
  }

  const saveData = async () => {
    const temp = { ...config };

    if (!temp?.sewModels[modelform.type]) {
      temp.sewModels[modelform.type] = [modelform.name];
    } else {
      temp.sewModels[modelform.type].push(modelform.name);
    }


    updateSystemConfig(temp)
      .then(res => {
        toast.success(t('successfullyAdded'))
        closeModal()
      }).catch(err => {
        toast.error(t("operationFaild"))
      })

  }

  return (
    <div>
      <h1 className='title'>{t('configuration')}</h1>
      <div className='margin_top_20 display_flex'>
        <Button
          text={t('add')}
          onClick={closeModal}
        />
      </div>

      <div className='input margin_top_20'>
        <p className=''>مدل ها</p>

        {config?.sewModels && Object.keys(config?.sewModels)?.map((key, ind) => {
          return (<div className='input margin_top_5' key={ind}>
            <p className='bold title_2'>{t(key)}</p>
            <div className='display_flex'>
              {config?.sewModels[key].map((name, index) => {
                return <div className='model_box' key={name + index}>
                  {name}
                </div>
              })}
            </div>

          </div>)

        })}

      </div>

      <Modal show={modalShow} modalClose={closeModal} >
        <p className='title_2'>{t('add')} {t('model')}</p>
        <div className='display_flex flex_direction_column align_items_center margin_top_20'>
          <div className='display_flex'>
            <div className='display_flex flex_direction_column'>
              <label htmlFor="">{t('name')}</label>
              <input
                type="text"
                className='input'
                onChange={(e) => setmodelform({ ...modelform, name: e.target.value })}
              />
            </div>
            <div className='display_flex flex_direction_column margin_right_20'>
              <label htmlFor="">{t('type')} {t('model')}</label>
              <select
                name=""
                id=""
                className='input'
                onChange={(e) => setmodelform({ ...modelform, type: e.target.value })}
              >
                <option value={t('type')}>
                  {t('type')}
                </option>
                {Object.keys(modelType).map(key => {
                  return <option key={key} value={modelType[key]}>{t(modelType[key])}</option>
                })}
              </select>
            </div>
          </div>

          <div className='display_flex margin_top_20'>
            <Button text={t('save')} onClick={saveData} />
            <Button text={t('cancel')} onClick={closeModal} />
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default ConfigurationQuick;
