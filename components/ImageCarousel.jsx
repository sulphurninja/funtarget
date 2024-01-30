import { useState, useEffect } from 'react';

const images = [  '/BLACK 1.png',  '/BLACK 2.png',  '/BLACK 3.png',  '/BLACK 4.png',];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [timeToDraw, setTimeToDraw] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time until the next minute
      const now = new Date();
      const nextMinute = new Date(now.getTime() + 60 * 1000);
      const timeToNextMinute = 60 - nextMinute.getSeconds();
      setTimeToDraw(timeToNextMinute);
      if (!isStopped) {
        setCurrentIndex((currentIndex) =>
          currentIndex === images.length - 1 ? 0 : currentIndex + 1
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStopped]);

  useEffect(() => {
    if (timeToDraw <= 1 || timeToDraw >= 58 ) {
      setIsStopped(false);
    }
    else setIsStopped(true)
  }, [timeToDraw]);

  const handleStop = () => {
    setIsStopped(true);
  };

  return (
    <div className="relative w-full h-[70px] lg:h-full">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Image ${index}`}
          className={`absolute w-full h-full transition-all duration-200 ${
            currentIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
          onAnimationEnd={() => handleStop()}
        />
      ))}
    </div>
  );
}