import { useState, useEffect, useContext } from "react";
import React from "react";
import { DataContext } from "@/store/GlobalState";
import Buttons from "./Buttons";

export default function Time() {
    const [time, setTime] = useState(new Date());
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
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
    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        router.push('/')
    }

    const timeDiff = Math.floor((nextToDraw - time) / 1000);
    const seconds = timeDiff % 60;
    const timeToDraw = `${seconds.toString().padStart(2, "0")}`;
    const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="w-full h-full mt-[5%] ">
            <div
                className='grid grid-cols-3 gap-y-4  w-[30%] h-[30%] mt-1 justify-items-center ml-[0%]  text-lg'
            >
                {[10, 20, 30, 50, 100, 500, 1000, 5000, 4].map(amount => (
                    <img key={amount} className='h-[100%] cursor-pointer  w-[70%]' src={`/${amount}.png`} />
                ))}

                <Buttons/>




                <div className="flex absolute justify-center w-full mt-[35%] ml-[70%]">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                        <div className=' relative w-full'>
                            <img src="/button.png" className="h-[80%] cursor-pointer hover:animate-pulse  w-[80%]"
                                key={number}
                            />
                                <span className="text-black -200 font-bold absolute text-sm cursor-pointer  lg:text-4xl pl-2  mt-[-50%] ml-[25%] lg:ml-[30%]">{number}</span>
                            </div>
                    ))}

                </div>






            </div>
        </div>
    );
}
