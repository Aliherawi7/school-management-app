import "./ButtonLoading.css"

import React from "react"

const Spinner = () => {
  return (
    <div className="lds-ring gen-loading" >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Spinner
