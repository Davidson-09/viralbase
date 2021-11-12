import React, {useEffect, useState} from 'react'
import AdCard from './AdCard'
import SpinnerDiv from '../general/SpinnerDiv'
import * as AWS from 'aws-sdk';

import './listOfAds.css'
function ListOfAds() {
	
	const [ads, setAds] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')
	const [status, setStatus] = useState('loading...');
	const docClient = new AWS.DynamoDB.DocumentClient()

	useEffect(()=>{
		getAds()
	},[])

	const getAds =()=>{
		setProgressDisplay('block')
		var params = {
			"TableName": "ads",
			"IndexName": "active-index",
			"KeyConditionExpression": "active = :a",
			"ExpressionAttributeValues": {
				":a": "active"
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
				setAds(data.Items)
				setProgressDisplay('none')
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
				{!ads && <p>{status}</p>}
			</div>
			</div>
		</div>
	)
}

export default ListOfAds
