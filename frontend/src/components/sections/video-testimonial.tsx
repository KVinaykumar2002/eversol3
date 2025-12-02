"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";

const VideoTestimonial = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="bg-[#fafafa] py-12 font-body md:py-20">
      <div className="container">
        <h2 className="mx-auto mb-8 max-w-4xl text-center font-display text-2xl font-semibold text-[#2d2d2d] md:mb-12">
          This Engineer Returned From The US To Build An Organic Movement! 12,000
          Farmers! EVERSOL
        </h2>

        <div className="relative mx-auto aspect-[16/9] max-w-[1200px] overflow-hidden rounded-[12px] bg-black">
          <video
            ref={videoRef}
            src="https://cdn.shopify.com/videos/c/o/v/2f74fc9020624fb09059c766e538177a.mp4"
            className="h-full w-full object-cover"
            controls={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            poster="https://cdn.shopify.com/s/files/1/0865/4005/8946/files/Screenshot_2024-07-28_at_7.08.31_PM.png?v=1722173932"
          >
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

              {/* Play Button Overlay */}
              <button
                onClick={handlePlay}
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#fafafa] md:h-24 md:w-24 cursor-pointer"
              >
                <Play className="ml-1 h-10 w-10 fill-current md:h-12 md:w-12" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;