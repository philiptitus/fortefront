'use client'
// import node module libraries
import { Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

// import widget as custom components
import { PageHeading } from 'widgets'
import { getUserDetails } from 'store/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { logout } from "store/actions/userAction";

// import sub components
import { Notifications, DeleteAccount, GeneralSetting, EmailSetting, Preferences, VerifyAccount } from 'sub-components'

const Settings = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;


	const [tokenExpired, setTokenExpired] = useState(false);
	const router = useRouter()


	const [hasExpired, setHasExpired] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
    const expirationTime = userInfo?.expiration_time





    useEffect(() => {
      if (!userInfo || !("access" in userInfo)) {
        dispatch(logout());
    
      }
      }, [dispatch, userInfo]);
  
      useEffect(() => {
      if (!userInfo) {
        router.push('/authentication/sign-in')
      }
        }, [router,userInfo]);
  



		  
        useEffect(() => {
          // Parse the expiration time string into components
          if (userInfo) {
            
          const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      
          // Create a Date object with the parsed components
          const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);
      
          // Update the state with the expiration time
          setCurrentTime(new Date());
          setHasExpired(expirationDateTime < new Date());
      
          // Set up a timer to update the current time every second
          const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      
          // Clean up the interval on component unmount
          return () => clearInterval(timer);
        }
      
        }, [expirationTime]); // Run effect whenever expirationTime changes
      
      
      
        useEffect(() => {
        if (hasExpired) {
          dispatch(logout())
          router.push('/authentication/sign-in')        }
          }, [hasExpired, dispatch, router]);
        
      









  return (
    <Container fluid className="p-6">

      {/* Page Heading */}
      <PageHeading heading="General" />

      {/* General Settings */}
      <GeneralSetting />

      {/* Email Settings */}
      {/* // DONE ... <EmailSetting /> */}

      {/* Settings for Preferences */}
      {/* // DONE ...<Preferences /> */}

      {/* Settings for Notifications */}
      {/* <Notifications /> */}
      
      
      <VerifyAccount/>

      {/* Delete Your Account */}
      <DeleteAccount />


    </Container>
  )
}

export default Settings