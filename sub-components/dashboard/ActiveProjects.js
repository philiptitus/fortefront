import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'react-feather';
import { Spinner, Alert, Button } from 'react-bootstrap';
import { Col, Row, Card, Table, FormControl, InputGroup, DropdownButton, Dropdown, } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from 'store/actions/userAction';
import AccomodationDetails from './AccomodationDetails';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import renderOption from './RenderOprtion';
import ChangeRoom from './ChangeRooms';


const ActiveProjects = ({ user }) => {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const accomodationUpdate = useSelector((state) => state.accomodationUpdate);
    const {  error: errorAccomodation, success: successAccomodation, accomodation } = accomodationUpdate;
  
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
        setPage(1); // Reset page when filter changes
    };

    useEffect(() => {
        if (!userInfo || !("access" in userInfo)) {
            dispatch(logout());
        }
    }, [dispatch, router, userInfo]);





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
                const response = await axiosInstance.get(`/api/hostels/accomodations/?name=${searchText}&page=${page}`, config);
                console.log('API Response:', response);  // Debugging log
    
                // Check if the response is in JSON format
                if (response.headers['content-type']?.includes('application/json')) {
                    const jsonResponse = response.data;
                    console.log('JSON Response:', jsonResponse);  // Debugging log
    
                    if (jsonResponse && jsonResponse.results) {
                        const results = jsonResponse.results;
                        console.log('Results:', results);  // Debugging log
    
                        setAccommodations(prevAccommodations => {
                            const newAccommodations = page === 1 ? results : [...prevAccommodations, ...results];
                            console.log('New Accommodations:', newAccommodations);  // Debugging log
                            return newAccommodations;
                        });
    
                        setTotalPages(jsonResponse.total_pages || 1);
                    } else {
                        console.warn('Unexpected response structure:', jsonResponse);  // Debugging log
                    }
                } else {
                    console.error('Received non-JSON response:', response.data);
                    // Handle the case where the response is HTML
                    if (response.data.includes('<!doctype html>')) {
                        console.error('It looks like the server returned an HTML page. This might be due to a redirect or an error page.');
                    }
                }
            } catch (error) {
                console.error('Error fetching accommodations:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [page, searchText, userInfo, successAccomodation]);
    
    const handleLoadMore = (e) => {
        e.preventDefault();
        setPage(prevPage => prevPage + 1);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setPage(1); // Reset page when searching
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

    const ActionMenu = ({ accommodation }) => {
        const handlePayment = async (e) => {
            e.preventDefault();
            try {
                const response = await axiosInstance.post(`/api/students/pay/${accommodation?.id}/`);
                console.log('Payment response:', response.data);
    
                // Assuming the backend returns the Stripe session URL in the response
                if (response.data.url) {
                    window.location.href = response.data.url;
                } else {
                    console.error('Stripe session URL not found in the response.');
                }
            } catch (error) {
                console.error('Error during payment process:', error);
                alert('An error occurred during the payment process. Please try again.');
            }
        };
    
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    {!accommodation?.paid && user.user_type == "student" && accommodation?.status === "Delayed Payment" && 
                        <Dropdown.Item eventKey="1" onClick={handlePayment}>
                            <Button type="button">
                                Pay
                            </Button>
                        </Dropdown.Item>
                    }
                    <Dropdown.Item eventKey="2">
                            <ChangeRoom id={accommodation?.id} roomNumber={accommodation?.id}  accomStatus={accommodation?.status} isStudent={user?.user_type === "student"} isActive={accommodation?.status === "Active"}/>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                        <AccomodationDetails accomodation={accommodation} />
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };
    
    

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    console.log('Rendered Accommodations:', accommodations);  // Debugging log

    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Accommodation History</h6>
                        <div>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Search..."
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                    value={searchText}
                                    onChange={handleSearch}
                                />
                                <InputGroup.Text id="basic-addon2"><i className="bi bi-search"></i></InputGroup.Text>
                            </InputGroup>
                            <DropdownButton id="dropdown-basic-button" title="Filter">
                                <Dropdown.Item onClick={() => setSearchText('completed')}>Completed</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSearchText('active')}>Active</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSearchText('cancelled')}>Cancelled</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSearchText('new')}>New</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Table responsive className="text-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Accommodation Number</th>
                                <th>Price</th>
                                <th>Accommodation Status</th>
                                <th>Room</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accommodations && accommodations.length > 0 ? (
                                accommodations.map((item, index) => (
                                    <tr key={index}>
                                        <td className="align-middle">
                                            <div className="d-flex align-items-center">
                                                <div className="ms-3 lh-1">
                                                    <h5 className="mb-1">
                                                        <Link href="#" className="text-inherit">{item.id}</Link>
                                                    </h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{item.price}</td>
                                        <td className="align-middle">
                                            <span className={`badge bg-${item.status === 'completed' ? 'success' : item.status === 'active' ? 'warning' : 'danger'}`}>{item.status}</span>
                                        </td>
                                        <td className="align-middle">{item.room}</td>
                                        <td className="align-middle">
                                            <ActionMenu accommodation={item}/>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No accommodations found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        {accommodations.length > 9 && (
                            <Link href="#" onClick={handleLoadMore} className="link-primary">View More Accommodations</Link>
                        )}
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
}

export default ActiveProjects;
