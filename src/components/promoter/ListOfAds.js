import React, {useEffect, useState} from 'react'
import AdCard from './AdCard'
import SpinnerDiv from '../general/SpinnerDiv'

import './listOfAds.css'

import {db} from '../../fire'
import { collection, query, where, getDocs } from "firebase/firestore";

function ListOfAds() {
	
	const [ads, setAds] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')

	useEffect(()=>{
		getAds()
	},[])

	const getAds = async ()=>{
		setProgressDisplay('block')
		const q = query(collection(db, "ads"), where("active", "==", true));
		const querySnapshot = await getDocs(q);
		let adlist = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			let ad = {id:doc.id, data:doc.data()}
			adlist.push(ad)
			console.log(doc.data())
		  });
		  
		  if (adlist.length > 0){
			setAds(adlist);
		  }
		  setProgressDisplay('none')
		  console.log(adlist);
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
				{!ads && <p>there are no ads at the moment</p>}
			</div>
			</div>
		</div>
	)
}

export default ListOfAds
