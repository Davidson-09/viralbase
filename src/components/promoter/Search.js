import React, {useEffect, useState} from 'react'

import AdCard from './AdCard'
import SpinnerDiv from '../general/SpinnerDiv'

import './listOfAds.css'

import * as AWS from 'aws-sdk';


function Search({searchterm}) {

	const [ads, setAds] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')
	const [status, setStatus] = useState('searching...');
	const [empty, setEmpty] = useState(true)
	const docClient = new AWS.DynamoDB.DocumentClient()

	useEffect(()=>{
		getAds()
		
	},[searchterm])


	// const getAds = async ()=>{
	// 	setProgressDisplay('block')
	// 	setAds([])
	// 	const q = query(collection(db, "ads"), where( 'name', '==', searchterm), where("active", "==", true));
	// 	console.log(searchterm)
	// 	const querySnapshot = await getDocs(q);
	// 	let adlist = [];
	// 	querySnapshot.forEach((doc) => {
	// 		// doc.data() is never undefined for query doc snapshots
	// 		let ad = {id:doc.id, data:doc.data()}
	// 		adlist.push(ad)
	// 	  });
		  
	// 	  if (adlist.length > 0){
	// 		setAds(adlist);
	// 		setEmpty(false);
	// 	  } else {
	// 		  setStatus('there are no ads that match this search')
	// 		  setEmpty(true);
	// 	  }
	// 	  setProgressDisplay('none')
	// }

	const getAds =()=>{
		setProgressDisplay('block')
		var params = {
			"TableName": "ads",
			"IndexName": "active-index",
			"KeyConditionExpression": "active = :a and adname = :n",
			"ExpressionAttributeValues": {
				":a": "active",
				":n": searchterm
			},
			"ProjectionExpression": "adId, ownerId, adname, mediaFile, adtype, adthumbnail",
			"ScanIndexForward": false
		}

		docClient.query(params, function(err, data) {
			if (err) {
				setProgressDisplay('none')
				console.log(err)
			} else {
				console.log(data)
				if (data.Items.length === 0){
					setStatus('there are no ads for this search')
					setEmpty(true)
				}
				setAds(data.Items)
				setProgressDisplay('none')
				setEmpty(false)
				
			}
		})
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
