import './About.css';

import { t } from 'i18next';
import React from 'react';

import Footer from '../../components/Footer/Footer';
import ICONS from '../../constants/Icons';

const About = () => {
  return (
    <div className="about">
      {/* About US */}
      <section className="about_us">
        <div className="about_section_title text_align_center">
          <h1>{t("about")}</h1>
        </div>

        <div className="about_us_boxes display_grid">
          <div className="about_us_box">
            <h1>
              <span>{t("introduction")}</span>
              {t("introductionDigital")}
            </h1>
          </div>
          <div className="about_us_box">
            <p>{t("footerHebraText")}</p>
          </div>
          <div className="about_us_box">
            <p>{t("footerHebraText")}</p>
          </div>
        </div>

        <div className="about_us_boxes about_us_boxes2 display_grid">
          <div className="about_us_box2 position_relative display_flex align_items_center justify_content_space_between box_shadow border_radius_10">
            <i className={ICONS.coin}></i>
            <div>
              <h4>{t("bestPriceGuaranteed")}</h4>
              <p>{t("ranText")}</p>
            </div>
          </div>
          <div className="about_us_box2 position_relative display_flex align_items_center justify_content_space_between box_shadow border_radius_10">
            <i className={ICONS.graphUpArrow}></i>
            <div>
              <h4>{t("financeAnalysis")}</h4>
              <p>{t("ranText")}</p>
            </div>
          </div>
          <div className="about_us_box2 position_relative display_flex align_items_center justify_content_space_between box_shadow border_radius_10">
            <i className={ICONS.steam}></i>
            <div>
              <h4>{t("professionalTeam")}</h4>
              <p>{t("ranText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default About;
