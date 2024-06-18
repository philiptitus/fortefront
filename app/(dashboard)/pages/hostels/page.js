'use client'
import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Card, InputGroup, FormControl, Form, Button, Dropdown, Spinner, Alert, Image } from 'react-bootstrap';
import { MoreVertical, ChevronDown } from 'react-feather';
import Link from 'next/link';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from 'store/actions/userAction';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { API_URL } from 'store/constants/userConstants';



const ProjectsContributions = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [genderFilter, setGenderFilter] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const [hasExpired, setHasExpired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const expirationTime = userInfo?.expiration_time;
  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (!userInfo || !("access" in userInfo)) {
      dispatch(logout());
    }
  }, [dispatch, router, userInfo]);







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
			router.push('/authentication/sign-in')    }
      }, [hasExpired, dispatch, router]);
    


  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`,
          },
        };
        setLoading(true);
        const response = await axiosInstance.get(`/api/hostels/?name=${searchText}&page=${page}`, config);
        setHostels(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchText, userInfo]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleGenderFilterChange = (e) => {
    setGenderFilter(e.target.value);
  };

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

  const ActionMenu = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <MoreVertical size="15px" className="text-muted" />
        </Dropdown.Toggle>
        <Dropdown.Menu align={'end'}>
          <Dropdown.Item eventKey="1">
            Action
          </Dropdown.Item>
          <Dropdown.Item eventKey="2">
            Another action
          </Dropdown.Item>
          <Dropdown.Item eventKey="3">
            Something else here
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <Col xl={12} lg={12} md={12} xs={12} className="mb-6">
      <Card>
        <Card.Body>
          <Card.Title as="h4">Recent Hostels</Card.Title>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Search For Hostels"
              aria-label="Search Hostels"
              aria-describedby="search-hostels"
              value={searchText}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <Form.Group controlId="genderFilter" className="mb-4">
            <Form.Label>Filter by Gender</Form.Label>
            <Form.Control as="select" value={genderFilter} onChange={handleGenderFilterChange}>
              <option value="">All</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Form.Control>
          </Form.Group>
          {loading ? (
            <div className="text-center">
              <Spinner animation="grow" variant="danger" />
            </div>
          ) : hostels.length > 0 ? (
            hostels.filter(item =>
              (genderFilter === "" || item.gender === genderFilter) &&
              (item.hostel_name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.address.toLowerCase().includes(searchText.toLowerCase()))
            ).map((hostel, index) => {
              return (
                <div className="d-md-flex justify-content-between align-items-center mb-4" key={index}>
                  <div className="d-flex align-items-center">
                    <div>
                    <Link
  href={{
    pathname: '/pages/hostel',
    query: { id: hostel?.id },
  }}
  className="text-link fw-semi-bold"
>                    <div className="icon-shape icon-md border p-4 rounded-1">
                        <Image 
  src={API_URL + hostel?.imag1} 
  alt={hostel?.hostel_name} 
  style={{ 
    width: '50px', 
    height: '50px', 
    objectFit: 'cover', 
    borderRadius: '5px', 
    border: '1px solid #ddd', 
    padding: '2px', 
    backgroundColor: '#fff' 
  }} 
/>
                        </div>
                      </Link>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-1">
                        <Link 
                        
                        href={{
                          pathname: '/pages/hostel',
                          query: { id: hostel?.id },
                        }}                        
                        className="text-inherit">{hostel?.hostel_name}</Link>
                      </h5>
                      <p className="mb-0 fs-5 text-muted">{hostel?.address}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center ms-10 ms-md-0 mt-3">
                  </div>
                </div>
              );
            })
          ) : (
            <Alert variant="danger">No hostels found.</Alert>
          )}
          {hostels.length > 9 && (
            <div className="text-center mt-4">
              <Button onClick={handleLoadMore} disabled={loading || page >= totalPages}>
                <ChevronDown size="24px" className="text-muted" />
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

const Profile = () => {
  return (
    <Container fluid className="p-6">
      <div className="py-6">
        <Row>
          <ProjectsContributions />
        </Row>
      </div>
    </Container>
  )
}

export default Profile;
