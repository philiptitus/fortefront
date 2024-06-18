import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createAccomodation } from 'store/actions/studentActions';

const NewAccommodation = ({ id }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [show, setShow] = useState(false);
    const [hostels, setHostels] = useState([]);
    const [loadingHostels, setLoadingHostels] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const accomodationCreate = useSelector((state) => state.accomodationCreate);
    const { loading: loadingAccomodation, error: errorAccomodation, success:successAccomodation, accomodation } = accomodationCreate;


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [hostelId, setHostelId] = useState(id);
    const [roomCapacity, setRoomCapacity] = useState('');
    const [roomType, setRoomType] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingHostels(true);
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };
                const response = await axios.get(`/api/hostels/?name=${searchParams.get('name')}&page=${searchParams.get('page')}`, config);
                setHostels((prevHostels) => [...prevHostels, ...response.data.results]);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Error fetching hostels:', error);
                setError('Error fetching hostels');
            } finally {
                setLoadingHostels(false);
            }
        };
        fetchData();
    }, [userInfo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(
            createAccomodation({
                hostel_id: hostelId,
                duration,
                type: roomType,
                capacity: roomCapacity
            })
        ).then(() => {
            setLoading(false);
            // setError(null);
            setHostelId(id);
            setRoomCapacity('');
            setRoomType('');
            setDuration('');
        }).catch(() => {
            setLoading(false);
            // setError('Failed to create accommodation');
            // setSuccess(null);
        });
    };

    return (
        <Fragment>
            <Button variant="primary" onClick={handleShow}>
                Create Accommodation Here
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Accommodation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            {/* <Form.Label className="col-sm-4" htmlFor="hostelId">Select Hostel</Form.Label> */}
                            <Col md={8} xs={12}>
                                <Form.Control style={{ display:"none"}} type="text" placeholder="Enter hostel ID" value={hostelId} onChange={(e) => setHostelId(e.target.value)} required />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label className="col-sm-4" htmlFor="roomCapacity">Select Room Capacity</Form.Label>
                            <Col md={8} xs={12}>
                                <Form.Control as="select" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="1">Single Room</option>
                                    <option value="2">2-person Room</option>
                                    <option value="4">4-person Room</option>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label className="col-sm-4" htmlFor="roomType">Select Room Type</Form.Label>
                            <Col md={8} xs={12}>
                                <Form.Control as="select" value={roomType} onChange={(e) => setRoomType(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="Empty">Empty Room</option>
                                    <option value="Occupied">Occupied Room</option>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label className="col-sm-4" htmlFor="duration">Select Duration of Stay</Form.Label>
                            <Col md={8} xs={12}>
                                <Form.Control as="select" value={duration} onChange={(e) => setDuration(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="1">1 Month</option>
                                    <option value="2">2 Months</option>
                                    <option value="3">3 Months</option>
                                    <option value="4">4 Months</option>
                                </Form.Control>
                            </Col>
                        </Row>

                        {errorAccomodation && <Alert variant="danger">{errorAccomodation}</Alert>}
                        {successAccomodation && <Alert variant="success">Your Accomodation Was Created Successfully. Almost There Next Step Is Paying for It In The Home Screen. Make sure to report/Pay in 24 Hours Or It will Be Cancelled.Take Note Your Accomodation Starts From The Time Of Payment Onwards. </Alert>}

                        {loadingAccomodation && <Spinner animation="border" />}
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loadingAccomodation ? 'Creating...' : 'Create Accommodation'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
}

export default NewAccommodation;
