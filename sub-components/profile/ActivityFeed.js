import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';
import { MoreVertical, ChevronDown, User } from 'react-feather'; // Import User icon
import NewReview from './NewReview';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useDispatch, useSelector } from 'react-redux';
import RatingStars from './RatingStars';
import { deleteReview } from 'store/actions/studentActions';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className="text-muted text-primary-hover"
    >
        {children}
    </a>
));

CustomToggle.displayName = 'CustomToggle';


const ActivityFeed = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const reviewDelete = useSelector((state) => state.reviewDelete);
  const {  success } = reviewDelete;
  const dispatch = useDispatch()
  const [deleting, setDeleting] = useState(false);


    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchText] = useState(""); // Assuming searchText is needed

    const reviewCreate = useSelector(state => state.reviewCreate);
    const { loading: loadingReview, error: errorReview, success: successReview } = reviewCreate;



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
        const fetchData = async () => {
            if (!userInfo || !userInfo?.token) return; // Ensure userInfo and token are available
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };

                setLoading(true);

                const response = await axiosInstance.get(`/api/students/reviews/?name=${searchText}&page=${page}`, config);

                setPosts(response.data.results);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, userInfo?.token, success, successReview]); // Include userInfo?.token as a dependency

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const deleteHandler = async ( reviewId ) => {

        setDeleting(true);

        try {
            await dispatch(deleteReview(reviewId));


    } catch (error) {
        console.log(error)
        // setAlert({ type: 'danger', message: 'Error deleting room.' });
    

} finally {
    setDeleting(false);
}
        
        // You may not need to reload the page here
      };


      const ActionMenu = ({ review }) => (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                <MoreVertical size="15px" className="text-muted" />
            </Dropdown.Toggle>
            <Dropdown.Menu align={'end'}>
                <Dropdown.Item  onClick={() => deleteHandler(review?.id)} eventKey="1">
                    Delete
                    </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
    

    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Card.Title as="h4">
                            All Reviews 
                        </Card.Title>
                        {userdata?.user_type === "student"  &&

                        <NewReview />
}

                        {posts.map((item) => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center mb-5">
                                <div className="d-flex">
                                    <div>
                                        <User size={40} color="#6c757d" /> {/* Use User icon */}
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="mb-1">{item.review}</h5>
                                        <p className="text-muted mb-2">
                                            <RatingStars rating={item.rating} />
                                        </p>
                                        <p className="fs-5 mb-0">{item.date_created}</p>
                                    </div>
                                </div>
                                <div>
                                    <ActionMenu review={item}/>
                                </div>
                            </div>
                        ))}

                    </Card.Body>


            { posts.length > 9 &&       <div onClick={handleLoadMore} className="d-flex justify-content-center mt-4">
                        <ChevronDown size="24px" className="text-muted" />
                    </div>}
                </Card>
            </Col>
        </Row>
    );
};

export default ActivityFeed;
