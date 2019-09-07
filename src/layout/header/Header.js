import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from "react-router-dom";
import { IconButton } from '@material-ui/core';
import {login} from '../../pages/login/actions';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


class Header extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			openDrawer : false,
		}
	}

	logout(){

		// CLEAR THE LOCALSTORAGE
		localStorage.removeItem('kibo-app');
		localStorage.removeItem('kibo-app-lang');

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
		console.log('He');
	}
	 

	render() {

		if(!this.state.openDrawer)
			document.body.classList.remove('overflow-hidden');
		
		return (
			<header id="header">
				<AppBar position="static">
					<Toolbar variant="dense">
						<IconButton onClick={this.handleClickMenu.bind(this)} edge="start" className="menu-class" color="inherit" aria-label="menu">
							<NavLink activeClassName='selected' to="/">
								<MenuIcon />
							</NavLink>
						</IconButton>
						<Typography variant="h6" color="inherit">
							Photos
						</Typography>
					</Toolbar>
				</AppBar>
			</header>
		)
	}
};


const mapStateToProps = (state) => {
    return {
		USER 				: state.USER,
		CHECKED_PRODUCTS 	: state.CHECKED_PRODUCTS,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators({
			login,
        }, dispatch ),

        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);