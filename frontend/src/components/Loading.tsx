import Lottie from "lottie-react";
import loadingAnimation from "../assets/animation/loading.json";

function Loading() {
  return (
    <div style={{ width: 200 }}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
}

export default Loading;