import React, { Suspense, useEffect, useState } from 'react';

import { useStateValue } from '../../context/StateProvider';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Header from '../Header/Header';
import Wrapper from '../HOC/Wrapper';
import Navbar from '../Navbar/Navbar';
import Circle from '../UI/Loading/Circle';
import { Outlet } from 'react-router-dom';

function Layout() {

  const [{ smallLoading, navbarCollapse },] = useStateValue();
  // switch between light or dark mode
  const [isDark, setIsDark] = useState(localStorage.getItem("isDark") === "true");

  const darkModeHandler = () => {
    localStorage.setItem("isDark", !isDark);
    setIsDark(!isDark);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <Suspense fallback={<Circle />}>
      <div className={`app ${isDark ? "theme-dark" : "theme-light"}`}>
        <span className="background_colors"></span>
        <main className="main">
          <div id="viewport">

            <div
              id="navbar_container"
              className={
                (windowWidth <= 768 && navbarCollapse) ? "active_nav_right" : "navbar_translate"
              }
            >
              <Navbar />
            </div>
            <ErrorBoundary>
              <Wrapper>
                <>
                  <Header
                    isDark={isDark}
                    darkModeHandler={darkModeHandler}
                  />
                  {/* <BreadCrumbs /> */}
                </>
                <section className="margin_top_20 padding_bottom_10">
                  <Outlet />
                </section>
                {smallLoading && <Circle />}
              </Wrapper>
            </ErrorBoundary>

          </div>
        </main>
      </div>
    </Suspense>
  );
}

export default Layout;
