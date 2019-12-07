import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { MenuItem, Drawer } from '@material-ui/core';
import { APP_ROUTES } from '../../config';

const SideBarCategories = ( {open = false , user , logout , handleClose}) => {

	return (
		<div id="sidebar-categories">
			<Drawer
				id="categories-menu" 
				open={open}
				anchor="left" 
				onClose={handleClose}
			>
				<MenuItem>
					<span id="connected-user">
						Categories
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
			</Drawer>
		</div>
	)
};

SideBarCategories.propTypes = {
    open : PropTypes.bool,
    user : PropTypes.object,
    logout : PropTypes.func,
    handleClose: PropTypes.func
}

export default SideBarCategories;