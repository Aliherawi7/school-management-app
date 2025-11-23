import "./Pagination.css"
import React from 'react'
import Button from "../Button/Button"
import ICONS from '../../../constants/Icons'
import { Tooltip } from 'react-tooltip'
import { t } from 'i18next'
import { useStateValue } from "../../../context/StateProvider"

function Pagination({ nextPage, prevPage, total, currentPage, isPrevPageAvailable = false }) {


    const [{ locale },] = useStateValue()


    return (
        <div className='display_flex align_items_center  width_max_content'>
            <Button
                icon={locale === "en" ? ICONS.chevronLeft : ICONS.chevronRight}
                onClick={isPrevPageAvailable ? prevPage : null}
                id={'prevPage'}
            />
            <Tooltip
                anchorSelect="#prevPage"
                place="top"
                className="toolTip_style"
            >
                {t("page")} {t("prev")}
            </Tooltip>
            <span className='margin_10'>{currentPage}</span>
            <span className='margin_10'>{t('of')}</span>
            <span className='margin_10'>{total}</span>
            <Button icon={locale === "en" ? ICONS.chevronRight : ICONS.chevronLeft} onClick={nextPage} id={'nextPage'} />
            <Tooltip
                anchorSelect="#nextPage"
                place="top"
                className="toolTip_style"
            >
                {t("page")} {t("next")}
            </Tooltip>
        </div>
    )
}

export default Pagination