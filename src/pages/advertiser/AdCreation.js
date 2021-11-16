import React, {useState} from 'react'
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import { Button } from '@material-ui/core';
import SpinnerDiv from '../../components/general/SpinnerDiv'
import NewAlert from '../../components/general/NewAlert';
import * as AWS from 'aws-sdk';
import { useHistory } from 'react-router-dom';

import './adcreation.css'

function AdCreation() {

	const history = useHistory();

	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'));

	const docClient = new AWS.DynamoDB.DocumentClient()

	const [media, setMedia] = useState(''); // ad media file
	const [displaybutton, setDisplayButton] = useState(true); //display upload button
	const [showPreview, setShowPreview] = useState(false);
	const [user, setUser] = useState();

	const [adName, setAdName] = useState('');
	const [adLink, setAdLink] = useState('');

	const [progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);
	const bucketName = 'viralbaseadsbucket'


	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});
	//------------------------aws-------------------------------------------------------------------

	const uploadAd =(e)=>{
		e.preventDefault()

		if (media.size <= 50000000){
			setProgressDisplay('block');
			// upload media file to storage
			if (media.type === 'video/mp4'){
				// upload the thumbnail
				var thumbnailFolderKey = encodeURIComponent('ads') + "/" + encodeURIComponent('thumbnails') + "/";
				var thumbnailKey = thumbnailFolderKey + media.name;
				generateThumbnail(window.URL.createObjectURL(media)).then((thumbnail)=>{
					var blobData = dataURItoBlob(thumbnail);
					var upload = new AWS.S3.ManagedUpload({
						params: {
							Bucket: bucketName,
							Key: thumbnailKey,
							Body: blobData,
							ContentType: "image/jpeg"
						}
					});
					var promise = upload.promise();
					promise.then(
						function(data) {
							var thumbkey = data.Key
							// upload the video
							var mediaFolderKey = encodeURIComponent('ads') + '/' + encodeURIComponent('admedia') + "/";
							var videoKey = mediaFolderKey + media.name;
							var upload = new AWS.S3.ManagedUpload({
								params: {
									Bucket: bucketName,
									Key: videoKey,
									Body: media,
								}
							});

							var promise = upload.promise();
							promise.then(
								function(data) {
									console.log(data)
									// set up ad object in dynamodb
									var link = adLink.replace('https://', '');
									var link = adLink.replace('http://', '');
									var adParams = {
										TableName: 'ads',
										Item: {
											adId: (userAttributes[0].Value + Math.random()),
											ownerId: userAttributes[0].Value,
											active: 'active',
											ownerCanActivate: true,
											impressions: 0,
											adname: adName.toLowerCase(),
											promoters:0,
											mediaFile: data.Key,
											adtype: 'video',
											adthumbnail: thumbkey,
											link: link
										}
									}

									docClient.put(adParams, (err, data)=>{
										if (err){
											setAlertMessage(err.message);
											setDisplayAlert(true);
											setAlertSeverity('warning')
											setProgressDisplay('none');
										}
										if (data){
											// increment number of ads for the advertiser
											var params = {
												TableName: 'advertisers',
												Key:{
													"uid": userAttributes[0].Value
												},
												UpdateExpression: "set activeAds = activeAds + :val",
												ExpressionAttributeValues:{
													":val": 1
												},
												ReturnValues:"UPDATED_NEW"
											};
											docClient.update(params, function(err, data) {
												if (err) {
													console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
												}
											});
											history.push('/advertiser/dashboard/Home')
										}
									})
								},
								function(err) {
									setDisplayAlert(true);
									setAlertSeverity('warning');
									setAlertMessage(err.message);
									setProgressDisplay('none');
								}
							);
						},
						function(err) {
							setDisplayAlert(true);
							setAlertSeverity('warning');
							setAlertMessage(err.message);
							setProgressDisplay('none');
						}
					);
				})
			} else if(media.type === 'image/jpeg' || media.type == 'image/png'){
				// upload the photo
				var mediaFolderKey = encodeURIComponent('ads') + '/' + encodeURIComponent('admedia') + "/";
				var photoKey = mediaFolderKey + media.name;
				var upload = new AWS.S3.ManagedUpload({
					params: {
						Bucket: bucketName,
						Key: photoKey,
						Body: media,
					}
				});

				var promise = upload.promise();
				promise.then(
					function(data) {
						console.log(data)
						setProgressDisplay('none');
						// set up ad object in dynamodb
						var link = adLink.replace('https://', '');
						var link = adLink.replace('http://', '');
						var adParams = {
							TableName: 'ads',
							Item: {
								adId: (userAttributes[0].Value + Math.random()),
								ownerId: userAttributes[0].Value,
								active: 'active',
								ownerCanActivate: true,
								impressions: 0,
								adname: adName.toLowerCase(),
								promoters:0,
								mediaFile: data.Key,
								adtype: 'photo',
								link: link
							}
						}

						docClient.put(adParams, (err, data)=>{
							if (err){
								setAlertMessage(err.message);
								setDisplayAlert(true);
								setAlertSeverity('warning')
								setProgressDisplay('none');
								console.log(err)
							}
							if (data){
								var params = {
									TableName: 'advertisers',
									Key:{
										"uid": userAttributes[0].Value
									},
									UpdateExpression: "set activeAds = activeAds + :val",
									ExpressionAttributeValues:{
										":val": 1
									},
									ReturnValues:"UPDATED_NEW"
								};
								docClient.update(params, function(err, data) {
									if (err) {
										console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
									}
								});
								history.push('/advertiser/dashboard/Home')
							}
						})
					},
					function(err) {
						setDisplayAlert(true);
						setAlertSeverity('warning');
						setAlertMessage(err.message);
						setProgressDisplay('none');
					}
				);
			} else{
				setDisplayAlert(true);
				setAlertSeverity('warning');
				setAlertMessage('invalid file format, file must be a PNG, JPEG or mp4');

				setDisplayButton(true);
				setProgressDisplay('none');
			}
		}else{
			setDisplayAlert(true);
			setAlertSeverity('warning');
			setAlertMessage('file is too big, should be 50Mb or less');

			setDisplayButton(true);
			setProgressDisplay('none');
		}
	}

	function dataURItoBlob(dataURI) {
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for(var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}

	// const updateAds = async (uid)=>{
	// 	// update the number of active ads in the users account
	// 	setProgressDisplay(true);
	// 	const userRef = doc(db, "users", uid);
	// 	await updateDoc(userRef, {
	// 		activeAds: increment(1)
	// 	}).then(()=>{
	// 		history.push('/advertiser/dashboard/Home');
	// 	}).catch((error)=>{
	// 			setAlertMessage(error.message);
	// 			setDisplayAlert(true);
	// 			setAlertSeverity('warning');
	// 			setProgressDisplay(true);
	// 	});
	// }

	const handleMedia =(e)=>{
		if (e.target.files[0]){
			setMedia(e.target.files[0])
			setDisplayButton(false)
			setShowPreview(true);
		}
	}

	const clear =()=>{
		setMedia('');
		setDisplayButton(true);
		setShowPreview(false);
	}

	async function generateThumbnail(videoUrl) {
		return new Promise(async (resolve) => {
	  
		  // fully download it first (no buffering):
		  let videoBlob = await fetch(videoUrl).then(r => r.blob());
		  let videoObjectUrl = URL.createObjectURL(videoBlob);
		  let video = document.createElement("video");
	  
		  let seekResolve;
		  video.addEventListener('seeked', async function() {
			if(seekResolve) seekResolve();
		  });
	  
		  video.addEventListener('loadeddata', async function() {
			let canvas = document.createElement('canvas');
			let context = canvas.getContext('2d');
			let [w, h] = [video.videoWidth, video.videoHeight]
			canvas.width =  w;
			canvas.height = h;

			video.currentTime = 1;
			await new Promise(r => seekResolve=r);
	  
			context.drawImage(video, 0, 0, w, h);
			let base64ImageData = canvas.toDataURL();
			let frame = base64ImageData;
			resolve(frame);
		  });
	  
		  // set video src *after* listening to events in case it loads so fast
		  // that the events occur before we were listening.
		  video.src = videoObjectUrl; 
	  
		});
	  }


	const hiddenFileInput = React.useRef(null);

	const handleClick = event => {
		hiddenFileInput.current.click();
	  };

	  const MediaPreview =({file})=>{
		  if (file.type === 'video/mp4'){
			  const objectUrl = window.URL.createObjectURL(file)
			  const isOverSize = file.size > 50000000
			  return(
				  <div>
				  <div>
					<div style={{display:'flex', justifyContent:'center'}}>
						<video width="240" height="200" controls>
						<source src={objectUrl} type="video/mp4"></source>
						</video>
						<DeleteRoundedIcon style={{marginTop:'7em', color:'var(--blueprimary)'}} onClick={clear}/>
					</div>
					{isOverSize && (<p style={{textAlign:'center', width:'100%', color:'#FF0000', fontSize:'.7em'}}>video file size is over 50MB</p>)}
				  </div>
				  </div>
				  
			  )
		  } else if(file.type === 'image/jpeg' || file.type == 'image/png'){
			const objectUrl = window.URL.createObjectURL(file)
			return(
				<div style={{display:'flex', justifyContent:'center', marginTop:'1em'}}>
				  <img src = {objectUrl} alt='ad image' style={{height:'10em', width:'10em', borderRadius:'.5em'}}/>
					<DeleteRoundedIcon style={{marginTop:'3em', color:'var(--blueprimary)'}} onClick={clear}/>
				</div>
			)
		  } else{
			  return(
				  <div style={{display:'flex', justifyContent:'center', marginTop:'1em'}}><p style={{color:'red'}}>invalid file format </p>
				  <DeleteRoundedIcon style={{marginTop:'.7em', color:'var(--blueprimary)'}} onClick={clear}/>
				   </div>
			  )
		  }
	  }

	return (
		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<SpinnerDiv show={progressDisplay} />
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<div className="adcreation_form_div" style={{backgroundColor:'white', paddingTop:'2em', margin:'auto'}}  >
				
				<p style={{fontSize:'2em', fontWeight:'bold', color:'var(--blueprimary)', textAlign:'center'}}>Create new ad</p>
				
				<form style={{padding:'1em'}} onSubmit={uploadAd}>
					
					<div style={{}}>
				
						<p style={{marginBottom:'-.07em'}}>Name the ad</p>
				
						<input type="text" style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}}
						placeholder='the ad name should only be lower case letters' required value={adName} onChange={(e)=>{setAdName(e.target.value)}}/>
					
					</div>
					
					<div style={{}}>
					
						<p style={{marginBottom:'-.07em'}}>Ad link</p>
					
						<input type="text" style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}}
						placeholder='e.g www.mymusic.com/shop' required value={adLink} onChange={(e)=>{setAdLink(e.target.value)}}/> 
				
					</div>
					{displaybutton && (
					<div style={{marginLeft:'2em', marginTop:'2em', marginBottom:'1em'}}>
						<Button variant="contained" startIcon={<AddRoundedIcon />} style={{height:'1em', padding:'1.4em',
						dropShadow:'none', marginTop:'1.2em',
						maxWidth:'12em', textTransform: 'lowercase', flex: 1,
						fontWeight:'700', backgroundColor: '#74D5FF', marginBottom:'1em'}} onClick={handleClick}>
							Media file
						</Button>
					</div>
					)}

					{showPreview && (
						<MediaPreview file={media}/>
					)}
					
					<input required type='file' onChange={handleMedia} ref={hiddenFileInput} style={{display:'none'}} />
					<div style={{display:'flex', justifyContent:'center'}}>
					<button type='submit' style={{ width:'50%', marginTop:'2em', height:'3em',
					 backgroundColor:'var(--blueprimary)', color:'white', fontWeight:'500',
					 marginBottom:'2em', justifySelf:'center', border:'none', borderRadius:'.3em', fontSize:'1em'}}>Continue</button>
					</div>
					
				
				</form>
			
			</div>
		
		</div>
	)
}

export default AdCreation
