import React, {useState, useEffect} from 'react'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

import ChooseAdvertisers from './ChooseAdvertisers'

import './promoHeader.css';

import MenuIcon from '@material-ui/icons/Menu';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import * as AWS from 'aws-sdk';

import {Link, useHistory} from 'react-router-dom';

function PromoHeader() {

	const history = useHistory();
	const [mustSelect, setMustSelect] = useState(false)  // must choose advertisers to follow
	const docClient = new AWS.DynamoDB.DocumentClient()

	const [menuVisibility, setMenuVisibility] = useState('none');
	const [searchterm, setSearchterm] = useState('');
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'))
	const [user, setUser] = useState({})
	useEffect(()=>{
		console.log(userAttributes)
		getUserData()
	}, [])

	const getUserData = async ()=>{
		var params = {
			TableName: 'promoters',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": userAttributes[2].Value
			}
		}

		await docClient.query(params, (err, data)=>{
			
			if (err){
			} else{
				setUser(data.Items[0])
				const promoter = data.Items[0];
				console.log(promoter)
				setUser(promoter)
				if (promoter.advertisersFollowed){
					if (promoter.advertisersFollowed.length === 0){
						setMustSelect(true)
					}
				} else{
					setMustSelect(true)
				}
				
			}
		})
	}

	const showMenu =()=>{
		setMenuVisibility('block');
	}

	const hideMenu =()=>{
		setMenuVisibility('none')
	}

	  return (
		  <div style={{paddingLeft:"1em", paddingRight:'1em'}}>
			  {mustSelect && <ChooseAdvertisers setMustSelect={setMustSelect}/>}
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
					<form style={{width:'100%', height:"inherit"}} onSubmit={()=>{history.push(`/promoter/search/${searchterm}`)}}>
						<input type='text'style={{width:'90%', backgroundColor:'#D2E0F2', border:'none',
							padding:'.5em', fontSize:'1em'}} value={searchterm} onChange={(e)=>{setSearchterm(e.target.value)}}
							placeholder='search for influencers'/>
					</form>
					<SearchRoundedIcon style={{color:'var(--blueprimary)', height:'1.5em', width:'1.5em', fontSize:'1em'}}
							onClick={()=>{history.push(`/promoter/search/${searchterm}`)}}/>
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
	  );
}

export default PromoHeader
