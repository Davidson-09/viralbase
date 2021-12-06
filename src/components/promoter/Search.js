import React, {useEffect, useState} from 'react'
import SpinnerDiv from '../general/SpinnerDiv'
import AdvertiserCardForSearch from './AdvertiserCardForSearch'

import './listOfAds.css'

import * as AWS from 'aws-sdk';


function Search({searchterm}) {

	const [advertisers, setAdvertisers] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')
	const [status, setStatus] = useState('searching...');
	const [empty, setEmpty] = useState(true)
	const docClient = new AWS.DynamoDB.DocumentClient()
	

	useEffect(()=>{
		getAdvertisers()
	},[searchterm])

	const getAdvertisers =()=>{
		setProgressDisplay('block')
		var params = {
			TableName: 'advertisers',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": searchterm.toLowerCase()
			}
		}

		docClient.query(params, function(err, data) {
			if (err) {
				setProgressDisplay('none')
				console.log(err)
			} else {
				console.log(data)
				if (data.Items.length === 0){
					setStatus('No influencer goes by this user name')
					setEmpty(true)
				}
				setAdvertisers(data.Items)
				setProgressDisplay('none')
				setEmpty(false)
				
			}
		})
	}

	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			{/* <h4 className='title' style={{ textAlign:'center'}}>Available ads</h4> */}
			<div style={{display:'flex', justifyContent:'center' }}>
			<div className='list_of_ads' style={{display:'grid', gridTemplateColumns:'auto auto'}}>
				{advertisers && advertisers.map(advertiser=>(
					<AdvertiserCardForSearch key={advertiser.uid} advertiser={advertiser}/>
				))}
				
				{/* {empty && <p>{status}</p>} */}
			</div>
			</div>
		</div>
	)
}

export default Search
