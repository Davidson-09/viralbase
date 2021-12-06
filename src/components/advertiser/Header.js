import React, {useEffect, useState} from 'react';
import './adHeader.css';
import './admenu.css'
import MenuIcon from '@material-ui/icons/Menu';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

import {Link} from 'react-router-dom';


// note for the future: this components extracts from two different css classes
// adHeader.css and admenu.css

//actually supposed to be named Navigation

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
		<div className='super_container' style={{paddingLeft:"1em", paddingRight:'1em'}}>
			<div >
				<div className="ad__header__container">
					<div className="ad__header__center">
						<h3>viralbase</h3>
					</div>
					<div className="ad__header__right">
						<MenuIcon onClick={showMenu}/>
					</div>
				</div>
				<div className="ad_menu" style={{display:menuVisibility}}>
					<CloseRoundedIcon className='close-icon' style={{marginLeft:'5em', color:'var(--blueprimary)'}} onClick={hideMenu}/>
					<Link to='/influencer/dashboard/Home' style={{textDecoration:'none', color:'black'}}>
						<div className="ad_menu_item">
							<HomeRoundedIcon className="ad_menu_item_icon"/>
							<p className="ad_menu_item_text">Home</p>
						</div>
					</Link>
					<Link to='/influencer/dashboard/account' style={{textDecoration:'none', color:'black'}}>
					<div className="ad_menu_item">
						<PersonRoundedIcon className="ad_menu_item_icon"/>
						<p className="ad_menu_item_text">account</p>
					</div>
					</Link>
				</div>
			</div>
			<div className='vertical_line'/>
		</div>
		
		
	)
}

export default Header
