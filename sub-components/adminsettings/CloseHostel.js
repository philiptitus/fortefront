import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Col, Row, Card, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { deleteHostel } from 'store/actions/hostelActions';

import { getUserDetails, logout } from 'store/actions/userAction';
const CloseHostel = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const hostelDelete = useSelector((state) => state.hostelDelete);
  const { loading: loadingHostel, error: errorHostel, success: successHostel } = hostelDelete;
  
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
    if (userInfo) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, userInfo]);

  const handleDelete = () => {
    dispatch(deleteHostel());
  };

  return (
    <Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Close Down Your Hostel</h4>
          <p className="mb-0 fs-5 text-muted">Follow These Instructions To Shut Down Your Hostel</p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card className="mb-6">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Hostel Closure</h4>
            </div>
            <div>
              <p>Before proceeding with the deletion, please ensure the following steps are taken:</p>
              <p>1. Make sure all rooms within the hostel are empty.</p>
              <p>2. Check To Ensure That There Is No Active Accommodation.</p>
              <p>3. Check To Ensure All Payments Are Settled.</p>
              <p>Once these steps are completed, you can proceed with deleting the hostel. Please note that this action cannot be undone. We won't be responsible for any complaints from your customers as well. Goodbye! It Was Nice Having You.</p>
              {loadingHostel ? (
                <Spinner animation="grow" variant="danger" className="me-2" />
              ) : (
                <Link href="#" className="btn btn-danger" onClick={handleDelete}>Proceed</Link>
              )}
              {errorHostel && (
                <Alert variant="danger" className="mt-3">
                  {errorHostel}
                </Alert>
              )}
              {successHostel && (
                <Alert variant="success" className="mt-3">
                  Hostel successfully deleted. Redirecting...
                </Alert>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CloseHostel;
