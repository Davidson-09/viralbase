import React, {useEffect, useState} from 'react';
import './adHeader.css';
import './admenu.css'
import MenuIcon from '@material-ui/icons/Menu';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

import {Link} from 'react-router-dom';


// note for the future: this components extracts from two different css classes
// adHeader.css and admenu.css
function Header() {

	const [menuVisibility, setMenuVisibility] = useState('none');

	useEffect(()=>{
		if ((window.innerWidth>=720)&&(window.innerHeight>=1024)){
			setMenuVisibility('block');
		}

		if (window.innerWidth >window.innerHeight){
			setMenuVisibility('block');
		}

	}, [])


	const showMenu =()=>{
		setMenuVisibility('block');
	}

	const hideMenu =()=>{
		setMenuVisibility('none')
	}

	return (
		<div className='super_container'>
			<div>
				<div className="ad__header__container">
					<div className="ad__header__center">
						<h3>ViralBase</h3>
					</div>
					<div className="ad__header__right">
						<MenuIcon onClick={showMenu}/>
					</div>
				</div>
				<div className="ad_menu" style={{display:menuVisibility}}>
					<CloseRoundedIcon className='close-icon' style={{marginLeft:'5em', color:'var(--blueprimary)'}} onClick={hideMenu}/>
					<Link to='/advertiser/dashboard/Home' style={{textDecoration:'none', color:'black'}}>
						<div className="ad_menu_item">
							<HomeRoundedIcon className="ad_menu_item_icon"/>
							<p className="ad_menu_item_text">Home</p>
						</div>
					</Link>
					<Link to='/advertiser/dashboard/ads' style={{textDecoration:'none', color:'black'}}>
						<div className="ad_menu_item">
							<TrendingUpRoundedIcon className="ad_menu_item_icon"/>
							<p className="ad_menu_item_text">ads</p>
						</div>
					</Link>
					<div className="ad_menu_item">
						<AccountBalanceWalletRoundedIcon className="ad_menu_item_icon"/>
						<p className="ad_menu_item_text">financials</p>
					</div>
					<div className="ad_menu_item">
						<PersonRoundedIcon className="ad_menu_item_icon"/>
						<p className="ad_menu_item_text">account</p>
					</div>
				</div>
			</div>
			<div className='vertical_line'/>
		</div>
		
		
	)
}

export default Header
