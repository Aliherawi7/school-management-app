import ICONS from '../../../constants/Icons'
import React from 'react'

function MoneyStatus({ number, noStyle = false }) {
    if (Number(number).toFixed(0) == 0) return null

    return (
        <span
            className='border_radius_50 margin_5 '
            style={noStyle ? {} : {
                backgroundColor: number > 0 ? 'red' : 'greenyellow',
                width: '20px',
                height: '20px',
                textAlign: 'center',
                display: 'inline-block'
            }}
        >

            <i className={number > 0 ? ICONS.dash : ICONS.plus}
                style={noStyle ? { color: number > 0 ? 'red' : 'green' } : {}}
            ></i>
        </span>
    )
}

export default MoneyStatus