import React, {useState, useEffect} from 'react';
import AdvertiserItem from './AdvertiserItem';
import { CircularProgress } from '@mui/material'
import {useHistory} from 'react-router-dom';

import * as AWS from 'aws-sdk';

function ChooseAdvertisers({setMustSelect}){

	const history = useHistory();

	const docClient = new AWS.DynamoDB.DocumentClient()

	const [advertiserList, setAdvertiserList] = useState([])
	const [loading, setLoading] = useState(true)
	const [chosenAdvertisers, setChosenAdvertisers] = useState([])
	const user = JSON.parse(localStorage.getItem('userAttributes'))

	useEffect(()=>{
		getAdvertisers();
	}, [])

	const getAdvertisers =()=>{
		// get the list of advertisers
		var params = {
			TableName: "advertisers",
			Limit:50
		}

		docClient.scan(params, function(err, data) {
			if (err) {
				console.log(err)
			} else {
				console.log(data.Items)
				setAdvertiserList(data.Items)
				setLoading(false)
			}
		})
	}

	const followAll = async()=>{
		if (chosenAdvertisers.length > 0){
			// add array of choices to list of followed advertisers
			await setFollowedAdvertisers(chosenAdvertisers)
			// chosenAdvertisers.forEach(async(advertiser) =>{
			// 	await addPromoterToAdvertisers(advertiser.uid, user[3].Value)
			// 	count++
			// })
			// go to original page
		} else{

		}
	}

	const setFollowedAdvertisers =(advertisers)=>{
		var params = {
			TableName: 'promoters',
			Key:{
				"uid": user[2].Value,
			},
			UpdateExpression: "set advertisersFollowed=:a",
			ExpressionAttributeValues:{
				":a":advertisers
			},
			ReturnValues:"UPDATED_NEW"
		};
		docClient.update(params, function(err, data) {
			if (err) {
				console.log(err)
			} else {
				// back to main page 
				user.advertisersFollowed = advertisers
				setMustSelect(false)
				window.location.reload(true)
			}
		});
	}

	// lambda functions will handle this
	// const addPromoterToAdvertisers =(uid, promoterId)=>{
	// 	var params = {
	// 		TableName: 'advertisers',
	// 		Key:{
	// 			"uid": uid,
	// 		},
	// 		UpdateExpression: "set promoters = list_append(promoters,:promoter)",
	// 		ExpressionAttributeValues:{
	// 			":promoter": [promoterId]
	// 		},
	// 		ReturnValues:"UPDATED_NEW"
	// 	};
	// 	docClient.update(params, function(err, data) {
	// 		if (err) {
	// 			console.log(err)
	// 		} else {
	// 			// back to main page 
	// 		}
	// 	});
	// }

	return (
		<div style={{minHeight:'100vh', width:'100%', position:'fixed', backgroundColor:'white', overflowY:'auto'}}>
			<div style={{marginLeft:'auto', marginRight:'auto', backgroundColor:'white', overflow:'auto', position:'static',
				maxHeight:'30em'}}>
				<p style={{fontSize:'2em', color:'black', textAlign:'center'}}>Choose influencers <br/> to follow</p>
				{loading && <CircularProgress style={{marginLeft:'45%', color:'var(--blueprimary)', marginBottom:'1em'}}/>}
				{advertiserList.map(advertiser =>
					<AdvertiserItem key={advertiser.uid} advertiser = {advertiser} setChoice={setChosenAdvertisers}
						choices={chosenAdvertisers}/>)}
			</div>
			<div style={{textAlign:'center'}}>
			<button style={{border:'none', width:'10em', height:'3em', backgroundColor:'var(--blueprimary)',
				fontSize:'1em', color:'white', borderRadius:'.5em'}} onClick={followAll}>continue</button>
			</div>
		</div>
	)
}

export default ChooseAdvertisers