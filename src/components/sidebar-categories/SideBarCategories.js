import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { MenuItem, Drawer } from '@material-ui/core';
import { APP_ROUTES } from '../../config';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

const SideBarCategories = ( {open = false , categories , handleClose , selectedCategory}) => {

	return (
		<div>
			<Drawer
				id="sidebar-categories" 
				open={open}
				anchor="left" 
				onClose={handleClose}
			>
				<List>
					<ListItem button id="sidebar-categories-title">
						<ListItemText primary="Filter By Category" />
					</ListItem>
					<ListItem button onClick={() => selectedCategory("all")}>
						<ListItemText primary="All" />
					</ListItem>
					{categories.map((cat) => (
						<ListItem button key={cat.id} onClick={() => selectedCategory(cat.id)}>
							<ListItemText primary={cat.name} />
						</ListItem>
					))}
				</List>
			</Drawer>
		</div>
	)
};

SideBarCategories.propTypes = {
    open : PropTypes.bool,
    user : PropTypes.object,
    logout : PropTypes.func,
    handleClose: PropTypes.func,
    selectedCategory: PropTypes.func,
}

export default SideBarCategories;