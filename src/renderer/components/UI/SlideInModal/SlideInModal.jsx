import "./SlideInModal.css";

import React from "react";

const SlideInModal = ({ show, children }) => {
  if (!show) return null;

  return (
    <div className="slide_in_modal left-to-right position_relative">
      <div className="slide_in_modal_children">{children}</div>
    </div>
  );
};

export default SlideInModal;
