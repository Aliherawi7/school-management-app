import './Home.css';

import React from 'react';

import { useStateValue } from '../../context/StateProvider';


const Home = () => {
  const [{ authentication },] = useStateValue();


  return (
    <div className="home fade_in">

      <h1 className="text_align_center" style={{ fontSize: '34px' }}>
        Home Page
      </h1>

    </div>
  );
};

export default Home;
