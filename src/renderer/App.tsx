import './App.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import BackDrop from './components/UI/BackDrop/BackDrop';
import Circle from './components/UI/Loading/Circle';
import MessageBox from './components/UI/MessageBox/MessageBox';
import BtnTypes from './constants/BtnTypes';
import ICONS from './constants/Icons';
import { actionTypes } from './context/reducer';
import { useStateValue } from './context/StateProvider';
import browserRouter from './route/routerProvider';
import { getSystemConfig } from './Utils/DBService';
import QuickStartSetup from './components/QuickStartSetup/QuickStartSetup';

const App: React.FC = () => {
  const [{ askingModal, confirmModal, globalLoading }, dispatch] = useStateValue();
  const [loading, setloading] = useState(false)
  const [active, setactive] = useState({
    quickSetupDone: true,
  })

  // useEffect(() => {
  //   getSystemConfig().then(res => {
  //     console.log(res);
  //     console.log(!res?.quickSetupDone);
  //     if (!res?.quickSetupDone) {
  //       setactive({ quickSetupDone: false })
  //     }
  //   }).catch(err => {
  //     setactive({ quickSetupDone: false })
  //   }).finally(() => {
  //     setloading(false)
  //   })

  // }, [])



  const hideShowAskingModal = () => {
    dispatch({
      type: actionTypes.SHOW_ASKING_MODAL,
      payload: { show: false, message: '' },
    })
  }
  const hideConfirmMessage = () => {
    dispatch({
      type: actionTypes.HIDE_CONFIRM_MODAL,
    })
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent right-click context menu
  };


  if (loading) {
    return <Circle />
  }

  if (!active.quickSetupDone) {
    return <QuickStartSetup setActive={setactive} active={active} />
  }


  return (
    <div id="atomcode" onContextMenu={handleContextMenu}>
      <BackDrop show={askingModal.show}>
        {
          <MessageBox
            messageType="asking"
            firstBtn={{
              btnText: t("yes"),
              btnType: BtnTypes.danger,
              onClick: () => askingModal.btnAction(askingModal.id),
            }}
            secondBtn={{
              btnText: t("no"),
              btnType: BtnTypes.success,
              onClick: hideShowAskingModal,
            }}
            message={t(askingModal.message)}
            iconType={ICONS.asking}
          />
        }
      </BackDrop>


      <BackDrop show={confirmModal.show}>
        {
          <MessageBox
            messageType="info"
            firstBtn={{
              btnText: t("confirm"),
              btnType: BtnTypes.success,
              onClick: hideConfirmMessage,
            }}
            message={confirmModal.message}
            iconType={confirmModal.iconType}
          />
        }
      </BackDrop>
      {globalLoading ? <Circle /> : null}

      {/*  toast configuration */}
      <ToastContainer
        position={"bottom-left"}
        pauseOnHover={true}
        closeOnClick={true}
        draggable={true}
        hideProgressBar={false}
        autoClose={4000}
      />

      <RouterProvider router={browserRouter} />
    </div>
  )
}

export default App
