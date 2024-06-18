import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';
import { MoreVertical, ChevronDown, User } from 'react-feather'; // Import User icon
import NewReview from 'sub-components/profile/NewReview';
import RatingStars from 'sub-components/profile/RatingStars';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useSelector } from 'react-redux';

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

const ActionMenu = () => (
    <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
            <MoreVertical size="15px" className="text-muted" />
        </Dropdown.Toggle>
        <Dropdown.Menu align={'end'}>
            <Dropdown.Item eventKey="1">Delete</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

const ActivityFeed2 = ({hostelB}) => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchText] = useState(""); // Assuming searchText is needed


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
        if (userInfo) {
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
    
                    const response = await axiosInstance.get(`/api/students/reviews/?hostel_id=${hostelB}&page=${page}`, config);
    
                    setPosts(response.data.results);
                    setTotalPages(response.data.total_pages);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
            
        }

    }, [page, userInfo?.token]); // Include userInfo?.token as a dependency

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <Row>
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Card.Title as="h4">
                            All Reviews 
                        </Card.Title>

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
                                </div>
                            </div>
                        ))}

                    </Card.Body>


{posts.length > 9  &&                    <div onClick={handleLoadMore} className="d-flex justify-content-center mt-4">
                        <ChevronDown size="24px" className="text-muted" />
                    </div>}
                </Card>
            </Col>
        </Row>
    );
};

export default ActivityFeed2;
