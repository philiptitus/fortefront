import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getOtpAction, verifyOtpAction } from 'store/actions/userAction';
import { getUserDetails } from 'store/actions/userAction';



const OtpScreen = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    
    const getOtp = useSelector((state) => state.getOtp);
    const { loading: loadingOtp, error: errorOtp, success: successOtp } = getOtp;
    
    const verifyOtp = useSelector((state) => state.verifyOtp);
    const { loading: loadingVerify, error: errorVerify, success: successVerify } = verifyOtp;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    
  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;


    const [show, setShow] = useState(false);
    
    const handleClose = () => {
        setShow(false);
        setSuccessMessage("");
        setErrorMessage("");
        setOtp(new Array(6).fill(""));
    };

    const handleShow = () => {
        dispatch(getOtpAction());
    };

    useEffect(() => {
        if (successOtp) {
            setShow(true);
        }
    }, [successOtp]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        } else if (newOtp.every(value => value !== "")) {
            handleSubmit(newOtp.join(""));
        }
    };

    const handleSubmit = (otp) => {
        dispatch(verifyOtpAction(otp));
    };

    useEffect(() => {
        if (successVerify) {
            setSuccessMessage("OTP verification successful :)");
            setTimeout(() => {
                handleClose();
            }, 2000);
        }
        if (errorVerify) {
            setErrorMessage(errorVerify);
            setOtp(new Array(6).fill(""));
            inputRefs.current[0].focus();
        }
    }, [successVerify, errorVerify]);

    useEffect(() => {
        if (show) {
            inputRefs.current[0].focus();
        }
    }, [show]);

//     useEffect(() => {

//         dispatch(getUserDetails('profile'));

//   }, [dispatch,  user]);

    return (
        <Fragment>
            
            {loadingOtp ? (
                <Button variant="primary" disabled>
                    <Spinner animation="grow" variant="danger" className="me-2" />
                </Button>
            ) : 
            
            user?.is_verified ? (
                <Button variant="success" >
                ACCOUNT VERIFIED YOU ARE SAFE
            </Button>

            ) :
            (
                
                
                <Button variant="primary" onClick={handleShow}>
                    Send OTP
                </Button>
            )}
            {errorOtp && (
                <Alert variant="danger" className="mt-3">
                    {errorOtp}
                </Alert>
            )}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <p>We sent an OTP to <b>{userInfo?.email}</b></p>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <div className="otp-inputs" style={{ display: 'flex', justifyContent: 'center' }}>
                            {otp.map((data, index) => (
                                <Form.Control
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    ref={el => inputRefs.current[index] = el}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        margin: '0.5rem',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                    }}
                                />
                            ))}
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default OtpScreen;
