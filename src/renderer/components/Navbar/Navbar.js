import "./Navbar.css";

import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { SystemSections } from "../../constants/Others";

import ICONS from "../../constants/Icons";
import { actionTypes } from "../../context/reducer";
import { t } from "i18next";
import { useStateValue } from "../../context/StateProvider";
import { useEffect, useState } from "react";

const CustomeLinks = ({ to, id, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  let isActive = useMatch({ path: resolvedPath.pathname, end: false });
  const [, dispatch] = useStateValue();

  // because end is false we need deactive the home tab while other tab is active
  if (to === "/" && window.location.pathname !== "/") {
    isActive = false;
  }



  return (
    <li className={"link" + (isActive ? " active " : "")} id={id} onClick={() => {
      if (window.innerWidth <= 768) {
        dispatch({
          type: actionTypes.COLLAPSE_NAVBAR,
        })
      }

    }}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const [{ navbarCollapse, }, dispatch] = useStateValue();
  const [innerHeight, setinnerHeight] = useState(window.innerHeight);

  const navActiveHandler = () => {
    dispatch({
      type: actionTypes.COLLAPSE_NAVBAR,
    })
  };

  useEffect(() => {
    setinnerHeight(window.innerHeight)


  }, [window.innerHeight])



  const getNavLink = (key) => {

    switch (key) {
      case SystemSections.ClassNames:
        return (
          <CustomeLinks to="/classNames" id={'className_link'} key={key}>
            <i className={ICONS.classIcon}></i>
            <span>{t("classNames")}</span>
          </CustomeLinks>
        )
      case SystemSections.Consumptions:
        return (
          <CustomeLinks to="/consumptions" id={'consumptions_link'} key={key}>
            <i className={ICONS.consumptions}></i>
            <span>{t('consumptions')}</span>
          </CustomeLinks>
        )
      case SystemSections.Reports:
        return (
          <CustomeLinks to="/reports" id={'reports_link'} key={key}>
            <i className={ICONS.reports}></i>
            <span>{t('reports')}</span>
          </CustomeLinks>
        )
      case SystemSections.Teachers:
        return (
          <CustomeLinks to="/teachers" id={'teachers_link'} key={key}>
            <i className={ICONS.peopleFill}></i>
            <span>{t("teachers")}</span>
          </CustomeLinks>
        )
      case SystemSections.Messaging:
        return (
          <CustomeLinks to="/messaging" id={'messaging_link'} key={key}>
            <i className={ICONS.envelopeFill}></i>
            <span>{t("messaging")}</span>
          </CustomeLinks>
        )
      case SystemSections.Schedule:
        return (
          <CustomeLinks CustomeLinks to="/schedules" id={'schedules_link'} key={key}>
            <i className={ICONS.diagram}></i>
            <span>{t("schedule")}</span>
          </CustomeLinks>
        )
      case SystemSections.DailyTimes:
        return (
          <CustomeLinks CustomeLinks to="/daily-times" id={'schedules_link'} key={key}>
            <i className={ICONS.clockFill}></i>
            <span>{t("dailyTimes")}</span>
          </CustomeLinks>
        )
      case SystemSections.Events:
        return (
          <CustomeLinks to="/events" id={'settings_link'} key={key}>
            <i className={ICONS.logs}></i>
            <span>{t('logs')}</span>
          </CustomeLinks>
        )
      case SystemSections.Settings:
        return (
          <CustomeLinks to="/settings" id={'settings_link'} key={key}>
            <i className={ICONS.gear}></i>
            <span>{t("settings")}</span>
          </CustomeLinks>
        )

      default:
        return null

    }


  }


  return (
    <div className={`navbar ${navbarCollapse && " active_nav_right "} display_flex flex_direction_column justify_content_space_between`}>

      {/* {authentication.userType === 'SUPER_ADMIN' && */}
      <div className={`navbar_menu position_absolute ${innerHeight < 400 ? 'overflow_y_scroll' : ''}`}>
        <ul className="navbar_content">
          <CustomeLinks to="/" id={'home_link'} >
            <i className={ICONS.door}></i>
            <span>{t("home")}</span>
          </CustomeLinks>
          {Object.keys(SystemSections).map(item => {
            return getNavLink(SystemSections[item])
          })}
        </ul>
      </div>
      {/* } */}

      <div className="toggle_header_navbar position_relative display_flex justify_content_center ">
        <div
          className="toggle_header_icon display_flex align_items_center justify_content_center border_radius_50"
          onClick={navActiveHandler}
          style={{ backgroundColor: navbarCollapse ? 'var(--light-dark)' : 'red' }}
        >
          {navbarCollapse ? (
            <i className={`${ICONS.list} text_color cursor_pointer`}></i>
          ) : (
            <i className={`${ICONS.cross} text_color cursor_pointer bold`} ></i>
          )}
        </div>
      </div>
    </div >
  );
};

export default Navbar;
