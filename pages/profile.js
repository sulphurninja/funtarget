import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { patchData } from '../utils/fetchData'



const Profile = () => {
    const initialSate = {
        userName: '',
        password: '',
    }
    const [data, setData] = useState(initialSate)
    const { userName, password} = data

    const {state, dispatch} = useContext(DataContext)
    const { auth, notify, orders } = state

    useEffect(() => {
        if(auth.user) setData({...data, name: auth.user.userName})
    },[auth.user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({...data, [name]:value})
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault()
        if(password){
            updatePassword()
        }

        if(userName !== auth.user.userName) updateInfor()
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: {loading: true} })
        patchData('user/resetPassword', {password}, auth.token)
    }


    const updateInfor = async () => {
        let media;
        dispatch({type: 'NOTIFY', payload: {loading: true}})
        patchData('user', {
            userName
        }, auth.token).then(res => {
            dispatch({type: 'AUTH', payload: {
                token: auth.token,
                user: res.user
            }})
           
        })
    }


    if(!auth.user) return null;
    return( 
        <div className="profile_page">
            <Head>
                <title>Profile</title>
            </Head>

            <section className="ml-auto h-[300px] bg-white mr-auto items-center text-center mt-[100px] ">

                <div className="">
                    <h3 className="text-black font-bold text-center text-uppercase">
                        {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
                    </h3>


                    <div className="form-group">
                        <label className='text-black pr-[30px] ' htmlFor="name">userName</label>
                        <input type="text" name="userName" value={userName} className="bg-black rounded-lg text-white  pl-[10px]  mt-[30px] form-control"
                        placeholder="Your name" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className='pr-[20px] text-black' htmlFor="password">New Password</label>
                        <input type="password" name="password" value={password} className=" bg-black text-white pl-[10px] rounded-lg mt-[30px] form-control"
                        placeholder="Your new password" onChange={handleChange} />
                    </div>

                    <button className="btn mt-[30px] rounded-lg bg-black text-white w-[100px] btn-info" 
                    onClick={handleUpdateProfile}>
                        Update
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Profile