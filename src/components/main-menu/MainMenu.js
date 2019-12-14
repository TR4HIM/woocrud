import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { MenuItem, Drawer } from '@material-ui/core';
import { APP_ROUTES } from '../../config';

const MainMenu = ( {open = false , user , logout , handleClose}) => {

	return (
		<div id="app-menu">
			<Drawer
				id="main-menu" 
				open={open}
				anchor="right" 
				onClose={handleClose}
			>
				<MenuItem>
					<span id="connected-user">
						Welcome, <br /> { user.user_nicename }
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
						USER SETTINGS
					</NavLink>
				</MenuItem>
				<MenuItem className="logout" >
					<button onClick={logout}>
						SIGN OUT 
					</button>
				</MenuItem>
			</Drawer>
		</div>
	)
};

MainMenu.propTypes = {
    open : PropTypes.bool,
    user : PropTypes.object,
    logout : PropTypes.func,
    handleClose: PropTypes.func
}

export default MainMenu;