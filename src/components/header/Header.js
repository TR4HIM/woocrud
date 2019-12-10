import React, { useState ,useEffect} from 'react';
import {connect} from 'react-redux';
import { IconButton } from '@material-ui/core';
import {login} from '../../store/actions/';
import MenuIcon from '@material-ui/icons/Menu';
import Loader from '../loader/loader';
import MainMenu from '../main-menu/MainMenu';
import SideBarCategories from '../sidebar-categories/SideBarCategories';
import FilterListIcon from '@material-ui/icons/FilterList'; 
import { loading  , storeWooCategories , storeWooProducts } from '../../store/actions/';
import API from '../../API/'; 
import {APP_PATHS} from '../../config';

const DEFAULT_PER_PAGE          = 18;

const Header = ( { dispatch , USER , WOO_CATEGORIES }) => {

	const [openMenuDrawer,setOpenMenuDrawer] 				= useState(false);
	const [openCategoriesDrawer,setOpenCategoriesDrawer] 	= useState(false);
	const [wooStoreCategories, setWooStoreCategories]       = useState([]);
	const [selectedCategory,setSelectedCategory]  			= useState(false);

	useEffect(() => {
        if(!openMenuDrawer && !openCategoriesDrawer){
            document.body.classList.remove('overflow-hidden');
        }
    }, [openMenuDrawer,openCategoriesDrawer]);

	useEffect(()=>{
        if(WOO_CATEGORIES.length > 0){
			let allCategories = JSON.parse(JSON.stringify(WOO_CATEGORIES));
			let categoriesNotEmpty = allCategories.filter(cat => cat.count > 0);
            setWooStoreCategories(categoriesNotEmpty);
		}
	},[WOO_CATEGORIES])
	
	useEffect(() => {
        if(WOO_CATEGORIES.length <= 0){
            API.WC_getWooCategories(USER.token)
            .then((result)=>{
                if( result !== undefined ){
                    const productCategories = result.map(category => ({
                        ...category,
                        selected: false
                    }));
                    dispatch(storeWooCategories(productCategories));
                }
            })
            .catch((error)=>{
                dispatch({
                    type : 'ERROR',
                    payload : error 
                })
            })
        }
    }, []);
	
	const getWooProducts = (cat) => {
		setSelectedCategory(cat);
		dispatch(loading(true, "header-loader"));
        API.WC_getWooProducts( USER.token , DEFAULT_PER_PAGE , 1 , cat )
        .then((result)=>{ 
            if( result !== undefined ){
                dispatch(storeWooProducts({ products : result.data , productsCount : result.headers['x-wp-total'] , selectedPage : 1 }));
                // HIDE LOADER
                dispatch(loading(false, "header-loader"));
            }
        })
        .catch((error)=>{
            dispatch({
                type : 'ERROR',
                payload : error
            })
            // HIDE LOADING
            dispatch(loading(false, "header-loader"));
        })
	}
	
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
						<img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="WooCrud" />
					</span>
					{
						(APP_PATHS.MY_PRODUCTS === window.location.pathname) ? 
						(<IconButton onClick={handleClickFilter} id="filter-icon" color="inherit" aria-label="Menu">
							<FilterListIcon />
						</IconButton>) : null
						 
					}
					<Loader type="linear" id="header-loader" />
				</div>
			</header>
			<MainMenu open={openMenuDrawer} user={USER} logout={()=>logout()} handleClose={()=>setOpenMenuDrawer(false)}/>
			{
				(APP_PATHS.MY_PRODUCTS === window.location.pathname) ?
				<SideBarCategories currentCat={selectedCategory} open={openCategoriesDrawer} selectedCategory={(cat) => getWooProducts(cat)} categories={wooStoreCategories} handleClose={()=>setOpenCategoriesDrawer(false)}/>
				: null
			}
		</>
	)
};

const mapStateToProps = ({USER , WOO_CATEGORIES}) => ({USER , WOO_CATEGORIES}); 

export default connect(mapStateToProps)(Header);