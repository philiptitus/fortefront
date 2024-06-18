'use client'
// import node module libraries
import { Fragment, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname   } from 'next/navigation'
import { useMediaQuery } from 'react-responsive';
import {
	ListGroup,
	Card,
	Image,
	Badge,
} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import routes file
import { DashboardMenu } from 'routes/DashboardRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from 'store/actions/userAction';

const NavbarVertical = (props) => {
	const location = usePathname ()
	const dispatch = useDispatch();
	const [userdata, setUserdata] = useState(null);

	const [tokenExpired, setTokenExpired] = useState(false);
	const router = useRouter()

	const userLogin = useSelector(state => state.userLogin);
	const { userInfo } = userLogin;
  
  
  
	const [hasExpired, setHasExpired] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
    const expirationTime = userInfo?.expiration_time

	const [hiddenRoutes, setHiddenRoutes] = useState([]);


	useEffect(() => {
		if (!userInfo || !("access" in userInfo)) {
		  dispatch(logout());
	
		}
	  }, [dispatch, userInfo]);

	  useEffect(() => {
		if (!userInfo) {
		  router.push('/authentication/sign-in')
		}
		  }, [router,userInfo]);


		  const logoutHandler = () => {
			dispatch(logout())
			router.push('/authentication/sign-in')
			window.location.reload();
			
		  };


		  
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
	if (hasExpired) {
	  logoutHandler()
	}
	  }, [hasExpired]);
	
	
	
	  

    useEffect(() => {
        // Retrieve the user data from localStorage
        const userPrimary = localStorage.getItem('userPrimary');

        if (userPrimary) {
            // Parse the JSON string into an object
            setUserdata(JSON.parse(userPrimary));
        }
    }, []);


	useEffect(() => {
		if (userdata) {
			let routes = [];
			if (userdata?.user_type === "admin") {
				routes = ['Hostel', 'Sign In', 'Sign Up', 'Forget Password', '404 Error', 'Authentication'];
			} else if (userdata?.user_type === "staff") {
				routes = ['Hostel Settings','Hostel', 'Sign In', 'Sign Up', 'Forget Password', '404 Error', 'Authentication'];
			} else if (userdata?.user_type === "student") {
				routes = ['Hostel Settings', 'Hostel', 'Sign In', 'Sign Up', 'Forget Password', '404 Error', 'Authentication', 'New Hostel'];
			}
			setHiddenRoutes(routes);
		}
	}, [userdata]);
	
	// Function to filter out hidden routes recursively
	const filterMenu = (menu) => {
		return menu.filter(item => {
			if (hiddenRoutes.includes(item.title || item.name)) {
				return false;
			}
			if (item.children) {
				item.children = filterMenu(item.children);
			}
			return true;
		});
	};
	
	// Filter the DashboardMenu to exclude hidden routes
	const filteredMenu = filterMenu(DashboardMenu);
	const CustomToggle = ({ children, eventKey, icon }) => {
		const { activeEventKey } = useContext(AccordionContext);
		const decoratedOnClick = useAccordionButton(eventKey, () =>
			console.log('totally custom!')
		);
		const isCurrentEventKey = activeEventKey === eventKey;
		return (
			<li className="nav-item">
				<Link
					href="#"
					className="nav-link "
					onClick={decoratedOnClick}
					data-bs-toggle="collapse"
					data-bs-target="#navDashboard"
					aria-expanded={isCurrentEventKey ? true : false}
					aria-controls="navDashboard">
					{icon ? <i className={`nav-icon fe fe-${icon} me-2`}></i> : ''}{' '}
					{children}
				</Link>
			</li>
		);
	};
	const CustomToggleLevel2 = ({ children, eventKey, icon }) => {
		const { activeEventKey } = useContext(AccordionContext);
		const decoratedOnClick = useAccordionButton(eventKey, () =>
			console.log('totally custom!')
		);
		const isCurrentEventKey = activeEventKey === eventKey;
		return (
			(<Link
				href="#"
				className="nav-link "
				onClick={decoratedOnClick}
				data-bs-toggle="collapse"
				data-bs-target="#navDashboard"
				aria-expanded={isCurrentEventKey ? true : false}
				aria-controls="navDashboard">
				{children}
			</Link>)
		);
	};

	const generateLink = (item) => {
		return (
			(<Link
				href={item.link}
				className={`nav-link ${location === item.link ? 'active' : ''
					}`}
				onClick={(e) =>
					isMobile ? props.onClick(!props.showMenu) : props.showMenu
				}>

				{item.name}
				{''}
				{item.badge ? (
					<Badge
						className="ms-1"
						bg={item.badgecolor ? item.badgecolor : 'primary'}
					>
						{item.badge}
					</Badge>
				) : (
					''
				)}

			</Link>)
		);
	};

	const isMobile = useMediaQuery({ maxWidth: 767 });

	return (
		<Fragment>
			<SimpleBar style={{ maxHeight: '100vh' , backgroundColor:"black"}}>
				<div className="nav-scroller">
					<Link href="/" className="navbar-brand">
						<Image src="/images/brand/logo/logo.png" alt="logo" />
					</Link>
				</div>				
				{/* Dashboard Menu */}
				<Accordion defaultActiveKey="0" as="ul" className="navbar-nav flex-column">
					{filteredMenu.map(function (menu, index) {
						if (menu.grouptitle) {
							return (
								<Card bsPrefix="nav-item" key={index}>
									{/* group title item */}
									<div className="navbar-heading">{menu.title}</div>
									{/* end of group title item */}
								</Card>
							);
						} else {
							if (menu.children) {
								return (
									<Fragment key={index}>
										{/* main menu / root menu level / root items */}
										<CustomToggle eventKey={index} icon={menu.icon}>
											{menu.title}
											{menu.badge ? (
												<Badge className="ms-1" bg={menu.badgecolor ? menu.badgecolor : 'primary'}>
													{menu.badge}
												</Badge>
											) : ('')}
										</CustomToggle>
										<Accordion.Collapse eventKey={index} as="li" bsPrefix="nav-item">
											<ListGroup as="ul" bsPrefix="" className="nav flex-column">
												{menu.children.map(function (menuLevel1Item, menuLevel1Index) {
													if (menuLevel1Item.children) {
														return (
															<ListGroup.Item as="li" bsPrefix="nav-item" key={menuLevel1Index}>
																{/* first level menu started  */}
																<Accordion defaultActiveKey="0" className="navbar-nav flex-column">
																	<CustomToggleLevel2 eventKey={0}>
																		{menuLevel1Item.title}
																		{menuLevel1Item.badge ? (
																			<Badge className="ms-1" bg={
																					menuLevel1Item.badgecolor ? menuLevel1Item.badgecolor : 'primary'
																				}>
																				{menuLevel1Item.badge}
																			</Badge>
																		) : ('')}
																	</CustomToggleLevel2>
																	<Accordion.Collapse eventKey={0} bsPrefix="nav-item">
																		<ListGroup as="ul" bsPrefix="" className="nav flex-column">
																			{/* second level menu started  */}
																			{menuLevel1Item.children.map(function (menuLevel2Item,menuLevel2Index) {
																				if (menuLevel2Item.children) {
																					return (
																						<ListGroup.Item as="li" bsPrefix="nav-item" key={menuLevel2Index}>
																							{/* second level accordion menu started  */}
																							<Accordion defaultActiveKey="0" className="navbar-nav flex-column">
																								<CustomToggleLevel2 eventKey={0}>
																									{menuLevel2Item.title}
																									{menuLevel2Item.badge ? (
																										<Badge className="ms-1" bg={
																												menuLevel2Item.badgecolor ? menuLevel2Item.badgecolor : 'primary'
																											}>
																											{menuLevel2Item.badge}
																										</Badge>
																									) : ('')}
																								</CustomToggleLevel2>
																								<Accordion.Collapse eventKey={0} bsPrefix="nav-item">
																									<ListGroup as="ul" bsPrefix="" className="nav flex-column">
																										{/* third level menu started  */}
																										{menuLevel2Item.children.map(function (menuLevel3Item,menuLevel3Index) {
																											return (
																												<ListGroup.Item key={menuLevel3Index} as="li" bsPrefix="nav-item">
																													{generateLink(menuLevel3Item)}
																												</ListGroup.Item>
																											);
																										})}
																										{/* end of third level menu  */}
																									</ListGroup>
																								</Accordion.Collapse>
																							</Accordion>
																							{/* end of second level accordion */}
																						</ListGroup.Item>
																					);
																				} else {
																					return (
																						<ListGroup.Item key={menuLevel2Index} as="li" bsPrefix="nav-item">
																							{generateLink(menuLevel2Item)}
																						</ListGroup.Item>
																					);
																				}
																				
																			})}
																			{/* end of second level menu  */}
																		</ListGroup>
																	</Accordion.Collapse>
																</Accordion>
																{/* end of first level menu */}
															</ListGroup.Item>
														);
													} else {
														return (
															<ListGroup.Item as="li" bsPrefix="nav-item" key={menuLevel1Index}>
																{/* first level menu items */}
																{generateLink(menuLevel1Item)}
																{/* end of first level menu items */}
															</ListGroup.Item>
														);
													}
												})}
											</ListGroup>
										</Accordion.Collapse>
										{/* end of main menu / menu level 1 / root items */}
									</Fragment>
								);
							} else {
								return (
									<Card bsPrefix="nav-item" key={index}>
										{/* menu item without any childern items like Documentation and Changelog items*/}
										<Link href={menu.link} className={`nav-link ${location === menu.link ? 'active' : ''} ${menu.title === 'Developer Resources' ? 'bg-warning text-white' : ''}`}>
											{typeof menu.icon === 'string' ? (
												<i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
											) : (menu.icon)}
											{menu.title} 
											{menu.badge ? (
												<Badge className="ms-1" bg={menu.badgecolor ? menu.badgecolor : 'primary'}>
													{menu.badge}
												</Badge>
											) : ('')}
										</Link>
										{/* end of menu item without any childern items */}
									</Card>
								);
							}
						}
					})}
				</Accordion>
				{/* end of Dashboard Menu */}
				
			</SimpleBar>
		</Fragment>
	);
};

export default NavbarVertical;
