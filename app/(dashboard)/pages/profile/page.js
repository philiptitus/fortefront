'use client'
// import node module libraries
import { Col, Row, Container } from 'react-bootstrap';
import { listHostelDetails } from 'store/actions/hostelActions';
// import widget as custom components
import { PageHeading } from 'widgets'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getUserDetails } from 'store/actions/userAction';
import { API_URL } from 'store/constants/userConstants';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "store/actions/userAction";



// import sub components
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  RecentFromBlog,
  SamplePictures
} from 'sub-components'

const Profile = () => {

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const searchParams = useSearchParams();
  let id = searchParams.get("id");
  

  const hostelDetail = useSelector((state) => state.hostelDetail);
  const { error, loading:loadingHostel, hostel } = hostelDetail;



  const [tokenExpired, setTokenExpired] = useState(false);
	const router = useRouter()


	const [hasExpired, setHasExpired] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
    const expirationTime = userInfo?.expiration_time



  const number = 7;





  const dispatch = useDispatch()

  const [userdata, setUserdata] = useState(null);







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
        dispatch(logout())
        router.push('/authentication/sign-in')      }
        }, [hasExpired]);
      






  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);


  useEffect(() => {
    if (userdata) {
      if (userdata?.hostel) {
        dispatch(listHostelDetails(userdata?.hostel));

        
      }

    }

}, [dispatch, userdata]);







  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading: userLoading, success: userSuccess } = userDetails;

  useEffect(() => {
    dispatch(getUserDetails('profile'));
  }, [dispatch]);







  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Overview"/>
      {/* Profile Header  */}
      <ProfileHeader />

      {/* content */}
      <div className="py-6">
        <Row>

          {/* About Me */}
          <AboutMe />

          {/* Projects Contributions */}
          <ProjectsContributions />

          {/* Recent From Blog */}
          {userdata?.user_type === "admin" && userdata?.hostel &&

          <RecentFromBlog />

}

{userdata?.user_type === "staff" && userdata?.hostel &&

<RecentFromBlog />

}



          <Col xl={6} lg={12} md={12} xs={12} className="mb-6">

            {/* My Team */}

            <MyTeam />

            {/* Activity Feed */}
            <ActivityFeed/>

            {userdata?.user_type === "admin" && userdata?.hostel &&
            <SamplePictures hostel={hostel}/>
}

          </Col>
        </Row>
      </div>

    </Container>
  )
}

export default Profile