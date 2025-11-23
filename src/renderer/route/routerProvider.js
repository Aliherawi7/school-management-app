import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AddDailyTime from '../components/ClassNames/AddClasName.jsx';
import AddConsumptions from '../components/Consumptions/AddConsumptions/AddConsumptions.tsx';
import Logs from '../components/Logs/Logs.tsx';
import AccountSettings from '../components/Settings/AccountSettings/AccountSettings.jsx';
import AddTeacher from '../components/Teachers/AddTeacher/AddTeacher.tsx';
import DailyTimes from '../pages/DailyTimes/DailyTimes.tsx';
import Messaging from '../pages/Messaging/Messaging.tsx';
import Teacher from '../components/Teachers/Teacher/Teacher.jsx';
import ClassNames from '../pages/ClassNamesPage/ClassNamesPage.tsx';
import TeachersPage from '../pages/TeachersPage/TeachersPage.tsx';
import Schedules from '../pages/Schedules/Schedules.tsx';
import ClassNameComp from '../components/ClassNames/ClassName/ClassNameComp.tsx';

const NotFound = React.lazy(() => import("../pages/NotFound/NotFound"));
const Login = React.lazy(() => import("../components/Login/Login"));
const Layout = React.lazy(() => import("../components/Layout/Layout"));
const Reports = React.lazy(() => import("../components/Reports/Reports.jsx"));
const Consumptions = React.lazy(() => import("../components/Consumptions/Consumptions"));
const Dashboard = React.lazy(() => import("../components/Dashboard/Dashboard"));
const Home = React.lazy(() => import("../pages/Home/Home.jsx"));
const Settings = React.lazy(() => import("../components/Settings/Settings"));


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/consumptions",
        element: <Consumptions />,
      },

      {
        path: "/consumptions/add",
        element: <AddConsumptions />,
      },

      {
        path: "/classNames",
        element: <ClassNames />,
      },
      {
        path: "/classNames/:classNameId",
        element: <ClassNameComp />,
      },

      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/daily-times",
        element: <DailyTimes />,
      },
      {
        path: "/dailyTimes/:dailyTimeId",
        element: <DailyTimes />,
      },
      {
        path: "/dailyTimes/:dailyTimeId/update",
        element: <AddDailyTime updateMode />,
      },
      {
        path: "/teachers",
        element: <TeachersPage />,
      },
      {
        path: "/teachers/add-teacher",
        element: <AddTeacher />,
      },
      {
        path: "/teachers/:teacherId/update",
        element: <AddTeacher updateMode={true} />,
      },
      {
        path: "/teachers/:teacherId",
        element: <Teacher />,
      },
      {
        path: "/schedules",
        element: <Schedules />,
      },
      {
        path: "/teachers/add-teacher",
        element: <AddTeacher />,
      },
      {
        path: "/teachers/:teacherId/update",
        element: <AddTeacher updateMode={true} />,
      },

      {
        path: "/messaging",
        element: <Messaging />,
      },

      {
        path: "/events",
        element: <Logs />,
      },

      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/settings/account",
        element: <AccountSettings />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default browserRouter;
