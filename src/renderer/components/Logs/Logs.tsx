import React, { useState } from 'react'

import AllLogs from './AllLogs/AllLogs';
import Circle from '../UI/Loading/Circle';
import DailyLogs from './DailyLogs/DailyLogs';
import NotFound from '../../pages/NotFound/NotFound';
import Roles from '../../constants/Roles';
import { SystemSections } from '../../constants/Others';
import TabMenu from '../UI/TabMenu/TabMenu';
import { t } from 'i18next';
import { useStateValue } from '../../context/StateProvider';

// components for tabs
const components = {
    DailyLogs: {
        componentName: "DailyLogs",
        component: DailyLogs,
    },
    AllLogs: { componentName: "AllLogs", component: AllLogs },
};
const Logs: React.FC = () => {

    const [displayComponent, setDisplayComponent] = useState(
        { component: components.DailyLogs.component, componentName: components.DailyLogs.componentName }
    );


    return (
        <div>
            <TabMenu>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.DailyLogs?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent({ component: components?.DailyLogs.component, componentName: components.DailyLogs.componentName })}
                >
                    {t("dailyEvents")}
                </li>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.AllLogs?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent({ component: components?.AllLogs.component, componentName: components.AllLogs.componentName })}
                >
                    {t('events')}
                </li>
            </TabMenu>

            <div>
                {<displayComponent.component />}
            </div>
        </div>
    )
}

export default Logs