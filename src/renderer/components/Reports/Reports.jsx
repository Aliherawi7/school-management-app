import { t } from 'i18next';
import React from 'react';

import { useStateValue } from '../../context/StateProvider';
import usePersistentComponent from '../../Hooks/usePersistentComponent';
import TabMenu from '../UI/TabMenu/TabMenu';
import ConsumptionsReport from './ConsumptionsReport/ConsumptionsReport';
import GeneralReports from './GeneralReports/GeneralReports';

const components = {
    ConsumptionsReport: { componentName: "ConsumptionsReport", component: ConsumptionsReport },
    GeneralReports: { componentName: "GeneralReports", component: GeneralReports },
};

function Reports() {
    const [displayComponent, setDisplayComponent] = usePersistentComponent(components, components.ConsumptionsReport.componentName);
    const [{ authentication },] = useStateValue();


    return (
        <div>

            {/* the navbar of the profile page */}

            <TabMenu>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.ConsumptionsReport?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.ConsumptionsReport)}
                >
                    {t('consumptions')}
                </li>
            </TabMenu>

            <div>
                {<displayComponent.component />}
            </div>
        </div >
    )
}

export default Reports