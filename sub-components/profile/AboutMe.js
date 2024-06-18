import { Col, Row, Card, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from 'store/actions/userAction';
import { API_URL } from 'store/constants/userConstants';

const AboutMe = () => {
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading: userLoading, success: userSuccess } = userDetails;

    useEffect(() => {
        dispatch(getUserDetails('profile'));
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


    if (userLoading) {
        // Return loading spinner if data is still loading
        return (
            <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
                <Card>
                    <Card.Body>
                        <Card.Title as="h4">About Me</Card.Title>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            <Card>
                <Card.Body>
                    <Card.Title as="h4">About Me</Card.Title>
                    <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Account Type</span>
                    <p className="mt-2 mb-6">{userdata?.user_type}</p>
                    <Row>
                        <Col xs={12} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Hostel</h6>
                            <p className="mb-0">{userdata?.hostel_name}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Phone</h6>
                            <p className="mb-0">{userdata?.contact_number}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">ID NUMBER</h6>
                            <p className="mb-0">{userdata?.Id_number}</p>
                        </Col>
                        <Col xs={6} className="mb-5">
                            <h6 className="text-uppercase fs-5 ls-2">Date of Birth</h6>
                            <p className="mb-0">{userdata?.date_of_birth}</p>
                        </Col>
                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">Email</h6>
                            <p className="mb-0">@{userdata?.email}</p>
                        </Col>
                        <Col xs={6}>
                            <h6 className="text-uppercase fs-5 ls-2">Location</h6>
                            <p className="mb-0">{userdata?.address}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default AboutMe;
