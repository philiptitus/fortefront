'use client'
// import node module libraries
import { Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'

// import sub components
import { HostelImage, CloseHostel, Hostelinformation, NewStaff, DeleteImage, NewRooms } from 'sub-components'
import { useEffect, useState } from 'react';
import { listHostelDetails } from 'store/actions/hostelActions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { logout } from "store/actions/userAction";



const defaultValue = {
  hostel_name: 'Sunset Hostel',
  address: '123 Sunset Blvd, Nairobi, Kenya',
  room_price_1: 50,
  room_price_2: 80,
  room_price_4: 120,
  imag1: 'image1.jpg',
  imag2: 'image2.jpg',
  imag3: 'image3.jpg',
  imag4: 'image4.jpg',
  imag5: 'image5.jpg',
  imag6: 'image6.jpg',
  imag7: 'image7.jpg',
  imag8: 'image8.jpg',
  imag9: 'image9.jpg',
  imag10: 'image10.jpg',
};


const Settings = () => {



  const dispatch = useDispatch()
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


		  const logoutHandler = () => {
			dispatch(logout())
			router.push('/authentication/sign-in')
			window.location.reload();
			
		  };

          useEffect(() => {
            if (userInfo) {
              // Parse the expiration time string into components
              const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
        
              // Create a Date object with the parsed components
              const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);
        
              // Calculate the remaining time in milliseconds
              const timeRemaining = expirationDateTime - new Date();
        
              if (timeRemaining > 0) {
                // Set up a timeout to update the state when the expiration time is reached
                const timeout = setTimeout(() => setHasExpired(true), timeRemaining);
        
                // Clean up the timeout on component unmount or when expirationTime changes
                return () => clearTimeout(timeout);
              } else {
                // If the expiration time has already passed, update the state immediately
                setHasExpired(true);
              }
            }
          }, [expirationTime, userInfo]);
        

    
    
      useEffect(() => {
      if (hasExpired) {
        logoutHandler()
      }
        }, [hasExpired]);
      
    


  return (
    <Container fluid className="p-6">

      {/* Page Heading */}
      <PageHeading heading="General" />

      {/* General Settings */}
      <Hostelinformation defaultValue={defaultValue}/>

      {/* Email Settings */}
      {/* // DONE ... <EmailSetting /> */}
      <HostelImage defaultValue={defaultValue}/>

      {/* Settings for Preferences */}
      {/* // DONE ...<Preferences /> */}
      <NewStaff/>
      


      {/* <DeleteImage/> */}

      {/* Settings for Notifications */}
      {/* <Notifications /> */}

      <NewRooms />


      {/* Delete Your Account */}
      <CloseHostel />

    </Container>
  )
}

export default Settings