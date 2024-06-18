'use client'



import React, { useEffect, useState } from "react";
import { Col, Row, Container, Card, InputGroup, FormControl, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { MoreVertical, ChevronDown, Build, Flag, AttachMoney, AirlineSeatIndividualSuite, AccountCircle, Check } from 'react-feather';
import axiosInstance from "store/axiosinstance/axiosinstance";
import { useRouter } from 'next/navigation';
import { deleteNotice } from "store/actions/hostelActions";

// Import actions
import { logout } from "store/actions/userAction";


const FolderList = ({ type, detail, id, onDelete }) => {
    // let iconComponent;

    // // Conditional check for the icon based on the notification type
    // if (type === 'maintenance') {
    //     iconComponent = <Build />;
    // } else if (type === 'complaints') {
    //     iconComponent = <Flag />;
    // } else if (type === 'payment') {
    //     iconComponent = <AttachMoney />;
    // } else if (type === 'accommodation') {
    //     iconComponent = <AirlineSeatIndividualSuite />;
    // } else if (type === 'account') {
    //     iconComponent = <AccountCircle />;
    // } else {
    //     iconComponent = null; // Provide a default icon or leave it blank if needed
    // }

    return (
        <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="me-3">
                        {/* <div className="icon-shape icon-md border p-3 rounded-circle bg-light">
                            {iconComponent}
                        </div> */}
                    </div>
                    <div>
                        <h5 className="mb-1">{type}</h5>
                        <p className="mb-0 text-muted">{detail}</p>
                    </div>
                </div>
                <div onClick={() => onDelete(id)} className="cursor-pointer">
                    <Check color="green" size={20} />
                </div>
            </Card.Body>
        </Card>
    );
};

const Profile = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const dispatch = useDispatch();
    const router = useRouter();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const noticeDelete = useSelector((state) => state.noticeDelete);
    const { success, error: deleteError } = noticeDelete;

    useEffect(() => {
        if (!userInfo || !("access" in userInfo)) {
            dispatch(logout());
            router.push('/authentication/sign-in');
        }
    }, [dispatch, router, userInfo]);

    useEffect(() => {
        if (deleteError) {
            setError(deleteError);
        } else if (success) {
            setError(null);
            setNotifications(notifications.filter(notif => notif.id !== success.id));
        }
    }, [deleteError, success,notifications]);

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
            const response = await axiosInstance.get(`/api/students/notifications/?name=${searchText}&page=${page}`, config);
            setNotifications(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [page, searchText, success, userInfo?.token]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleDelete = (id) => {
        dispatch(deleteNotice(id));
    };

    return (
        <Container fluid className="p-6">
            <div className="py-6">
                <Row>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {/* <ProjectsContributions
                        notifications={notifications}
                        loading={loading}
                        onLoadMore={handleLoadMore}
                        hasMore={page < totalPages}
                        onDelete={handleDelete}
                    /> */}

<Col xl={12} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">Recent Notifications</Card.Title>
                    <InputGroup className="mb-4">
                        <FormControl
                            placeholder="Search Notifications"
                            aria-label="Search Notifications"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                    {notifications.map((item, index) => (
                        <FolderList
                        key={index}
                            type={item?.notification_type}
                            detail={item?.message}
                            id={item?.id}
                            onDelete={handleDelete}
                        />
                    ))}
                    {notifications.length > 9 && (
                        <div className="text-center mt-4">
                            <ChevronDown size="24px" className="text-muted" onClick={handleLoadMore} />
                        </div>
                    )}
                    {loading && <Spinner animation="grow" variant="danger" />}
                </Card.Body>
            </Card>
        </Col>

                </Row>
            </div>
        </Container>
    );
}

export default Profile;
