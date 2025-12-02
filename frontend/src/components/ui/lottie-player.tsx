"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottiePlayerProps {
  url: string;
  fallback?: React.ReactNode;
  className?: string;
}

export default function LottiePlayer({ url, fallback, className }: LottiePlayerProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Lottie animation");
        }
        return response.json();
      })
      .then((data) => {
        setAnimationData(data);
        setError(false);
      })
      .catch((err) => {
        console.error("Lottie loading error:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-50`}>
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !animationData) {
    return <>{fallback}</>;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

