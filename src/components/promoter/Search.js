import React, {useEffect, useState} from 'react'

import AdCard from './AdCard'
import SpinnerDiv from '../general/SpinnerDiv'

import './listOfAds.css'

import {db} from '../../fire'
import { collection, query, where, getDocs } from "firebase/firestore";


function Search({searchterm}) {

	const [ads, setAds] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')
	const [status, setStatus] = useState('searching...');
	const [empty, setEmpty] = useState(true)

	useEffect(()=>{
		getAds()
		
	},[searchterm])


	const getAds = async ()=>{
		setProgressDisplay('block')
		setAds([])
		const q = query(collection(db, "ads"), where( 'name', '==', searchterm), where("active", "==", true));
		const querySnapshot = await getDocs(q);
		let adlist = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			let ad = {id:doc.id, data:doc.data()}
			adlist.push(ad)
		  });
		  
		  if (adlist.length > 0){
			setAds(adlist);
			setEmpty(false);
		  } else {
			  setStatus('there are no ads that match this search')
			  setEmpty(true);
		  }
		  setProgressDisplay('none')
	}


	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			<h4 className='title' style={{ textAlign:'center'}}>Available ads</h4>
			<div style={{display:'flex', justifyContent:'center' }}>
			<div className='list_of_ads' style={{display:'grid', gridTemplateColumns:'auto auto'}}>
				{ads && ads.map(ad=>(
					<AdCard key={ad.id} ad={ad}/>
				))}
				{empty && <p>{status}</p>}
			</div>
			</div>
		</div>
	)
}

export default Search
