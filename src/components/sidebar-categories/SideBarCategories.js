import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';

const SideBarCategories = ( {open = false ,currentCat , categories , handleClose , selectedCategory}) => {

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
					<ListItem selected={currentCat === 'all'} button onClick={() => selectedCategory("all")}>
						<ListItemText primary="All" />
					</ListItem>
					{categories.map((cat) => (
						<ListItem selected={currentCat === cat.id} button key={cat.id} onClick={() => selectedCategory(cat.id)}>
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