// import node module libraries
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Col, Card, Dropdown, Image, Alert, Spinner } from 'react-bootstrap';
import { MoreVertical, ChevronDown } from 'react-feather';
import RoomDetails from "./RoomDetails";
import RoomForm from "./RoomForm";
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useSelector, useDispatch } from 'react-redux';

// import required data files
import EditRoom from "./EditRoom";
import { deleteRoom } from 'store/actions/hostelActions';

const RecentFromBlog = () => {
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

  const roomDelete = useSelector((state) => state.roomDelete);
    const { loading: loadingRoom, error: errorRoom, success:successRoom } = roomDelete;
    
    const roomEdit = useSelector((state) => state.roomEdit);
  const {  success } = roomEdit;
  

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchText] = useState(""); // Assuming searchText is needed
    const [alert, setAlert] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {

    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            setLoading(true);

            const response = await axiosInstance.get(`/api/hostels/rooms/?name=${searchText}&page=${page}`, config);
            setPosts(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {

                setLoading(false);
        }
    };
    fetchData();
}, [page, userInfo?.token, successRoom, success]); // Include userInfo?.token as a dependency



useEffect(() => {

    if (successRoom) {
            setAlert({ type: 'success', message: 'Room deleted successfully.' });
            // window.location.reload();

      }

      if (success) {
        setAlert({ type: 'success', message: 'Room Information Changed.' });
        // window.location.reload();

  }
      if (errorRoom) {
            setAlert({ type: 'danger', message: errorRoom });
        }

}, [ successRoom, errorRoom, success]); // Include userInfo?.token as a dependency






    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
      };
    

    const handleDeleteRoom = async (roomId) => {
        setDeleting(true);
        try {
            await dispatch(deleteRoom(roomId));
            // setAlert({ type: 'success', message: 'Room deleted successfully.' });
            fetchData();
        } catch (error) {
            console.log(error)
            // setAlert({ type: 'danger', message: 'Error deleting room.' });
        } finally {
            setDeleting(false);
        }
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        (<Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>)
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = ({ room }) => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted" />
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="1">
                        <RoomDetails roomId={room.id} />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                        <EditRoom roomAvailable={room.isAvailable} roomNumber={room.room_number} id={room.id} />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick={() => handleDeleteRoom(room.id)}>
                        Remove Room
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
            {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
            <Card>
                <Card.Body>
                    <Card.Title as="h4">Room Management</Card.Title>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        posts.map((item, index) => {
                            return (
                                <div className="d-md-flex justify-content-between align-items-center mb-4" key={index}>
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <div className={`icon-shape icon-md border p-4 rounded-1 ${item.brandLogoBg}`}>
                                                <Image src={item.brandLogo} alt="" />
                                            </div>
                                        </div>
                                        {/* text */}
                                        <div className="ms-3 ">
                                            <h5 className="mb-1">
                                                <Link href="#" className="text-inherit">ROOM NO  :{item.id}</Link>
                                            </h5>
                                            <p className="mb-0 fs-5 text-muted">Capacity : {item.capacity}</p>
                                            <p className="mb-0 fs-5 text-muted">Available : {item.isAvailable ? "YES" : "NO"}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center ms-10 ms-md-0 mt-3">
                                        <div>
                                            {/* dropdown */}
                                            <ActionMenu room={item} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    {loadingMore ? (
                        <div className="d-flex justify-content-center mt-4">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                         (
                            <div onClick={handleLoadMore} className="d-flex justify-content-center mt-4">
                                <ChevronDown onClick={handleLoadMore} size="24px" className="text-muted" />
                            </div>
                        )
                    )}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default RecentFromBlog;
