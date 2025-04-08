"use client"
import React, { useState , useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Loading from './loading'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'

export default function Custom404() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        dispatch(setUserData(JSON.parse(userData)));
        setLoading(false)
      }, [])

    return (
        <>
          <Navbar />
          <Hero />
          {
            loading ? <Loading /> :
              <>
                <h1>La page à laquelle vous tentez d'accéder n'existe pas.</h1>
                <Footer />
              </>
          }
        </>
      )
}