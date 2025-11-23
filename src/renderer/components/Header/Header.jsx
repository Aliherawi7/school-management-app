import './Header.css';

import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';

import profileImage from '../../../assets/img/profile_avatar.png';
import ICONS from '../../constants/Icons';
import { actionTypes } from '../../context/reducer';
import { useStateValue } from '../../context/StateProvider';
import { getSystemConfig } from '../../Utils/DBService';

const Header = ({ isDark, darkModeHandler }) => {

  const [{ navbarCollapse }, dispatch] = useStateValue();
  const [systemConfig, setsystemConfig] = useState()

  useEffect(() => {
    getSystemConfig()
      .then(res => {
        setsystemConfig(res)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const navbarHandler = () => {
    dispatch({
      type: actionTypes.COLLAPSE_NAVBAR,
    })
  }


  return (
    <section className="header_container ">

      <div className="header display_flex align_items_center justify_content_space_between padding_left_10 padding_right_10">
        <div className="toggle_header_navbar position_relative display_flex justify_content_center">
          <div
            className="toggle_header_icon display_flex align_items_center justify_content_center border_radius_50"
            onClick={navbarHandler}
          >
            {navbarCollapse ? (
              <i className={`${ICONS.list} text_color cursor_pointer`}></i>
            ) : (
              <i className={`${ICONS.cross} text_color cursor_pointer`} ></i>
            )}
          </div>
        </div>
        <div className="display_flex align_items_center ">
          <div
            className="dark_mode_toggle header_box_size cursor_pointer display_flex"
            onClick={darkModeHandler}
            title={t("changeTheme")}
          >
            {isDark ? (
              <i className={ICONS.brightnessHigh}></i>
            ) : (
              <i className={ICONS.moon}></i>
            )}
          </div>


          <div className="user_profile user_select_none display_flex cursor_pointer">
            <div className="user_profile_img_container display_flex position_relative border_radius_50">
              {<img
                src={profileImage}
                className="user_profile_img position_absolute"
                alt="user_image"
              />}
            </div>
            <p className="text_color">
              {systemConfig?.name} {systemConfig?.lastName}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Header;
