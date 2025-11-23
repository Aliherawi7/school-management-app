import "./Footer.css";
import React from "react";
import { t } from "i18next";

const Footer = () => {
  return (
    <div className="footer full_width display_flex justify_content_space_between flex_flow_wrap border_radius_10 padding_10">
      {/* <div className="footer_social_media">
        <ul className="display_flex">
          <li>
            <a
              href="https://www.linkedin.com/company/hebra-tech-solutions/about/"
              target="_blank"
            >
              <i className={ICONS.linkedin}></i>
            </a>
          </li>
          <li title="انستاگرام">
            <a href="" target="_blank">
              <i className={ICONS.instagram}></i>
            </a>
          </li>
          <li>
            <a href="" target="_blank">
              <i className={ICONS.twitter}></i>
            </a>
          </li>
          <li title="تلگرام">
            <a href="" target="_blank">
              <i className={ICONS.telegram}></i>
            </a>
          </li>
          <li title="فیسبوک">
            <a href="" target="_blank">
              <i className={ICONS.facebook}></i>
            </a>
          </li>
        </ul>
      </div> */}

      <div className="credits">
        {/* <p className="text_color text_align_center">{t("companyName")}: </p> */}
        <p >{t('')}</p>
      </div>

      {/* !CopyRight */}

      <div className="display_flex">
        <p className="text_color text_align_center">{t("designedAndDevelopedBy")}: </p>
        <a href="https://ali-herawi.web.app/" className="author_link">{t('developerName')}</a>
      </div>
    </div>
  );
};

export default Footer;
