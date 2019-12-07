import React, { useState ,useEffect} from 'react';
import {connect} from 'react-redux';
import { IconButton } from '@material-ui/core';
import {login} from '../../store/actions/';
import MenuIcon from '@material-ui/icons/Menu';
import Loader from '../loader/loader';
import MainMenu from '../main-menu/MainMenu';


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
					<Loader type="linear" id="header-loader" />
				</div>
			</header>
			<MainMenu open={openDrawer} user={USER} logout={()=>logout()} handleClose={()=>setOpenDrawer(false)}/>
		</>
	)
};

const mapStateToProps = ({USER}) => ({USER}); 

export default connect(mapStateToProps)(Header);