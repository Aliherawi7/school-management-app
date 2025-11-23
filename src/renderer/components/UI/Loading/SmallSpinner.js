import "./SmallSpinner.css"

import React from "react"

const SmallSpinner = ({ visibility = false }) => {
  return (
    <div className="sm_ring" style={{
      visibility: visibility ? 'visible' : 'hidden'
    }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default SmallSpinner
