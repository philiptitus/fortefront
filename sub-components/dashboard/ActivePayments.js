import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Spinner, Alert, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from 'store/actions/userAction';
import axiosInstance from 'store/axiosinstance/axiosinstance';


const ActivePayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();
    const router = useRouter();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDetails = useSelector((state) => state.userDetails);
    const { user } = userDetails;

    const [hasExpired, setHasExpired] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const expirationTime = userInfo?.expiration_time;

    useEffect(() => {
        if (!userInfo || !("access" in userInfo)) {
            dispatch(logout());
        }
    }, [dispatch, router, userInfo]);

;



    useEffect(() => {
        if (userInfo) {
            const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
            const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);

            setCurrentTime(new Date());
            setHasExpired(expirationDateTime < new Date());

            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }
    }, [expirationTime]);

    useEffect(() => {
        if (hasExpired) {
            logoutHandler();
        }
    }, [router, hasExpired]);

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

                const response = await axiosInstance.get(`/api/students/payments/?name=${searchText}&page=${page}`, config);
                setPayments(response.data.results);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, searchText]);

    const handleLoad = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setPage(1);
    };

    const handleButtonClick = (word) => {
        setSearchText(word);
    };

    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Payments History</h4>
                        <DropdownButton id="dropdown-basic-button" title="Filter">
                            <Dropdown.Item onClick={() => handleButtonClick('cash')}>Cash</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleButtonClick('credit_card')}>Credit Card</Dropdown.Item>
                        </DropdownButton>
                    </Card.Header>
                    <input
                        type='search'
                        placeholder='Search For Payments'
                        value={searchText}
                        onChange={handleSearch}
                        style={{
                            width: '50%',
                            padding: '8px',
                            borderRadius: '5px',
                            border: '1px solid black',
                            color: 'black',
                            background: 'white',
                        }}
                    />
                    <Table responsive className="text-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Hostel</th>
                                <th>Date</th>
                                <th>Accommodation</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Student ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <Spinner animation="grow" variant="danger" className="me-2" />
                                    </td>
                                </tr>
                            ) : payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{payment.hostel_name}</td>
                                        <td>{payment.payment_date}</td>
                                        <td>{payment.accommodation}</td>
                                        <td>{payment.amount} {payment.currency}</td>
                                        <td>{payment.payment_method}</td>
                                        <td>{payment.user_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <Alert variant="danger">No Payment Found</Alert>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        {payments.length > 9 && (
                            <button onClick={handleLoad} className="btn btn-primary">
                                Load More
                            </button>
                        )}
                        {loading && <Spinner animation="grow" variant="danger" className="me-2" />}
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
};

export default ActivePayments;
