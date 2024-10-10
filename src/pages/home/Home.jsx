import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="homepage">
      <img src="/orbital.png" alt="background" className="orbital" />
      <div className="left">
        <h1>LAMA AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis
          reprehenderit autem doloremque doloribus.
        </h3>
        <Link to="dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="./bot.png" alt="bot" className="bot" />
        </div>
      </div>
    </div>
  );
};

export default Home;
