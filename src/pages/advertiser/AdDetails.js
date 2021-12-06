import React, { useState, useEffect } from 'react';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import SpinnerDiv from '../../components/general/SpinnerDiv';
import NewAlert from '../../components/general/NewAlert';

import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player'
import placeholder from '../../res/adplaceholder.svg'

import * as AWS from 'aws-sdk';

import './addetail.css';

function AdDetails({match}) {

	const green = '#00FF00';
	const red = '#FF0000';
	const docClient = new AWS.DynamoDB.DocumentClient()
	const [progressDisplay, setProgressDisplay] = useState('none')
	const [mode, setMode] = useState('active');
	const [modeColor, setModeColor] = useState(green);
	const [buttonColor, setButtonColor] = useState(red);
	const [buttonText, setButtonText] = useState('deactivate');
	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState(placeholder);

	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const currentAd = JSON.parse(localStorage.getItem('currentAd'));
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'));

	const bucketName = 'viralbaseadsbucket'

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	const history = useHistory();

	useEffect(()=>{
		console.log(currentAd);
		if(currentAd.adtype==='video'){
			setIsVideo(true);
		}
		loadMedia();
		setAdMode();
	}, [])



	const setAdMode =()=>{
		if (currentAd.active === 'active') {
			setMode('active');
			setModeColor(green);
			setButtonColor(red);
			setButtonText('deactivate');
		} else {
			setMode('inactive');
			setModeColor(red);
			setButtonColor(green);
			setButtonText('activate');
		}
	}

	const loadMedia = async ()=>{
		const params = {
			Bucket: bucketName,
			Expires: 3000,
			Key: currentAd.mediaFile, // this key is the S3 full file path (ex: mnt/sample.txt)
		};
		const url = await s3.getSignedUrl('getObject', params)

		// const media = await fetch(url);
		// const mediaBlob = await media.blob();
		// const mediaUrl = URL.createObjectURL(mediaBlob);
		setMediaUrl(url);
	}

	const changeMode = async ()=>{
		setProgressDisplay('block')
		var newMode = 'active';
		if (currentAd.active === 'active') {
			// deactivate the ad
			newMode = 'inactive';
		}
		var params = {
			TableName: 'ads',
			Key:{
				"ownerId": currentAd.ownerId,
				"adId": currentAd.adId
			},
			UpdateExpression: "set active = :a",
			ExpressionAttributeValues:{
				":a":newMode
			},
			ReturnValues:"UPDATED_NEW"
		};

		docClient.update(params, function(err, data) {
			if (err) {
				console.log(err);
				setProgressDisplay('none')
			} else {
				console.log("UpdateItem succeeded:", data);
				setProgressDisplay('none');
				currentAd.active = newMode;
				localStorage.setItem('currentAd', JSON.stringify(currentAd));
				setAdMode();
			}
		});
	}

	const deleteAd = async ()=>{
		setProgressDisplay('block')
		var params = {
			TableName: 'ads',
			Key:{
				"ownerId": currentAd.ownerId,
				"adId": currentAd.adId
			}
		};

		docClient.delete(params, function(err, data) {
			if (err) {
				console.error(err);
				setProgressDisplay('block')
			} else {
				var params = {
					TableName: 'advertisers',
					Key:{
						"uid": userAttributes[0].Value
					},
					UpdateExpression: "set activeAds = activeAds - :val",
					ExpressionAttributeValues:{
						":val": 1
					},
					ReturnValues:"UPDATED_NEW"
				};
				docClient.update(params, function(err, data) {
					if (err) {
						console.error(err);
					}
				});
				history.push('/advertiser/dashboard/Home');
			}
		});
	}

	const copyPromoLink =()=>{
		navigator.clipboard.writeText(`${window.location.host}/promoter/addetails/${currentAd.adId}`)
		setAlertMessage('description copied');
		setAlertSeverity('success')
		setDisplayAlert(true)
	}

	return (
		<div style={{position:'fixed',backgroundColor:'#F2F2F2', Height:"100vh", width:'100%'}}>
			<SpinnerDiv show={progressDisplay} />
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
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
								<p style={{fontSize:"1.3em", marginBottom:"-.5em", fontWeight:"bold"}}>{currentAd.adname}</p>
								<p style={{color:'var(--blueprimary)'}}>{`${currentAd.impressions} impressions`}</p>
							</div>
							<p style={{marginTop:'1.5em', color:modeColor}}>{mode}</p>
						</div>
						<div>
							<p style={{maxHeight:'10em', overflowY:'auto'}}>
								{currentAd.adDescription}
							</p>
						</div>
						<div>
							<p style={{marginBottom:'-1.5em'}}>Link:</p>
							<p style={{ width:'70%', overflow:'auto', color:'var(--blueprimary)'}}>{currentAd.link}</p>
						</div>
						<div>
							<p style={{marginBottom:'-1.5em'}}>Link for your promoters:</p>
							<p style={{ width:'70%', overflow:'auto', color:'var(--blueprimary)'}}>{`${window.location.host}/promoter/addetails/${currentAd.adId}`}</p>
						</div>
						<button onClick={copyPromoLink}>copy promotion link</button>
						{/* <p style={{textAlign:'center', marginTop:'1.5em', color:'var(--blueprimary)'}}>people promoting this ad: <span style={{color:'black'}}>{currentAd.promoters}</span></p> */}
						<div style={{diaplay:'flex', textAlign:'center', width:'100%',
							marginTop:'2em'}}>
							<button style={{fontSize:'1em', padding:"1em", borderRadius:'.6em', width:'10em',
								border:'none', color:'white', backgroundColor:buttonColor}} onClick={changeMode }>{buttonText}</button>
								<DeleteRoundedIcon style={{marginLeft:'1em'}} onClick={deleteAd}/>
						</div>
				</div>

			</div>
		</div>
	)
	
}



export default AdDetails
