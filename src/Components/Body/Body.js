import React from "react";
import "./Body.css";

const Body = () => {
  return (
    <div className="flex flex-col md:flex-row lg:flex-col items-center lg:items-start gap-6 md:gap-8 md:max-w-2xl lg:max-w-lg">
      <video
        preload="auto"
        className="video"
        poster="https://sb.kaleidousercontent.com/67418/840x560/686381d375/emilia-poster.jpg"
        autoPlay
        playsInline
        muted
        src="https://sb.kaleidousercontent.com/67418/x/681f13b37d/emilia_compressed.mp4"
      />
      <div className="flex flex-col gap-4">
        <h1 className="font-display font-bold text-typo m-0 text-4xl md:text-5xl lg:text-6xl text-center md:!text-left">
          Remove Image <br /> Background
        </h1>
        <p className="text-typo-tertiary font-bold text-xl m-0 !text-typo text-center md:!text-left">
          100% Automatically and
          <span className="!py-1 !px-4 bg-brush bg-no-repeat bg-cover bg-center">
            Free
          </span>
        </p>
      </div>
      <div className="w-full flex flex-col sm:justify-center sm:items-center sm:gap-8 sm:pt-36 sm:pb-16 rounded-4xl bg-white shadow-2xl">
      </div>
    </div>
  );
};

export default Body;
