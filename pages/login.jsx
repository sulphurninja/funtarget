import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

function login() {
  const initialState = { userName: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { userName, password } = userData;
  const { state = {}, dispatch } = useContext(DataContext);
  const { auth = {} } = state;
  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  
 const handleSubmit = async e => {
    e.preventDefault()
  
    const res = await postData('auth/login', userData)
  
    if (res.error) {
      window.location.reload();
      return;
    }

    dispatch({
      type: 'AUTH', payload: {
        token: res.access_token,
        user: res.user
      }
    })

    Cookie.set('refreshtoken', res.refresh_token, {
      path: '/api/auth/accessToken',
      expires: 7
    })

    localStorage.setItem('firstLogin', true)

    // check if user has admin privileges
    if (res.user.role === 'admin') {
      router.push("/admin");
    } else {
      router.push("/game");
    }
    if(res.user.role === 'subadmin'){
      router.push("/subadmin")
    }
  }

  return (
    <body className="w-screen h-screen relative">
      <img
        src="/login.png"
        className="absolute  w-full h-full object-cover"
        // autoPlay={true}
        // muted
        // loop
      />

      <div className="h-[20%]"> hi</div>
      <div className="absolute ml-[10%] hidden mt-[30%] text-white text-2xl">
          🔞 Meant for Amusement only!
          </div>
      <div className="flex justify-around absolute  h-[80%]">
        <div className="w-1/3 text-2xl  text-center text-white ">
          <h4 className="bg-[#130326] text-xl opacity-5 ml-8  rounded-2xl p-10">
           ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </h4>
          
        </div>
        <div className="w-1/3">
          <div className="h-1/5"></div>
          <div className="h-1/3 w-full">
            <form
              className="bg-[#18151B] rounded-2xl -mt-[55px] ml-28   shadow-md  p-2 w-[69%] h-[150%] "
              onSubmit={handleSubmit}
            >
              <div className="pt-4 ">
                <label
                  className="block text-white mt font-medium pb-4 text-lg "
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none  rounded w-full text-2xl p-2 bg-[#121316] text-white  leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  name="userName"
                  value={userName}
                  onChange={handleChangeInput}
                  type="text"
                  placeholder="Username"
                />
              </div>
              <div className="py-4">
                <label
                  className="block text-white  text-lg font-medium  py-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none text-2xl  rounded w-full py-2 px-3 bg-[#121316] text-white  leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChangeInput}
                  placeholder="******************"
                />
              </div>
              <div className="flex items-center justify-between w-1/2 ml-auto mr-auto">
                <button
                  className="bg-[#C61010] hover:bg-red-700 w-full  text-white font-bold py-4  text-2xl px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          
          </div>
        </div>
      </div>
    </body>
  );
}

export default login;