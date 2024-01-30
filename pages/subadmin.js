import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState';
import SubAdminPanel from '../components/SubAdminPanel'


const SubAdmin = () => {
    const { state } = useContext(DataContext);
    const { auth } = state;

    if (auth.user && auth.user.role === 'subadmin' ) {
        return <SubAdminPanel />;
    } else {
        return <h1>Not authorized!</h1>
    }
}

export default SubAdmin;