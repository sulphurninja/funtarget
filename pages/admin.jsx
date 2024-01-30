import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState';
import AdminPanel from '../components/AdminPanel'


const Admin = () => {
    const { state } = useContext(DataContext);
    const { auth } = state;

    if (auth.user && auth.user.role === 'admin') {
        return <AdminPanel />;
    } else {
        return <h1>Not authorized!</h1>
    }
}

export default Admin