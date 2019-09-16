import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from "react-router-dom";
import { IconButton, MenuItem, Drawer } from '@material-ui/core';
import {login} from '../../store/actions/';
import MenuIcon from '@material-ui/icons/Menu';
import { APP_ROUTES } from '../../config';
import Loader from '../loader/loader';


class Header extends Component {

	constructor(props) { 
		super(props);
		
		this.state = {
			openDrawer : false,
		}
	}

	logout(){

		// CLEAR THE LOCALSTORAGE
		localStorage.removeItem('woo-app');

		// LOGOUT
		this.props.login(false);

		// DISPATCH THE LOGOUT ACTION TO CLEAR THE STORE
		this.props.dispatch({
			type : "LOGOUT"
		});

	}

	handleClickMenu(){
		
		this.setState({ openDrawer:  true });
		document.body.classList.add('overflow-hidden');
	}

	handleClickSearch(){
		this.props.showKiboSearchBar(true);
	}

	handleClickCategory(){
		(this.props.CHECKED_PRODUCTS.length > 0) ? this.props.showClearSelectedElementsConfirmation(true) : this.props.showKiboCategories(true);
	}
	
	handleClose(){
		this.setState({ openDrawer: false });
	}
	
	changeTheLanguage(){
		this.props.changeLanguage( (this.props.language === 'fr') ? 'ar' : 'fr' );
		this.handleClose();
	}

	render() {

		if(!this.state.openDrawer)
			document.body.classList.remove('overflow-hidden');
		
		return (
			<header id="header">
				<div className="wrapper">

					<IconButton onClick={this.handleClickMenu.bind(this)} id="menu-icon" color="inherit" aria-label="Menu">
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
					open={this.state.openDrawer}
					anchor="right" 
                    onClose={this.handleClose.bind(this)}
				>
					<MenuItem>
						<span id="connected-user">
							GREETING , {this.props.USER.user_display_name || this.props.USER.user_nicename}
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
						<button onClick={this.logout.bind(this)}>
							SIGN OUT 
						</button>
					</MenuItem>
				</Drawer>
			</header>
		)
	}
};


const mapStateToProps = (state) => {
    return {
		USER 				: state.USER
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
			login
        }, dispatch ),

        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);