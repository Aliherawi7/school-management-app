import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import { pageSizes } from '../../../constants/Others';
import { Log } from '../../../Types/Types';
import { convertToJalali } from '../../../Utils/DateTimeUtils';
import { getLogs } from '../../../Utils/DBService';
import HeadingLoadingTemplate from '../../UI/LoadingTemplate/HeadingLoadingTemplate';
import LoadingTemplateContainer from '../../UI/LoadingTemplate/LoadingTemplateContainer';
import Pagination from '../../UI/Pagination/Pagination';

const AllLogs: React.FC = () => {
    const [loading, setloading] = useState<boolean>(false)
    const [logs, setlogs] = useState<Log[]>([]);
    // const [filtered, setFiltered] = useState<Log[]>([])
    // const [range, setrange] = useState<Date[]>([])
    const [pageSize, setPageSize] = useState<number>(pageSizes[0])
    const [totalPages, setTotalPages] = useState<number>()
    // const [totalDocuments, setTotalDocuments] = useState<number>(0); // Total number of documents

    useEffect(() => {
        getLogs()
            .then(res => {
                setlogs(res)
            })
    }, []);








    return (
        <div className=''>
            {/* <div className='display_flex justify_content_center align_items_center full_width margin_top_20 margin_bottom_10'>
                <CustomDatePicker
                    range
                    onChange={(e: any) => setrange(e)}
                    placeholder={t('chooseDatePeriod')}
                />
                <Button
                    text={t('apply')}
                    onClick={getLogsInDatePeriod}
                />
            </div> */}

            <div className='search_pagination display_flex flex_flow_wrap justify_content_space_between input align_items_center'>
                <div className='pagination display_flex '>
                    <div className='display_flex align_items_center '>
                        <label htmlFor="pageSize">{t('size')}</label>
                        <select
                            name="pageSize"
                            id="pageSize"
                            className='input margin_left_10 margin_right_10'
                            onChange={e => {
                                setPageSize(Number(e.target.value))
                            }}
                        >
                            {pageSizes.map(num => {
                                return <option value={num} key={num}>{num}</option>
                            })}
                        </select>
                        <Tooltip
                            anchorSelect="#pageSize"
                            place="top"
                            className="toolTip_style"
                        >
                            {t("numberOfElementPerPage")}
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className='display_flex justify_content_center full_width overflow_x_scroll'>
                {loading ?
                    <LoadingTemplateContainer>
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                        <HeadingLoadingTemplate />
                    </LoadingTemplateContainer>
                    :
                    <table className='custom_table full_width'>
                        <thead>
                            <tr>
                                <th colSpan={5}>{t('dailyEvents')}</th>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>{t('title')}</th>
                                <th>{t('message')}</th>
                                <th>{t('registrar')}</th>
                                <th>{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.message}</td>
                                        <td>{item.registrar}</td>
                                        <td>
                                            <span className='bullet'>
                                                {convertToJalali(item.createdDate)}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            {logs.length === 0 && <tr><td colSpan={5}>{t('notExist')}</td></tr>}
                        </tbody>
                    </table>
                }

            </div>
        </div>
    )
}

export default AllLogs