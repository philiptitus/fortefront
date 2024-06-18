import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';
import {
    Row,
    Col,
    Dropdown,
    ListGroup,
    Image
} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { logout } from 'store/actions/userAction';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { getUserDetails } from 'store/actions/userAction';
import { API_URL } from 'store/constants/userConstants';
import { useRouter } from 'next/navigation';


const useMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
};



const QuickMenu = () => {
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading: userLoading, success: userSuccess, hostel } = userDetails;
  
    const router = useRouter();


    useEffect(() => {
      dispatch(getUserDetails('profile'));
      console.log(" i am being triggered")
    }, [dispatch]);
  

    const hasMounted = useMounted();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    });

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');
  
        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                const response = await axiosInstance.get(`/api/students/notifications/?page=1`, config);
                setNotifications(response.data.results.slice(0, 5)); // Displaying first 5 notifications
            } catch (error) {
                setError('Error fetching notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userInfo]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/authentication/sign-in');
        console.log("logging out")
    
    };

    const Notifications = () => {
        if (loading) {
            return <Spinner animation="grow" variant="primary" className="me-2" />;
        }

        if (error) {
            return <Alert variant="danger"><ExclamationTriangleFill size={25} className="me-1" />{error}</Alert>;
        }

        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {notifications.length === 0 ? (
                        <ListGroup.Item>No notifications available</ListGroup.Item>
                    ) : (
                        notifications.map((notification, index) => (
                            <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={notification.id}>
                                <Row>
                                    <Col>
                                        <Link href="#" className="text-muted">
                                            <h5 className=" mb-1">{notification.notification_type}</h5>
                                            <p className="mb-0"> {notification.message}</p>
                                        </Link>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>
            </SimpleBar>
        );
    };

    const QuickMenuDesktop = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="stopevent">
                    <Dropdown.Toggle as="a"
                        bsPrefix=' '
                        id="dropdownNotification"
                        className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
                        <i className="fe fe-bell"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="dropdownNotification"
                        align="end"
                        show>
                        <Dropdown.Item className="mt-3" bsPrefix=' ' as="div">
                            <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                                <span className="h4 mb-0">Notifications</span>
                                <Link href="/" className="text-muted">
                                </Link>
                            </div>
                            <Notifications />
                            <div className="border-top px-3 pt-3 pb-3">
                                <Link href="/dashboard/notification-history" className="text-link fw-semi-bold">
                                    See all Notifications
                                </Link>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={API_URL + userdata?.avi} className="rounded-circle" />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                        show>
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{userInfo?.email}</h5>
                                <Link 
                                
                                href={{
                                    pathname: '/pages/profile',
                                    query: { id: user?.hostel },
                                  }}
                                
                                className="text-inherit fs-6">View Profile
                                </Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item className="text-primary">
                            <Link href="https://mrphilip.pythonanywhere.com/portfolio/forte" className="text-inherit fs-6">
                                <i className="fe fe-star me-2"></i> About This App
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <Link href="/pages/settings" className="text-inherit fs-6">
                                <i className="fe fe-settings me-2"></i> Account Settings
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        );
    };
    
    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="stopevent">
                    <Dropdown.Toggle as="a"
                        bsPrefix=' '
                        id="dropdownNotification"
                        className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
                        <i className="fe fe-bell"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="dropdownNotification"
                        align="end">
                        <Dropdown.Item className="mt-3" bsPrefix=' ' as="div">
                            <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                                <span className="h4 mb-0">Notifications</span>
                                <Link href="/" className="text-muted"></Link>
                            </div>
                            <Notifications />
                            <div className="border-top px-3 pt-3 pb-3">
                                <Link href="/dashboard/notification-history" className="text-link fw-semi-bold">
                                    See all Notifications
                                </Link>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src={API_URL + userdata?.avi} className="rounded-circle" />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser">
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{userInfo?.email}</h5>
                                <Link href="/pages/profile" className="text-inherit fs-6">View my profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item className="text-primary">
                            <Link href="https://mrphilip.pythonanywhere.com/portfolio/forte" className="text-inherit fs-6">
                                <i className="fe fe-star me-2"></i> About This App
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <Link href="/pages/settings" className="text-inherit fs-6">
                                <i className="fe fe-settings me-2"></i> Account Settings
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        );
    };
    

    return (
        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;
