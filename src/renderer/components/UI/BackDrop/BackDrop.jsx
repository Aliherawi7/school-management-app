import "./BackDrop.css"

import React from "react"

const BackDrop = (props) => {
  return props.show ? (
    <div className="backdrop fade_in" onClick={props.closeModal}>
      {props.children}
    </div>
  ) : null
}

export default BackDrop
