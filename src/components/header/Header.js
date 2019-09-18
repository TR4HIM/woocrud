import React, { useState ,useEffect} from 'react';
import {connect} from 'react-redux';
import { NavLink } from "react-router-dom";
import { IconButton, MenuItem, Drawer } from '@material-ui/core';
import {login} from '../../store/actions/';
import MenuIcon from '@material-ui/icons/Menu';
import { APP_ROUTES } from '../../config';
import Loader from '../loader/loader';


const Header = ( {dispatch , USER }) => {

	const [openDrawer,setOpenDrawer] = useState(false);


	useEffect(() => {
        if(!openDrawer){
            document.body.classList.remove('overflow-hidden');
        }
    }, [openDrawer]);


	const logout = () => {
		// CLEAR THE LOCALSTORAGE
		localStorage.removeItem('woo-app');

		// LOGOUT
		dispatch(login(false));

		// DISPATCH THE LOGOUT ACTION TO CLEAR THE STORE
		dispatch({ type : "LOGOUT"});
	}

	const handleClickMenu = () => {
		
		setOpenDrawer(true);
		document.body.classList.add('overflow-hidden');
	}
	
	const handleClose = () => {
		setOpenDrawer(false);
	}

	return (
		<header id="header">
			<div className="wrapper">

				<IconButton onClick={handleClickMenu} id="menu-icon" color="inherit" aria-label="Menu">
					<MenuIcon />
				</IconButton>

				<span id="logo" >
					<img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="kibo.ma" />
				</span>
				
				
				{/* LOADER */}
				<Loader type="linear" id="header-loader" />
			</div>

			
			<Drawer
				id="main-menu" 
				open={openDrawer}
				anchor="right" 
				onClose={handleClose}
			>
				<MenuItem>
					<span id="connected-user">
						Welcome , {USER.user_display_name || USER.user_nicename}
					</span>
				</MenuItem>
				<MenuItem>
					<NavLink activeClassName='selected' to={APP_ROUTES.MY_PRODUCTS}>
						MY PRODUCTS 
					</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink activeClassName='selected' to={APP_ROUTES.ADD_PRODUCTS}>
						ADD PRODUCT
					</NavLink>
				</MenuItem>
				<MenuItem>
					<NavLink activeClassName='selected' to={APP_ROUTES.PARAMETERS}>
						USER PROFILE
					</NavLink>
				</MenuItem>
				<MenuItem className="logout" >
					<button onClick={logout}>
						SIGN OUT 
					</button>
				</MenuItem>
			</Drawer>
		</header>
	)
};

const mapStateToProps = ({USER}) => ({USER}); 

export default connect(mapStateToProps)(Header);