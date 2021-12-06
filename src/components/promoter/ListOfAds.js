import React, {useEffect, useState} from 'react'
import AdCard from './AdCard'
import SpinnerDiv from '../general/SpinnerDiv'
import * as AWS from 'aws-sdk';

import './listOfAds.css'
function ListOfAds({match}) {
	
	const [ads, setAds] = useState();

	const [progressDisplay, setProgressDisplay] = useState('none')
	const status = 'loading...';
	const docClient = new AWS.DynamoDB.DocumentClient()
	// const userAttributes = JSON.parse(localStorage.getItem('userAttributes'))

	useEffect(()=>{
		getAds()
	},[])

	const getAds =()=>{
		setProgressDisplay('block')
		var params = {
			TableName : "ads",
			KeyConditionExpression: "#ownerId = :id",
			ExpressionAttributeNames:{
				"#ownerId": "ownerId"
			},
			ExpressionAttributeValues: {
				":id": match.params.advertiser
			}
		};

		docClient.query(params, function(err, data) {
			if (err) {
				setProgressDisplay('none')
				console.log(err)
			} else {
				console.log(data)
				const items = []
				data.Items.forEach(item =>{
					if (item.active === 'active'){
						items.push(item)
					}
				})
				setAds(items)
				setProgressDisplay('none')
			}
		})
	}

	// const getUserAttributes =()=>{
	// 	var params = {
	// 		TableName: 'promoters',
	// 		KeyConditionExpression: "#uid = :id",
	// 		ExpressionAttributeNames:{
	// 			"#uid": "uid"
	// 		},
	// 		ExpressionAttributeValues: {
	// 			// item zero of user attributes is sub
	// 			":id": userAttributes[0].Value
	// 		}
	// 	}

	// 	docClient.query(params, (err, data)=>{
			
	// 		if (err){
	// 			setProgressDisplay('none')
	// 		} else{
	// 			var accountDetails = data.Items[0]
	// 			localStorage.setItem('accountDetails', JSON.stringify(accountDetails)) 
	// 		}
	// 	})
	// }

	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			<h4 className='title' style={{ textAlign:'center'}}>Posts</h4>
			<div style={{display:'flex', justifyContent:'center' }}>
			<div className='list_of_ads' style={{display:'grid', gridTemplateColumns:'auto auto'}}>
				{ads && ads.map(ad=>(
					<AdCard key={ad.adId} ad={ad}/>
				))}
				{!ads && <p>{status}</p>}
			</div>
			</div>
		</div>
	)
}

export default ListOfAds
