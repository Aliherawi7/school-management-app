import { t } from 'i18next';
import React, { useState } from 'react';

import TabMenu from '../UI/TabMenu/TabMenu';
import DailyConsumptions from './DailyConsumptions/DailyConsumptions';
import ConsumptionsManagement from './ConsumptionsManagement/ConsumptionsManagement';
import ConsumptionsConfig from './ConsumptionsConfig/ConsumptionsConfig';

// components for tabs
const components = {
    DailyConsumptions: { componentName: 'DailyConsumptions', component: DailyConsumptions },
    ConsumptionsManagement: { componentName: "ConsumptionsManagement", component: ConsumptionsManagement, },
    Configuration: { componentName: "Configuration", component: ConsumptionsConfig, },
};
function Consumptions() {
    const [displayComponent, setDisplayComponent] = useState(components.DailyConsumptions);

    return (
        <div>

            {/* the navbar of the profile page */}

            <TabMenu>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.DailyConsumptions?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.DailyConsumptions)}
                >
                    {t("dailyConsumptions")}
                </li>

                <li
                    className={
                        displayComponent?.componentName ===
                            components?.ConsumptionsManagement?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.ConsumptionsManagement)}
                >
                    {t('consumptionsManagement')}
                </li>
                <li
                    className={
                        displayComponent?.componentName ===
                            components?.Configuration?.componentName
                            ? "active"
                            : ""
                    }
                    onClick={() => setDisplayComponent(components?.Configuration)}
                >
                    {t('configuration')}
                </li>

            </TabMenu>

            <div>
                {<displayComponent.component />}
            </div>
        </div>
    )
}

export default Consumptions