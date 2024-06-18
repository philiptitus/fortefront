'use client';

// Import necessary modules
import React, { useState , useEffect} from 'react';
import { Container, Row, Col, Card, Image, Dropdown, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import { MoreVertical, ChevronDown } from 'react-feather';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { listHostelDetails } from 'store/actions/hostelActions';
import { useSearchParams } from "next/navigation";
// Import custom components and data
import { PageHeading } from 'widgets';
import { useRouter } from "next/navigation";
import { logout } from "store/actions/userAction";



import { SamplePictures, ActivityFeed, RoomPrices } from 'sub-components';
import NewAccommodation from 'sub-components/accomodation/NewAccomodation';
import { API_URL } from 'store/constants/userConstants';
import { ActivityFeed2 } from 'sub-components';
// Custom dropdown toggle component
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Link
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-muted text-primary-hover">
    {children}
  </Link>
));
CustomToggle.displayName = 'CustomToggle';

// Action menu component
const ActionMenu = () => (
  <Dropdown>
    <Dropdown.Toggle as={CustomToggle}>
      <MoreVertical size="15px" className="text-muted" />
    </Dropdown.Toggle>
    <Dropdown.Menu align={'end'}>
      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

// ProjectsContributions component

// Profile component
const Profile = () => {
  const searchParams = useSearchParams();
  let id = searchParams.get("id");

  const hostelDetail = useSelector((state) => state.hostelDetail);
  const { error, loading:loadingHostel, hostel } = hostelDetail;

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















  useEffect(() => {
      dispatch(listHostelDetails(id));

  }, [dispatch]);

  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
      // Retrieve the user data from localStorage
      const userPrimary = localStorage.getItem('userPrimary');

      if (userPrimary) {
          // Parse the JSON string into an object
          setUserdata(JSON.parse(userPrimary));
      }
  }, []);



  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Hostel Details" />

      {/* Profile Header */}

      {loadingHostel ? 
      
      <Col lg={12} className="d-flex justify-content-center">
      <Spinner animation="border" />
  </Col>: 

<Card className="mb-4">
<Card.Body>
  <Row>
    <Col md={4}>
      <Image src={API_URL + hostel?.imag1} alt="Main Hostel" fluid />
    </Col>
    <Col md={8}>
      <h2>{hostel?.hostel_name}</h2>
      <p className="text-muted mb-1">Email: {hostel?.email}</p>
      <p className="text-muted mb-1">Location: {hostel?.address}</p>
      <p className="text-muted mb-1">Phone: {hostel?.phone}</p>
      <p className="text-muted">Capacity: {hostel?.capacity}</p>
      <p className="text-muted">Gender: {hostel?.gender}</p>

      {userdata?.user_type === "student" && !userdata?.hostel &&

      <Button variant="primary" className="mb-4"><NewAccommodation id={id}/></Button>
      }
    </Col>
  </Row>
</Card.Body>
</Card>
    }



      <Card className="mb-4">    <Card.Body>

<RoomPrices hostel={hostel}/>
</Card.Body>
</Card>

      {/* Content */}
      <div className="py-6">
        <Row>
          {/* Sample Pictures */}
          <div>
          <SamplePictures hostel={hostel} />

          </div>
<br/>
<br/>
          {/* Projects Contributions */}
          <ActivityFeed2 hostelB={id}/>
        </Row>
      </div>
    </Container>
  );
};

export default Profile;
