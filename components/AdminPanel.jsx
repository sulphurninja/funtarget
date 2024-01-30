import HeaderText from '../components/HeaderText';
import { DataContext } from '@/store/GlobalState';
import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Timer from '../components/Timer'
import Modal from '../components/ModalResult'

function game() {
    const [couponNum, setCouponNum] = useState(1);
    const [mustSpin, setMustSpin] = useState(false);
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('');
    const [showModalResult, setShowModalResult] = useState(false);
    const [couponNums, setCouponNums] = useState(Array(10).fill(null));
    const handleChange = event => {
        setMessage(event.target.value);
        if (!spinning) {
            setSpinning(true);
            const newCouponNum = event.target.value - 1 || Math.random;
            setCouponNum(newCouponNum);
            console.log(newCouponNum);
            setMustSpin(true);
        }

        console.log('value is:', event.target.value + 1);
    };
    
   

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
    const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

 
    const handleButtonClick = async (index) => {
        try {
            const response = await fetch('/api/updateWinningNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    couponNum: index -1,
                    nextToDrawtime: nextToDrawtime,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                const newCouponNums = [...couponNums];
                newCouponNums[index] = index;
                setCouponNums(newCouponNums);
                setShowModalResult(true)
            }
        } catch (err) {
            console.error(err);
        }
    };

    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const router = useRouter()

    return (
        <body className='h-screen w-screen relative overflow-hidden'>
            <Head>
                <title>Chakri - Game</title>
            </Head>
            <HeaderText />
            <div className='flex w-full  '>
              
                {couponNums.map((number, index) => (
                    <button className='text-black mx-4 text-sm pr-3 ml-auto rounded-full lg:w-[50px] w-[30px] h-[20px]  my-4 pl-4 font-bold bg-white text-center lg:h-[50px]  flex ' key={index} onClick={() => handleButtonClick(index)}>
                        {number || index }
                    </button>
                ))}
               
                </div>
              <Timer/>
           <div className='mt-[10%]'>
           <Link href='/register'>
           <h1 className='text-white text-5xl font-bold'>Create User ID</h1>
           </Link>
           </div>
           <Modal isOpen={showModalResult} onClose={() => setShowModalResult(false)} />
        </body>

    )
}

export default game
