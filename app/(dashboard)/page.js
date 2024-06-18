'use client'
import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { StatRightTopIcon } from "widgets";
import { ActiveProjects, Teams, TasksPerformance, ActivePayments } from "sub-components";
import useProjectsStats from "data/dashboard/ProjectsStatsData";
import { useRouter } from "next/navigation";
import { logout } from "store/actions/userAction";



const Home = () => {
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


	const [tokenExpired, setTokenExpired] = useState(false);
	const router = useRouter()


	const [hasExpired, setHasExpired] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
    const expirationTime = userInfo?.expiration_time
const dispatch = useDispatch()


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
	












    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');

        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);


    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading: userLoading, success: userSuccess } = userDetails;
  

    const { stats, loading } = useProjectsStats();

    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
            <Row>
    <Col lg={12} md={12} xs={12}>
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                    <h6 className="mb-0 text-white">Welcome {userInfo?.email} : )</h6>
                </div>
                {userdata?.user_type === "student" && !userdata?.hostel && (
                    <div>
                        <Link href="/pages/hostels" className="btn btn-white">Search For A Hostel</Link>
                    </div>
                )}
                {userdata?.user_type === "admin" && !userdata?.hostel && (
                    <div>
                        <Link href="/pages/newhostel" className="btn btn-white">Make Your Hostel</Link>
                    </div>
                )}
            </div>
        </div>
    </Col>
    {loading ? (
        <Col lg={12} className="d-flex justify-content-center">
            <Spinner animation="border" />
        </Col>
    ) : (
        <>
            {userdata?.user_type === "admin" && userdata?.hostel && stats.map((item, index) => (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                    <StatRightTopIcon info={item} />
                </Col>
            ))}
        </>
    )}
</Row>


                <ActiveProjects user={userdata}/>

{userdata?.user_type === "admin"   &&
                <ActivePayments/>

}

{userdata?.user_type === "student"   &&
                <ActivePayments/>

}
                {userdata?.user_type === "admin" && userdata?.hostel &&

                <Row className="my-6">
                    <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                        <TasksPerformance />
                    </Col>
                    <Col xl={8} lg={12} md={12} xs={12}>
                        <Teams />
                    </Col>
                </Row>
                }

            </Container>
        </Fragment>
    );
};

export default Home;

