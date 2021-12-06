import React, { useState, useEffect } from 'react'

import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';
import ReactPlayer from 'react-player'
import * as AWS from 'aws-sdk';
import placeholder from '../../res/adplaceholder.svg'

function PromotionDetails() {

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);
	const docClient = new AWS.DynamoDB.DocumentClient()

	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState(placeholder);
	const promo = JSON.parse(localStorage.getItem('currentPromotion'))

	const domain = window.location.host
	const bucketName = 'viralbaseadsbucket'

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	const [ad, setAd] = useState({});

	useEffect(()=>{
		console.log(promo)
		getAd();
	}, [])


	const loadMedia =async (item)=>{
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

	const getAd =()=>{
		var params = {
			"TableName": "ads",
			"IndexName": "adId-index",
			"KeyConditionExpression": "adId = :a",
			"ExpressionAttributeValues": {
				":a": promo.adId
			},
			"ProjectionExpression": "adId, ownerId, adname, mediaFile, adtype, link, adDescription",
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

	const downloadMedia = async ()=>{
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

	const copyLink =()=>{
		navigator.clipboard.writeText(`${domain}/promotion/${promo.promotionId}`)
		setAlertMessage('link copied');
		setAlertSeverity('success')
		setDisplayAlert(true)
	}

	const copyDescription =()=>{
		navigator.clipboard.writeText(ad.adDescription)
		setAlertMessage('description copied');
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
							<div>
								<p style={{maxHeight:'10em', overflowY:'auto'}}>
									{ad.adDescription}
								</p>
								<button style={{marginTop:"1em", border:'none', width:"10em",
								height:'3em', fontSize:'1em', borderRadius:'.5em'}} onClick={copyDescription}>copy description</button>
							</div>
							<button style={{marginTop:"1em", border:'none', width:"10em",
								height:'3em', fontSize:'1em', borderRadius:'.5em'}} onClick={downloadMedia}>download media file</button>
						</div>
						<div style={{diaplay:'flex', textAlign:'center', width:'100%',
							marginTop:'2em'}}>
								<p style={{overflow:'auto'}}>{`${domain}/promotion/${promo.promotionId}`}</p>
								<button onClick={copyLink}>copy link</button>
						</div>
				</div>

			</div>
		</div>
	)
}

export default PromotionDetails
