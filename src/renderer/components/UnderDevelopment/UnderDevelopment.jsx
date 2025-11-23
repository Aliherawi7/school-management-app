import React from 'react'
import vg from "./Full_Cycle_Custom_Development.svg"
import './UnderDevelopment.css'
const UnderDevelopment = () => {
    return (
        <section className='under_development'>
            <div class="container">
                <img src={vg} alt="" className='svg-icon' />
                <h1>Under Development</h1>
                <p>در حال توسعه</p>
            </div>
        </section>
    )
}

export default UnderDevelopment