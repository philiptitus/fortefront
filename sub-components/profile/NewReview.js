import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from 'store/actions/studentActions';

const NewReview = () => {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const reviewCreate = useSelector(state => state.reviewCreate);
    const { loading: loadingReview, error: errorReview, success: successReview } = reviewCreate;

    useEffect(() => {
        if (successReview) {
            setSuccess(true);
            setRating('');
            setComment('');
        }
        if (errorReview) {
            setError(errorReview);
        }
        setLoading(loadingReview);
    }, [successReview, errorReview, loadingReview]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(createReview({ rating, comment }));
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <Fragment>
            <Button variant="primary" onClick={handleShow}>
                New Review
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {success && <Alert variant="success">Review Sent! Thanks for the feedback!</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <p>You are reviewing your latest completed accommodation</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formRating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as="select" value={rating} onChange={handleRatingChange} required>
                                <option value="">Select...</option>
                                <option value="1">1 - Very Poor</option>
                                <option value="2">2 - Poor</option>
                                <option value="3">3 - Average</option>
                                <option value="4">4 - Good</option>
                                <option value="5">5 - Excellent</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formComment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Add your comment here..."
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Submit Review'}
                        </Button>
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

export default NewReview;
