import React, {useState, useEffect} from 'react'
import businessprofile from '../../res/businessprofile.svg'
import * as AWS from 'aws-sdk';

import { useHistory } from 'react-router-dom';

function AdvertiserCard({advertiser}) {

	const [image, setImage] = useState(businessprofile)
	const history = useHistory()
	const bucketName = 'viralbaseadsbucket'

	const [ad, setAd] = useState({})  // in this case this is an advertiser object
	const docClient = new AWS.DynamoDB.DocumentClient()
	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	useEffect(()=>{
		console.log(advertiser)
		getAdvertiser()
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
				":id": advertiser
			}
		}

		await docClient.query(params, (err, data)=>{
			
			if (err){
			} else{
				const advertiser = data.Items[0];
				setAd(advertiser);
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

	const toAdvertiserPage =()=>{
		// go to the advertiser page
		history.push(`/promoter/front/adlist/${advertiser}`)
	}

	return (
		<div style={{margin:'1em'}} onClick={toAdvertiserPage}>
			<div className='ad_card_img' style={{width:'10em', height:'12em', textAlign:'center'}}>
				<img className='ad_card_img' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'50%',
					objectFit:'contain'}}/>
				<p style={{color:'var(--blueprimary)', marginTop:'-.1em'}}>{advertiser}</p>
			</div>
			
		</div>
	)
}

export default AdvertiserCard
