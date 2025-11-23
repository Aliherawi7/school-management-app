import './Modal.css';

import React from 'react';

import ICONS from '../../../constants/Icons';
import Button from '../Button/Button';
import BtnTypes from '../../../constants/BtnTypes';

export default function Modal({ show, modalClose, children }) {
  if (!show) return null;

  return (
    <>
      <div className="modal_backdrop display_flex align_items_center justify_content_center" >
        <div className="modal top_to_center" onClick={e => e.stopPropagation()}>
          <div onClick={modalClose} className={"close_modal cursor_pointer "}>
            <span
              className='close_btn'
              onClick={modalClose}
            >
              <i className={ICONS.cross}></i>
            </span>

          </div>
          <div className="modal_children ">{children}</div>
        </div>
      </div>

    </>
  );
}
