import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'
import {useHistory} from 'react-router-dom';
import * as AWS from 'aws-sdk';
import axios from 'axios'

function Promotion({match}) {

	const history = useHistory();
	const docClient = new AWS.DynamoDB.DocumentClient()

	useEffect(()=>{
		execute();
	},[])
	
	// update advertiser
	//update promoter 
	//update ad

	const execute =async ()=>{
		//get the promotion
		var params = {
			TableName : "promotions",
			KeyConditionExpression: "#promotionId = :id",
			ExpressionAttributeNames:{
				"#promotionId": "promotionId"
			},
			ExpressionAttributeValues: {
				":id": match.params.promo
			}
		};

		docClient.query(params, async function(err, data) {
			if (err) {
				console.error('something went wrong');
			} else {
				var promotion = data.Items[0];

				console.log(promotion)
				const res = await axios.get('https://geolocation-db.com/json/');
				const ip = res.data.IPv4;
				let ispresent = false;
				// check if the device ip address already exists in the promotion's array of addresses
				if (promotion.addresses){
					promotion.addresses.forEach((address)=>{
						if (address === ip){
							ispresent = true;
						}
					})
				}

				if (ispresent){
					window.location.replace(`https://${promotion.adlink}`);
				} else{
					var advertiser = getAdvertiser(promotion.adOwner);
					if (advertiser.availableImpressions < 1){
						deactivateAd(promotion.adOwner, promotion.adId)
					} else{
						// remove one available imression and add one impression gotten
						decrementAvailableImpressions(promotion.adOwner)
						// add one impression to the ad
						addImpressionToAd(promotion.adOwner, promotion.adId)
						// add one impression to the promotion and increase earnings
						addImpressionToPromoterAndIncreaseEarnings(promotion.promoterId)
						//increment the number of impressions for promotion
						var params = {
							TableName: 'promotions',
							Key:{
								"promotionId": promotion.promotionId,
								"promoterId": promotion.promoterId
							},
							UpdateExpression: "set impressions = impressions + :val, addresses = list_append(addresses,:address)",
							ExpressionAttributeValues:{
								":val": 1,
								":address": [ip]
							},
							ReturnValues:"UPDATED_NEW"
						};
						docClient.update(params, function(err, data) {
							if (err) {
								console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
							} else{
								window.location.replace(`https://${promotion.adlink}`);
							}
						});
					}
				}
				
			}
		});
	}

	const getAdvertiser =async (adOwner)=>{
		var params = {
			TableName: 'advertisers',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": adOwner
			}
		}

		await docClient.query(params, (err, data)=>{
			
			if (err){
				console.log(err)
			} else{
				return data.Items[0];
			}
		})
	}

	const decrementAvailableImpressions =async(adOwner)=>{
		// also add to impressions gotten
		var params = {
			TableName: 'advertisers',
			Key:{
				"uid": adOwner
			},
			UpdateExpression: "set availableImpressions = availableImpressions - :val, impressionsGotten = impressionsGotten + :val",
			ExpressionAttributeValues:{
				":val": 1
			},
			ReturnValues:"UPDATED_NEW"
		};
		await docClient.update(params, function(err, data) {
			if (err) {
				console.error(err);
			}
		});
	}
	

	const addImpressionToAd =async(adOwner, adId)=>{
		var params = {
			TableName: 'ads',
			Key:{
				"ownerId": adOwner,
				"adId": adId
			},
			UpdateExpression: "set impressions = impressions + :a",
			ExpressionAttributeValues:{
				":a": 1
			},
			ReturnValues:"UPDATED_NEW"
		};

		await docClient.update(params, function(err, data) {
			if (err) {
				console.log(err);
			}
		});
	}

	const addImpressionToPromoterAndIncreaseEarnings =async(promoterId)=>{
		var params = {
			TableName: "promoters",
			Key: {
			   uid: promoterId
			},
			UpdateExpression: "SET impressions = impressions + :val, earnings = earnings + :earned ",
			ExpressionAttributeValues: {
			   ":val": 1,
			   ":earned": 50
			},
			ReturnValues: "UPDATED_NEW"
		};

		await docClient.update(params, function(err, data){
			if (err){
				console.log(err)
			} 
		})
	}

	const deactivateAd =async(adOwner, adId)=>{
		var params = {
			TableName: 'ads',
			Key:{
				"ownerId": adOwner,
				"adId": adId
			},
			UpdateExpression: "set active = :a",
			ExpressionAttributeValues:{
				":a": 'inactive'
			},
			ReturnValues:"UPDATED_NEW"
		};

		await docClient.update(params, function(err, data) {
			if (err) {
				console.log(err);
			} else {
				// go to 404 page
				history.push('/pagenotfound')
			}
		});
	}

	return (
		<div style={{ height:'100vh', width:'100%', paddingTop:'40vh', position:'fixed', opacity:'0.5'}}>
			<div style={{width:'10em', height:'10em', margin:'auto', backgroundColor:'white', borderRadius:'1em', backgroundColor:'#B4B4B4' }}>
				<p style={{textAlign:'center', color:'var(--blueprimary)', margin:0}}>viralbase</p>
				<CircularProgress style={{marginTop:'3.5em', marginLeft:'3.5em', color:'var(--blueprimary)'}}/>
			</div>
		</div>
	)
}

export default Promotion
