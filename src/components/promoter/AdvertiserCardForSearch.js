import React, {useState, useEffect} from 'react'
import businessprofile from '../../res/businessprofile.svg'
import * as AWS from 'aws-sdk';

import { useHistory } from 'react-router-dom';

function AdvertiserCardForSearch({advertiser}) {

	const [image, setImage] = useState(businessprofile)
	const history = useHistory()
	const bucketName = 'viralbaseadsbucket';
	const [followed, setFollowed] = useState(false);
	const promoter = JSON.parse(localStorage.getItem('accountDetails'))

	const [followBtnText, setFollowBtnText] = useState('Follow');
	const [unfollowBtnText, setUnfollowBtnText] = useState('Unfollow')

	const docClient = new AWS.DynamoDB.DocumentClient()

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});
	useEffect(()=>{
		
		getAdvertiser()
		// check if the promoter is following this advertiser
		promoter.advertisersFollowed.forEach(ad =>{
			if (advertiser.uid === ad.uid){
				setFollowed(true);
			}
		})
	}, [])

	const getAdvertiser = async ()=>{
		var params = {
			TableName: 'advertisers',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": advertiser.uid
			}
		}

		await docClient.query(params, (err, data)=>{
			
			if (err){
			} else{
				const advertiser = data.Items[0];
				if (advertiser.profilepic){
					getImage(advertiser.profilepic)
				}
			}
		})
	}

	const getImage = async (profile)=>{
		const params = {
			Bucket: bucketName,
			Expires: 3000,
			Key: profile, // this key is the S3 full file path (ex: mnt/sample.txt)
		};
		const url = await s3.getSignedUrl('getObject', params)
		setImage(url);
	}

	const follow =()=>{
		setFollowBtnText('Following...')
		// add advertiser to list of advertisers followed
		// add promoter to list of promoters following
		addAdvertiser()
	}

	const addAdvertiser =()=>{
		var params = {
			TableName: "promoters",
			Key: {
			   uid: promoter.uid
			},
			UpdateExpression: "SET advertisersFollowed = list_append(advertisersFollowed,:ad)",
			ExpressionAttributeValues: {
			   ":ad": [advertiser],
			},
			ReturnValues: "UPDATED_NEW"
		};

		docClient.update(params, function(err, data){
			if (err){
				console.error(err);
			} else{
				promoter.advertisersFollowed.push(advertiser);
				localStorage.setItem('accountDetails', JSON.stringify(promoter))
				addPromoter()
			}
		})

	}

	const addPromoter =()=>{
		var params = {
			TableName: "advertisers",
			Key: {
			   uid: advertiser.uid
			},
			UpdateExpression: "SET promoters = list_append(promoters,:promoter)",
			ExpressionAttributeValues: {
			   ":promoter": [promoter],
			},
			ReturnValues: "UPDATED_NEW"
		};

		docClient.update(params, function(err, data){
			if (err){
				console.error(err);
			} else{
				setFollowed(true)
			}
		})
	}

	const unfollow =()=>{
		setUnfollowBtnText('Unfollowing...')
		// remove advertiser from list of advertisers followed
		// remove promoter from list of promoters following
		removeAdvertiser()
	}

	const removeAdvertiser =()=>{
		var advertisers = promoter.advertisersFollowed
		advertisers = advertisers.filter(item => item.uid !== advertiser.uid)

		var params = {
			TableName: 'promoters',
			Key:{
				"uid": promoter.uid,
			},
			UpdateExpression: "set advertisersFollowed=:a",
			ExpressionAttributeValues:{
				":a":advertisers
			},
			ReturnValues:"UPDATED_NEW"
		};

		docClient.update(params, function(err, data) {
			if (err) {
				console.error(err)
			} else {
				// back to main page 
				promoter.advertisersFollowed = advertisers;
				localStorage.setItem('accountDetails', JSON.stringify(promoter))
				removePromoter()
			}
		});
	}

	const removePromoter =()=>{
		var promoters= advertiser.promoters
		promoters= promoters.filter(item => item.uid !== promoter.uid)

		var params = {
			TableName: 'advertisers',
			Key:{
				"uid": advertiser.uid,
			},
			UpdateExpression: "set promoters=:a",
			ExpressionAttributeValues:{
				":a":promoters
			},
			ReturnValues:"UPDATED_NEW"
		};

		docClient.update(params, function(err, data) {
			if (err) {
				console.error(err)
			} else {
				// back to main page
				setFollowed(false)
			}
		});
	}

	return (
		<div style={{margin:'1em'}} >
			<div className='ad_card_img' style={{width:'10em', height:'12em', textAlign:'center'}}>
				<img className='ad_card_img' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'50%',
					objectFit:'contain'}}/>
				<p style={{color:'var(--blueprimary)', marginTop:'-.1em'}}>{advertiser.uid}</p>
				{!followed && <button onClick={follow}>{followBtnText}</button>}
				{followed && <button onClick={unfollow}>{unfollowBtnText}</button>}
			</div>
			
		</div>
	)
}

export default AdvertiserCardForSearch
