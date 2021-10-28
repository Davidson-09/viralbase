import React, {useState} from 'react'
import Search from './Search'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import './promoHeader.css';

import MenuIcon from '@material-ui/icons/Menu';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

import {Link, useHistory} from 'react-router-dom';

function SearchPage({match}) {

	const history = useHistory();

	const [menuVisibility, setMenuVisibility] = useState('none');
	const [searchterm, setSearchterm] = useState(match.params.searchterm.toLowerCase());

	const showMenu =()=>{
		setMenuVisibility('block');
	}

	const hideMenu =()=>{
		setMenuVisibility('none')
	}

	return (
		<div>
			<div style={{paddingLeft:"1em", paddingRight:'1em'}}>
				<div className='sub_container' style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
						<p className='logo' style={{color:'var(--blueprimary)', fontWeight:800, textAlign:'center', fontSize:'2em', flex:'1'}}>viralbase</p>
						<div className="promo__header__right" style={{marginTop:'2.5em', color:'var(--blueprimary)'}}>
							<MenuIcon onClick={showMenu} className='promo_header_menuicon'/>
						</div>
						<ul className='list' style={{display:'none', listStyle:'none'}}>
							<li><Link to='/promoter/front/home' style={{textDecoration:'none', color:'black'}}>Home</Link></li>
							<li><Link to='/promoter/front/account' style={{textDecoration:'none', color:'black'}}>Account</Link></li>
						</ul>
					</div>
					<div style={{display:'flex', backgroundColor:'#D2E0F2', padding:'1em', height:'2em', borderRadius:'2em',
						margin:'auto', maxWidth:'40em'}}>
						<input type='text'style={{width:'90%', backgroundColor:'#D2E0F2', border:'none',
								padding:'1em', fontSize:'1em'}} value={searchterm} onChange={(e)=>{setSearchterm(e.target.value)}}/>
						<SearchRoundedIcon style={{color:'var(--blueprimary)', height:'1.5em', width:'1.5em', fontSize:'1em'}}
								onClick={()=>{history.push(`/promoter/front/search/${searchterm}`)}}/>
					</div>

					<div className="ad_menu" style={{display:menuVisibility}}>
						<CloseRoundedIcon className='close-icon' style={{marginLeft:'5em', color:'var(--blueprimary)'}} onClick={hideMenu}/>
						<Link to='/promoter/front/home' style={{textDecoration:'none', color:'black'}}>
							<div className="ad_menu_item" onClick={()=>{setMenuVisibility('none')}}>
								<HomeRoundedIcon className="ad_menu_item_icon"/>
								<p className="ad_menu_item_text">Home</p>
							</div>
						</Link>
						<Link to='/promoter/front/account'  style={{textDecoration:'none', color:'black'}}>
						<div className="ad_menu_item" onClick={()=>{setMenuVisibility('none')}}>
							<PersonRoundedIcon className="ad_menu_item_icon"/>
							<p className="ad_menu_item_text">account</p>
						</div>
						</Link>
					</div>
			</div>
			<Search searchterm={searchterm}/>
		</div>
	)
}

export default SearchPage
