import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { deleteAccount, logout } from 'store/actions/userAction';


const DeleteScreen = () => {
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const accountDelete = useSelector((state) => state.accountDelete);
    const { success: successDelete, error } = accountDelete;

    useEffect(() => {
        if (successDelete) {
            dispatch(logout());
            router.push('/authentication/sign-in');
                }
    }, [dispatch, successDelete, router]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = () => {
        dispatch(deleteAccount());
        setShowAlert(true);
    };

    return (
        <Fragment>
            <Button variant="danger" onClick={handleShow}>
                Delete Account
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            {error && <Alert variant="danger" className="mt-3">Error: {error}</Alert>}
            {successDelete && <Alert variant="success" className="mt-3">Account deleted successfully!</Alert>}
        </Fragment>
    );
};

export default DeleteScreen;
