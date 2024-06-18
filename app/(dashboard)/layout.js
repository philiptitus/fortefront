'use client'
// import node module libraries
import { useState, Suspense } from 'react';

// import theme style scss file
import 'styles/theme.scss';
import store from 'store/store';
import { Provider } from "react-redux";


// import sub components
import NavbarVertical from '/layouts/navbars/NavbarVertical';
import NavbarTop from '/layouts/navbars/NavbarTop';

export default function DashboardLayout({ children }) {
	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};

	return (
		<Provider store={store}>

<Suspense fallback={<div>Loading...</div>}>


		<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
			<div className="navbar-vertical navbar">
				<NavbarVertical
					showMenu={showMenu}
					onClick={(value) => setShowMenu(value)}
				/>
			</div>
			<div id="page-content">
				<div className="header">
					<NavbarTop
						data={{
							showMenu: showMenu,
							SidebarToggleMenu: ToggleMenu
						}}
					/>
				</div>
				{children}
			</div>
		</div>

</Suspense>



		</Provider>

	)
}
