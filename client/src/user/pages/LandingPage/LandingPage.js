import { useEffect, useRef } from "react";

import "./LandingPage.css";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const LandingPage = () => {
  const videoRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.firstChild.src = "/media/cityvideo.mp4";
          videoRef.current.load();
        }
      });
    });

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        poster="https://i.imgur.com/ApyJ96n.jpeg"
        autoPlay
        muted
        loop
        loading="lazy"
        style={{ backgroundColor: "black" }}
      >
        <source src="/media/cityvideo.mp4" type="video/mp4" />
      </video>
      <div className="landing-main-section">
        <h1>Apply for whitelist now!</h1>
        <div className="dropdown">
          <a className="btn" href="#">
            CHOOSE APPLICATION TYPE
          </a>
          <div className="dropdown-content">
            <a href={`${serverUrl}/auth/discord?type=Whitelist`}>
              Whitelist Application
            </a>
            <a href={`${serverUrl}/auth/discord?type=Staff`}>
              Staff Application
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
