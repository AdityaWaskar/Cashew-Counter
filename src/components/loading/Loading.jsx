import React from "react";
import Lottie from "react-lottie";
import "./loading.css";
import loadingAnimation from "../../assets/loadingAnimation.json";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const Loading = ({ isLoading }) => {
  return (
    isLoading && (
      <div id="loadingContainer">
        <div className="f-w flex">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </div>
    )
  );
};

export default Loading;
