import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Image, Dropdown } from 'react-bootstrap';
import { MoreVertical, ChevronDown, User } from 'react-feather'; // Import User icon
import MaintenanceForm from './MaintenanceForm';
import EditMaintenance from './EditMaintenance';
import NewMaintenance from './NewMaintenance';
import axiosInstance from 'store/axiosinstance/axiosinstance';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetails } from 'store/actions/userAction';

const MyTeam = () => {
    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading: userLoading, success: userSuccess } = userDetails;
    const maintenanceCreate = useSelector(state => state.maintenanceCreate);
    const { loading: loadingMaintenance, error: errorMaintenance, success: successMaintenanceCreate } = maintenanceCreate;
  
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const maintenanceUpdate = useSelector((state) => state.maintenanceUpdate);
    const {  success: successMaintenance } = maintenanceUpdate;
  



    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchText] = useState(""); // Assuming searchText is needed

    const dispatch = useDispatch();

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
        if (userInfo && userInfo?.token) {
            const fetchData = async () => {
                try {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${userInfo?.token}`,
                        },
                    };

                    setLoading(true);

                    const response = await axiosInstance.get(`/api/students/maintenances/?name=${searchText}&page=${page}`, config);

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
    }, [page, userInfo?.token, successMaintenance, successMaintenanceCreate]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
      };


    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover"
        >
            {children}
        </Link>
    ));

    CustomToggle.displayName = 'CustomToggle';

    const ActionMenu = ({ maintenance }) => (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                <MoreVertical size="15px" className="text-muted" />
            </Dropdown.Toggle>
            <Dropdown.Menu align={'end'}>
                <Dropdown.Item eventKey="2"><EditMaintenance id={maintenance?.id} /></Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title as="h4">Recent Maintenance Requests
                     </Card.Title>
                     {userdata?.user_type === "student" && userdata?.hostel &&
                     <NewMaintenance />}
                {posts.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center">
                            <div>
                                <Image src={item.brandLogo} className="rounded-circle avatar-md" alt="" />
                            </div>
                            <div className="ms-3">
                                <h5 className="mb-1">Maintenance No:{item.id}</h5>
                                <h5 className="mb-1">Room No:{item.room}</h5>
                                <h5 className="mb-1">Facility:{item.facility_name}</h5>


                                <p className="text-muted mb-0 fs-5">Student Id: {item.student_name}</p>
                                {item.resolved && <p className="mb-0 fs-5 text-muted">Resolved: {item.resolved ? "YES" : "NO"}</p>}
                                {item.status && <p className="mb-0 fs-5 text-muted">Status: {item.status}</p>}
                                {item.dateRaised && <p className="mb-0 fs-5 text-muted">Date Raised: {item.date_raised}</p>}
                            </div>
                        </div>
                        <div>
                        {userdata?.user_type === "admin" && userdata?.hostel &&

                            <ActionMenu maintenance={item} />
                        }     

                                                {userdata?.user_type === "staff" && userdata?.hostel &&

                            <ActionMenu maintenance={item} />
                        }                     
                        </div>
                    </div>
                ))}
                {posts.length > 9 && (
                    <div onClick={handleLoadMore} className="d-flex justify-content-center mt-4">
                        <ChevronDown size="24px" className="text-muted" />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default MyTeam;
