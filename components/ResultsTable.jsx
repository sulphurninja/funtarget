import { useState, useEffect } from 'react';
import BetOk from './BetOK';

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [drawTimes, setDrawTimes] = useState([]);
  const [nextToDrawtime, setNextToDrawtime] = useState('');
  const [timeToDraw, setTimeToDraw] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextToDraw = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 1,
        0,
        0
      );
      const timeDiff = Math.floor((nextToDraw - now) / 1000);
      const seconds = timeDiff % 60;
      const newTimeToDraw = `${seconds.toString().padStart(2, "0")}`;
      const newNextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setNextToDrawtime(newNextToDrawtime);
      setTimeToDraw(newTimeToDraw);
    }, 1000);

    const startDrawTime = new Date();
    startDrawTime.setMinutes(Math.floor(startDrawTime.getMinutes() / 1) * 1);
    startDrawTime.setSeconds(0);
    const drawTimes = Array(10).fill().map((_, index) => {
      const drawTime = new Date(startDrawTime.getTime() - index * 1 * 60 * 1000);
      return drawTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    });

    setDrawTimes(drawTimes);

    const intervalId = setInterval(() => {
      Promise.all(drawTimes.map(drawTime => (
        fetch(`/api/getPrior?drawTime=${drawTime}`).then(res => res.json())
      ))).then(results => {
        setResults(results.map(result => (result.couponNum )));
      });
    }, 1000);
    return () => {
      clearInterval(timer);
      clearInterval(intervalId);
    }
  }, [nextToDrawtime, timeToDraw, results]);

  return (
    <div className='lg:-ml-72 lg:mt-[200px] absolute mt-[320px] ml-[120%]'>
      <div className="absolute  ">
        <div className="flex ">
          {drawTimes.map((drawTime, index) => (
            <div key={drawTime} className="">
              <div className="bg-gradient-to-b from-red-500 to-black text-white font-bold text-sm lg:text-xl px-[4px] md:px-[8px] text-center py-2 lg:py-2 border border-white -300">
                {results[index] === 9 ? 0 : results[index] }
              </div>
              <div className="bg-gradient-to-b from-red-500 to-black text-white font-bold text-sm px-[4px] lg:text-sm md:px-[8px] text-center py-2 lg:py-2 border border-white -300">
                1X
              </div>
            </div>
          )).reverse()}
        </div>

      </div>
      <BetOk/>
    </div>
  );
}

export default ResultsTable;
