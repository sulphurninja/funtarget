import HeaderText from "@/components/HeaderText";
import { DataContext } from "@/store/GlobalState";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import HandleResults from "../components/HandleResults";
import Wheel from "../components/Wheel";
import axios from "axios";
import Timer from "../components/Timer";
import Timerleft from "../components/Timerleft";
import { Howl } from "howler";
import ResultsTable from "@/components/ResultsTable";
import Buttons from '@/components/Buttons';
import ImageCarousel from "../components/ImageCarousel";

function game() {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [couponNum, setCouponNum] = useState();
  const [mustSpin, setMustSpin] = useState(false);
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  const wheelSound = new Howl({
    src: ["/wheel.mp3"],
  });

  const winningSound = new Howl({
    src: ["/winning.mp3"],
  });

  const timeRemainingSound = new Howl({
    src: ["/5sec.mp3"],
  });
  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    const hasReloadedStorage = localStorage.getItem('hasReloaded');
    if (!hasReloadedStorage) {
      localStorage.setItem('hasReloaded', 'true');
      setHasReloaded(true);
      window.location.reload();
    }

    return () => {
      localStorage.removeItem('hasReloaded');
      setHasReloaded(false);
    };
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextToDraw = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    time.getMinutes() + 1,
    0,
    0
  );

  const timeDiff = Math.floor((nextToDraw - time) / 1000);
  const seconds = timeDiff % 60;
  const timeToDraw = `${seconds.toString().padStart(2, "0")}`;
  const nextToDrawtime = nextToDraw.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // useEffect(() => {

  //     const fetchWinningNumber = async () => {
  //       try {
  //         const response = await axios.get(`/api/getWinningNumber/?drawTime=${nextToDrawtime}`);
  //         setCouponNum(response.data.couponNum);
  //       } catch (err) {
  //         console.log('Error fetching winning number:', err);
  //       }
  //     };
  //     fetchWinningNumber();
  //     console.log(winningNumber)
  //   }
  // );

  useEffect(() => {
    const fetchWinningNumber = async () => {
      if (timeToDraw) {
        try {
          const response = await fetch(
            `/api/getWinningNumber/?drawTime=${nextToDrawtime}`
          );
          if (response.ok) {
            const data = await response.json();
            setCouponNum(data.couponNum);
            console.log(data.couponNum, "this is fetched result");
          } else {
            console.log("Error fetching winning number:", response.statusText);
          }
        } catch (err) {
          console.log("Error fetching winning number:", err);
        }
      }
    };
    const timer = setInterval(() => {
      fetchWinningNumber();
    }, 1000);

    return () => clearInterval(timer);
  }, [nextToDrawtime, timeToDraw]);

  const handleChange = () => {
    if (!spinning) {
      setSpinning(true);
      console.log(couponNum, "this is client side result");
      setMustSpin(true);
    }
  };
  let wheelSoundPlayed = false;
  let winningSoundPlayed = false;
  let timeRemainingSoundPlayed = false;

  function run() {
    if (timeToDraw == 0) {
      handleChange();
    }
    if (timeToDraw == 0 && !wheelSoundPlayed) {
      wheelSound.play();
      wheelSoundPlayed = true;
    }
    if (timeToDraw == 54 && !winningSoundPlayed) {
      winningSound.play();
      winningSoundPlayed = true;
    }
    if (timeToDraw == 5 && !timeRemainingSoundPlayed) {
      timeRemainingSound.play();
      timeRemainingSoundPlayed = true;
    }
  }

  run();




  return (
    <body className="bg-black overflow-visible lg:overflow-hidden     ">
      <img
        src="/background.gif"
        className="w-full h-full object-fill fixed  top-0 left-0 z-0 mt-14" />
      {/* <div className="absolute w-full mt-[3%]">
        <HeaderText />
      </div> */}
      <div className="h-full w-full   ">
        <Head>
          <title>Chakri - Game</title>
        </Head>

        <div className="gap-24 lg:ml-[92%] lg:mt-[2%] mt-7 ml-[92%] z-30 w-full absolute ">
          <Timer />
          <div>
          </div>
          <ResultsTable />
          {/* <div className="ml-[0%] w-full ">
            <Timerleft />
          </div> */}
        </div>
        <div className="absolute ml-[131.5%] lg:ml-[45.5%] lg:mt-[12.2%] mt-[12.2%] md:h-[14%] md:w-[8.5%] h-[24%]   z-10">
          <ImageCarousel />
        </div>

        {/* <div className="absolute ">
            <ImageCarousel />
          </div> */}
        <div className="wheelcontainer w-[30%] h-[33vw] relative lg:mt-[8.5rem] mt-[11.5rem] left-[120.4%]  lg:left-[34.4%]  object-contain z-0">
          {/* madhale circle kaate */}


          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={couponNum}
            onClick={() => handleChange()}
            onStopSpinning={() => {
              setSpinning(false);
              setMustSpin(false);
            }}
          />
          {/* * bahercha circle */}
          <img
            src="/circleout.gif"
            style={{
              width: "96%",
              height: "85%",
              left: "2%",
              top: "6%",

              position: "absolute",
            }}
          />
          <img
            src="https://res.cloudinary.com/dxcer6hbg/image/upload/v1675103735/uxo6d30fdtolymvu27kt.png"
            alt="button"
            className="z-20"
            style={{
              cursor: "pointer",
              position: "absolute",
              width: "45%",
              height: "40%",
              left: "28%",
              top: "29%",
              margin: "0 auto",

              zIndex: 100,
            }}
          />
        </div>

      </div>
    </body>
  );
}

export default game;