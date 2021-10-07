import React, {useState, useEffect} from 'react'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import './adspage.css';
import AdListItem from '../../components/advertiser/AdListItem';
import { Fab, Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import {useHistory} from 'react-router-dom'
import {db} from '../../fire'
import { collection, query, where, getDocs } from "firebase/firestore";
//import { collection, getDocs} from 'firebase/firestore/lite';

function AdsPage() {

	const [searchTerm, setSearchTerm] = useState('');

	const history = useHistory();

	useEffect(()=>{
		getAds();
	})

	const getAds =async ()=>{
		const q = query(collection(db, "ads"));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		console.log(doc.id, " => ", doc.data());
		});

	}

	const handleChange =(e)=>{
		setSearchTerm(e.target.value);
	}

	const search =()=>{
		// search for ads 
		console.log(searchTerm)
	}

	const toCreationPage =()=>{
		history.push('/advertiser/createad')
	}

	return (
		<div className="adspage_container"  style={{width:'100%'}}>
				<div className="adspage_subcontainer">
					<p className='adspage_ads'>Ads</p>
					<div className="adspage_search_container">
						<input className="adspage_search_bar" placeholder='search ads' value={searchTerm} onChange={handleChange} />
						<SearchRoundedIcon className="adspage_search_icon" onClick={search}/>
					</div>
					<Button className='adspage_createbutton' variant="contained" startIcon={<AddRoundedIcon />} style={{height:'2em', padding:'1.4em',
					 dropShadow:'none', marginTop:'1.2em', marginLeft:'1.2em', 
					 maxWidth:'20em', textTransform: 'lowercase', flex: 1,
					  fontWeight:'700', backgroundColor: 'var(--blueprimary)', color: 'white'}} onClick={toCreationPage}>
						create new ad
					</Button> 
				</div>
				<div className='adspage_ads_list_title'>
					<p className='adspage_ads_list_title_header'>Name</p>
					<p  className='adspage_ads_list_title_2'>Date created</p>
					<p  className='adspage_ads_list_title_2'>Target</p>
					<p  className='adspage_ads_list_title_2'>Budget</p>
					<p className='adspage_ads_list_title_header'>Impressions</p>
				</div>
				<div className='adspage_ads_list_bottomLine'></div>
				<div style={{marginBottom: '3em'}}>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
					<AdListItem/>
				</div>
				
				<Fab className='adspage_fab' style={{position:'fixed', right: '0px', top: '80%', margin: '1em', backgroundColor:'var(--blueprimary)'}}>
					<AddRoundedIcon style={{color:'white'}}/>
				</Fab>
		</div>
	)
}

export default AdsPage
