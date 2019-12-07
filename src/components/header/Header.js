import React, { useState ,useEffect} from 'react';
import {connect} from 'react-redux';
import { IconButton } from '@material-ui/core';
import {login} from '../../store/actions/';
import MenuIcon from '@material-ui/icons/Menu';
import Loader from '../loader/loader';
import MainMenu from '../main-menu/MainMenu';
import SideBarCategories from '../sidebar-categories/SideBarCategories';
import FilterListIcon from '@material-ui/icons/FilterList'; 

const Header = ( {dispatch , USER }) => {

	const [openMenuDrawer,setOpenMenuDrawer] 				= useState(false);
	const [openCategoriesDrawer,setOpenCategoriesDrawer] 	= useState(false);


	useEffect(() => {
        if(!openMenuDrawer && !openCategoriesDrawer){
            document.body.classList.remove('overflow-hidden');
        }
    }, [openMenuDrawer,openCategoriesDrawer]);


	

	const handleClickMenu = () => {
		setOpenMenuDrawer(true);
		document.body.classList.add('overflow-hidden');
	}

	const handleClickFilter = () => {
		setOpenCategoriesDrawer(true);
		document.body.classList.add('overflow-hidden');
	}

	const logout = () => {
		// CLEAR THE LOCALSTORAGE
		localStorage.removeItem('woo-app');
		// LOGOUT
		dispatch(login(false));
		// DISPATCH THE LOGOUT ACTION TO CLEAR THE STORE
		dispatch({ type : "LOGOUT"});
	}

	return (
		<>
			<header id="header">
				<div className="wrapper">
					<IconButton onClick={handleClickMenu} id="menu-icon" color="inherit" aria-label="Menu">
						<MenuIcon />
					</IconButton>
					<span id="logo" >
						<img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="kibo.ma" />
					</span>
					<IconButton onClick={handleClickFilter} id="filter-icon" color="inherit" aria-label="Menu">
						<FilterListIcon />
					</IconButton>
					<Loader type="linear" id="header-loader" />
				</div>
			</header>
			<MainMenu open={openMenuDrawer} user={USER} logout={()=>logout()} handleClose={()=>setOpenMenuDrawer(false)}/>
			<SideBarCategories open={openCategoriesDrawer} handleClose={()=>setOpenCategoriesDrawer(false)}/>
		</>
	)
};

const mapStateToProps = ({USER}) => ({USER}); 

export default connect(mapStateToProps)(Header);