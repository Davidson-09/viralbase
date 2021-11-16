import React, { useState, useEffect } from 'react'
import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';
import ReactPlayer from 'react-player'
import * as AWS from 'aws-sdk';
import placeholder from '../../res/adplaceholder.svg'

import { useHistory } from 'react-router-dom';

function AdPage({match}) {

	const history = useHistory();
	const docClient = new AWS.DynamoDB.DocumentClient()

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);
	const [domain, setDomain] = useState()
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'))


	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState(placeholder);
	const [promoId, setPromoId] = useState();
	const [linkGenerated, setLinkGenerated] = useState(false);

	const bucketName = 'viralbaseadsbucket'

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	const [ad, setAd] = useState({});

	useEffect(()=>{
		setDomain(window.location.host)
		getAd();
	}, [])

	const getAd =()=>{
		var params = {
			"TableName": "ads",
			"IndexName": "adId-index",
			"KeyConditionExpression": "adId = :a",
			"ExpressionAttributeValues": {
				":a": match.params.ad
			},
			"ProjectionExpression": "adId, ownerId, adname, mediaFile, adtype, link",
			"ScanIndexForward": false
		}

		docClient.query(params, function(err, data) {
			if (err) {
				setProgressDisplay('none')
				console.log(err)
			} else {
				console.log(data)
				setProgressDisplay('none')
				setAd(data.Items[0])
				if (data.Items[0].adtype === 'video'){
					setIsVideo(true)
				}
				loadMedia(data.Items[0])
			}
		})
	}

	const loadMedia =async(item)=>{
		setProgressDisplay('block')
		const params = {
			Bucket: bucketName,
			Expires: 3000,
			Key: item.mediaFile, // this key is the S3 full file path (ex: mnt/sample.txt)
		};
		const url = await s3.getSignedUrl('getObject', params)

		// const media = await fetch(url);
		// const mediaBlob = await media.blob();
		// const mediaUrl = URL.createObjectURL(mediaBlob);
		setMediaUrl(url);
		setProgressDisplay('none')
	}

	const downloadMedia =async ()=>{
		console.log(mediaUrl)
		const anchor = document.createElement('a');
		anchor.href = mediaUrl;
		if (isVideo){
			anchor.download = 'adfile.mp4';
		} else{
			anchor.download = 'adfile.png';
		}
		

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);

		URL.revokeObjectURL(mediaUrl);

	}

	const generateLink=()=>{
		var isGenerated = false;
		var accountDetails = {}
		if (localStorage.getItem('accountDetails')){
			accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
		}
		setProgressDisplay('block');
		var user = JSON.parse(localStorage.getItem('userAttributes'))
		if (!user || user === {}){
			// sign up as a promoter
			history.push('/signup/promoter')
		} else{
			// check if the user has already generated a link for this ad before
			// get promoter account details
			if (accountDetails && accountDetails != {}){
				// check whether the user's promotedAds list contains an the adId and ownerId of the current ad
				if (accountDetails.promotedAds != null){
					accountDetails.promotedAds.forEach((adItem)=>{
						if (adItem.adId === ad.adId && adItem.ownerId === ad.ownerId){
							isGenerated = true  // the promoter is already promoting this ad
						}
					})
				}
			} else{
				// if the account details are not saved then get them from database
				accountDetails = getUserAttributes();
				localStorage.setItem('accountDetails', JSON.stringify(accountDetails))
				// now check whether the promoter is already promoting the ad
				if (accountDetails.promotedAds){
					accountDetails.promotedAds.forEach((adItem)=>{
						if (adItem.adId === ad.adId && adItem.ownerId === ad.ownerId){
							isGenerated = true  // the promoter is already promoting this ad
						}
					})
				}
			}
			if (isGenerated){
				setProgressDisplay('none');
				setAlertMessage('you have already generated a link for this ad');
				setAlertSeverity('warning')
				setDisplayAlert(true)
			} else{
				// set up a promotion object in database
				const promoId = user[0].Value + Math.random()
				var params = {
				TableName: 'promotions',
					Item: {
						promotionId: promoId,
						promoterId: user[0].Value,
						adId: ad.adId,
						adOwner: ad.ownerId,
						addresses: [],
						adlink: ad.link,
						impressions:0,
						adname: ad.adname
					}
				}
				docClient.put(params, (err, data)=>{
					if (err){
						console.log(err)
						setProgressDisplay('none');
						setAlertMessage(err.message);
						setAlertSeverity('warning')
						setDisplayAlert(true)
						setProgressDisplay('none');
					} else{
						
						// add the ad to the promoters list of promoted ads in the database
						// and add the promotion to the promoters list of promotions
						var adDetails = {adId: ad.adId, ownerId: ad.ownerId}
						var params = {
							TableName: "promoters",
							Key: {
							   uid: userAttributes[0].Value
							},
							UpdateExpression: "SET promotedAds = list_append(promotedAds,:ad), listOfPromotions = list_append(listOfPromotions,:promotion), promotions = promotions + :val ",
							ExpressionAttributeValues: {
							   ":ad": [adDetails],
							   ":promotion": [{promotionId:promoId, promoterId:userAttributes[0].Value, adname:ad.adname, adId:ad.adId}],
							   ':val' : 1
							},
							ReturnValues: "UPDATED_NEW"
						};

						docClient.update(params, function(err, data){
							if (err){
								console.log(err)
								setProgressDisplay('none');
							} else{
								// save the updated account details
								accountDetails.promotedAds.push({adDetails});
								localStorage.setItem('accountDetails',JSON.stringify(accountDetails))
								setPromoId(promoId);
								setLinkGenerated(true);
								setProgressDisplay('none');
							}
						})
					}
				})
			}
			
			
		}
	}

	const getUserAttributes =()=>{
		var params = {
			TableName: 'promoters',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": userAttributes[0].Value
			}
		}

		docClient.query(params, (err, data)=>{
			
			if (err){
				setProgressDisplay('none')
			} else{
				var accountDetails = data.Items[0]
				return accountDetails
			}
		})
	}

	const copyLink =()=>{
		navigator.clipboard.writeText(`${domain}/promotion/${promoId}`)
		setAlertMessage('link copied');
		setAlertSeverity('success')
		setDisplayAlert(true)
	}

	return (
		<div style={{position:'fixed',backgroundColor:'#F2F2F2', Height:"100vh", width:'100%'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div style={{width:'100%', height:'100vh', overflow:"auto"}}>

				<div className='addetails_subcontainer' style={{backgroundColor:'white', Height:'30em', width:'80%', margin:'auto', marginTop:'17vh',
					borderRadius:'1em', padding:"1em", opacity:'1', overflow:'auto'}}>
						<div className='addetails_media_container' style={{width:'100%', margin:'auto', height:'10em'}}>
							{!isVideo && <img alt='ad-img' src={mediaUrl} style={{width:'100%', opacity:'1', height:"100%",
								objectFit:'contain'}} />}
							{isVideo && 
								<ReactPlayer url={mediaUrl} controls width='80%' height='100%'/>}
						</div>
						<div style={{}}>
							<div >
								<p style={{fontSize:"1.3em", marginBottom:"-.5em", fontWeight:"bold"}}>{ad.adname}</p>
							</div>
							<button style={{marginTop:"1em", border:'none', width:"10em",
								height:'3em', fontSize:'1em', borderRadius:'.5em'}} onClick={downloadMedia}>download media file</button>
						</div>
						<div style={{diaplay:'flex', textAlign:'center', width:'100%',
							marginTop:'2em', marginBottom:'1em'}}>
							{!linkGenerated && <button style={{fontSize:'1em', padding:"1em", borderRadius:'.6em', width:'10em',
								border:'none', color:'white', backgroundColor:'var(--blueprimary)'}} onClick={generateLink}>generate link</button>}
							{linkGenerated && <p style={{maxWidth:'70%', overflowX:'auto', color:"var(--blueptimary)"}}>{`${domain}/promotion/${promoId}`}</p>}
							{linkGenerated && <button onClick={copyLink}>copy link</button>}
						</div>
				</div>

			</div>
		</div>
	)
}

export default AdPage
