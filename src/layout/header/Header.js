import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from "react-router-dom";
import { IconButton, MenuItem, Drawer } from '@material-ui/core';
import {login} from '../../pages/login/actions';
import {showKiboCategories,showClearSelectedElementsConfirmation} from '../../pages/kibo-products/actions';
import {showKiboSearchBar} from '../actions';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import LaunchIcon from '@material-ui/icons/Launch';
import { APP_ROUTES, SHOP_PAGE_LINK } from '../../config';
import translate from '../../components/kiboTranslate/Translator';
import KiboLoader from '../../components/KiboLoader';


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
						<img src={`${process.env.PUBLIC_URL}/img/kibo.png`} alt="kibo.ma" />
					</span>
					
					{ 
						this.props.search ? 
						<IconButton onClick={this.handleClickSearch.bind(this)} id="search-icon"  color="inherit" aria-label="Recherche">
							<SearchIcon />
						</IconButton> : null
					}

					{
						this.props.categories ? 
						<IconButton onClick={this.handleClickCategory.bind(this)} id="category-icon"  color="inherit" aria-label="Catergories">
							<FilterList  />
						</IconButton> : null
					}
					
					{/* LOADER */}
					<KiboLoader type="linear" id="header-loader" />
				</div>

				
				<Drawer
					id="main-menu" 
					open={this.state.openDrawer}
					anchor="right" 
                    onClose={this.handleClose.bind(this)}
				>
					<MenuItem>
						<span id="connected-user">
							{this.props.t('GREETING')}, {this.props.USER.user_display_name || this.props.USER.user_nicename}
						</span>
					</MenuItem>
					<MenuItem>
						<NavLink activeClassName='selected' to={APP_ROUTES.MY_PRODUCTS}>
							{this.props.t('MY_PRODUCTS')}
						</NavLink>
					</MenuItem>
					<MenuItem>
						<NavLink activeClassName='selected' to={APP_ROUTES.ADD_PRODUCTS}>
							{this.props.t('ADD_PRODUCT')}
						</NavLink>
					</MenuItem>
					<MenuItem>
						<NavLink activeClassName='selected' to={APP_ROUTES.CODE_VALIDATION}>
							{this.props.t('VALIDATE_CODE_PROMO')}
						</NavLink>
					</MenuItem>
					<MenuItem>
						<NavLink activeClassName='selected' to={APP_ROUTES.PARAMETERS}>
							{this.props.t('SETTINGS')}
						</NavLink>
					</MenuItem>
					<MenuItem>
						<NavLink activeClassName='selected' to={APP_ROUTES.REQUESTED_PRODUCT}>
							{this.props.t('REQUEST_PRODUCT')}
						</NavLink>
					</MenuItem>
					<MenuItem>
						<a id="goto-shop" href={`${SHOP_PAGE_LINK}/${this.props.USER.user_nicename}`} target="_blank" rel="noopener noreferrer"  >
							{this.props.t('MY_SHOP')} <LaunchIcon/>
						</a>
					</MenuItem>
					<MenuItem className="logout" >
						<button onClick={this.logout.bind(this)}>
							{this.props.t('SIGN_OUT')}
						</button>
					</MenuItem>

					<MenuItem className="language" >
						<button onClick={this.changeTheLanguage.bind(this)}>
							{this.props.t('KIBO_LANGUAGE')}
						</button>
					</MenuItem>
				</Drawer>
				
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
			showKiboCategories,
			showKiboSearchBar,
			showClearSelectedElementsConfirmation,
        }, dispatch ),

        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate(Header));