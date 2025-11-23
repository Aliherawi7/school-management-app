import { t } from 'i18next';
import React from 'react';

import usePersistentComponent from '../../Hooks/usePersistentComponent';
import TabMenu from '../UI/TabMenu/TabMenu';
import AccountSettings from './AccountSettings/AccountSettings';
import Configuration from './Configuration/Configuration';
const components = {
  accountSettings: { componentName: "AccountSettings", component: AccountSettings },
  Configuration: { componentName: "Configuration", component: Configuration },
};

function Settings() {

  const [displayComponent, setDisplayComponent] = usePersistentComponent(
    components,
    "accountSettings"
  );


  return (
    <div className="settings " id="settings">
      <TabMenu>
        <li
          className={
            displayComponent?.componentName === components?.accountSettings?.componentName
              ? "active"
              : ""
          }
          onClick={() => setDisplayComponent(components?.accountSettings)}
        >
          {t("accountSettings")}
        </li>
        <li
          className={
            displayComponent?.componentName === components?.ServicesManagement?.componentName
              ? "active"
              : ""
          }
          onClick={() => setDisplayComponent(components?.ServicesManagement)}
        >
          {t("servicesManagement")}
        </li>

        <li
          className={
            displayComponent?.componentName === components?.Configuration?.componentName
              ? "active"
              : ""
          }
          onClick={() => setDisplayComponent(components?.Configuration)}
        >
          {t("configuration")}
        </li>

      </TabMenu>

      {<displayComponent.component />}
    </div>
  );
}

export default Settings;
