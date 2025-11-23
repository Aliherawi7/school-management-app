import './Wrapper.css';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Footer from '../Footer/Footer';

const Wrapper = (props) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const wrapperRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const handleScroll = () => {
      // Check if wrapper has been scrolled more than 200 pixels
      if (wrapper.scrollTop > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    // Add event listener to wrapper to check if it has been scrolled
    wrapper.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    handleBackToTop();
  }, [id]);

  const handleBackToTop = () => {
    // Scroll to top of wrapper
    const wrapper = wrapperRef.current;
    wrapper.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="wrapper box_sizing_border_box"
      id="wrapper"
      ref={wrapperRef}
    >
      <div className="body_container display_flex flex_direction_column justify_content_space_between">
        {/* display modal for offline */}

        <div>
          {props.children}
        </div>

        <Footer />

      </div>


    </div>
  );
};

export default Wrapper;
