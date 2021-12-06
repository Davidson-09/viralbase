import React, {useEffect, useState} from 'react'
import AdvertiserCard from './AdvertiserCard'
import SpinnerDiv from '../general/SpinnerDiv'
import * as AWS from 'aws-sdk';

function AdvertisersList() {

	const [followedAdvertisers, setFollowedAdertisers] = useState()

	const [progressDisplay, setProgressDisplay] = useState('none')
	const status = 'loading...';
	const docClient = new AWS.DynamoDB.DocumentClient()
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'))

	useEffect(()=>{
		getUserAttributes();
	},[])

	const getUserAttributes =()=>{
		var params = {
			TableName: 'promoters',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item two of user attributes is name
				":id": userAttributes[2].Value
			}
		}

		docClient.query(params, (err, data)=>{
			
			if (err){
				setProgressDisplay('none')
			} else{
				var accountDetails = data.Items[0]
				setFollowedAdertisers(accountDetails.advertisersFollowed);
				localStorage.setItem('accountDetails', JSON.stringify(accountDetails)) 
			}
		})
	}

	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			<h4 className='title' style={{ textAlign:'center'}}>Influencers you follow</h4>
			<div style={{display:'flex', justifyContent:'center' }}>
			<div className='list_of_ads' style={{display:'grid', gridTemplateColumns:'auto auto'}}>
				{followedAdvertisers && followedAdvertisers.map(ad=>(
					<AdvertiserCard key={ad} advertiser={ad}/>
				))}
			</div>
			</div>
		</div>
	)
}

export default AdvertisersList
