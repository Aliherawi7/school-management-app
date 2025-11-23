import "./ModalBottom.css";

import ICONS from "../../../constants/Icons";
import React from "react";

const ModalBottom = ({ show, close, children }) => {
  if (!show) return null;

  return (
    <div className="modal_bottom_backdrop">
      <div className="bottom-to-top">
        <div onClick={close} className="modal_bottom_colse cursor_pointer">
          <i className={ICONS.cross}></i>
        </div>
        <div className="modal_bottom">
          <div className="modal_bottom_children">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalBottom;
