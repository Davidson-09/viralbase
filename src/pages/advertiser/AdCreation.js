import React, {useState} from 'react'
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import { Button } from '@material-ui/core';
import VideoThumbnail from 'react-video-thumbnail';
import SpinnerDiv from '../../components/general/SpinnerDiv'
import NewAlert from '../../components/general/NewAlert';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {auth, db, storage} from '../../fire'
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc, increment, setDoc } from '@firebase/firestore';

import { useHistory, Link } from 'react-router-dom';

import './adcreation.css'

function AdCreation() {

	const history = useHistory();

	const [media, setMedia] = useState(''); // ad media file
	const [displaybutton, setDisplayButton] = useState(true); //display upload button
	const [showPreview, setShowPreview] = useState(false);
	const [videoThumbnail, setVideoThumbnail] = useState();

	const [adName, setAdName] = useState('');
	const [description, setDescription] = useState('');
	const [tagline, setTagline] = useState('');
	const [adLink, setAdLink] = useState('');

	const[progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const uploadAd = async (e)=>{
		e.preventDefault();
		if (media.size <= 50000000){
			setProgressDisplay('block');
			setShowPreview(false);
			onAuthStateChanged(auth, async (user)=>{
				let uid = user.uid
				let thumbnailUrl = null; // thumbnail storage pointer
				let videoUrl = null; // video storage pointer
				let photoUrl = null;
				// upload media file to stoage
				if (media.type === 'video/mp4'){
					// upload the thumbnail
					let adRef = ref(storage, `ads/media/thumbnail/${media.name}`)
					setProgressDisplay('none');
					setDisplayAlert(true);
					setAlertSeverity('success');
					setAlertMessage('uploading thumbnail...');
					uploadBytes(adRef, videoThumbnail). then((snapshot)=>{
						thumbnailUrl= snapshot.metadata.fullPath;
						// upload video;
						let adRef = ref(storage, `ads/media/videos/${media.name}`)
						setDisplayAlert(true);
						setAlertMessage('uploading video...');
						uploadBytes(adRef, media).then((snapshot)=>{
							videoUrl=snapshot.metadata.fullPath;
							// set firestore object 
							setAlertMessage('setting up your ad...');
							let newAd = {
								name: adName,
								description: description,
								tagline: tagline,
								link: adLink,
								type: 'video',
								mediaFile: videoUrl,
								thumbnail: thumbnailUrl,
								owner: uid
							}
							// the name of the firestore object is the users uid plus the name of the file
							setDoc(doc(db, 'ads', (uid + adName)), newAd).then(
								history.push('/advertiser/dashboard/Home')
							).catch((error)=>{
								setAlertSeverity('warning');
								setAlertMessage(error.message);
							})
							
						}).catch((error)=>{
							setAlertSeverity('warning');
							setAlertMessage(error.message);
						})
					}).catch((error)=>{
						setProgressDisplay('none');
						setDisplayAlert(true);
						setAlertSeverity('warning');
						setAlertMessage(error.message);
					})
				} else if(media.type === 'image/jpeg' || media.type == 'image/png'){
					// upload photo
					let adRef = ref(storage, `ads/media/photos/${media.name}`)
					setProgressDisplay('none');
					setDisplayAlert(true);
					setAlertSeverity('success');
					setAlertMessage('uploading photo...');
					uploadBytes(adRef, media).then((snapshot)=>{
						photoUrl = snapshot.metadata.fullPath;
						let newAd = {
							name: adName,
							description: description,
							tagline: tagline,
							link: adLink,
							type: 'photo',
							mediaFile: photoUrl,
							owner: uid
						}
						setDoc(doc(db, 'ads', (uid + adName)), newAd).then(
							history.push('/advertiser/dashboard/Home')
						).catch((error)=>{
							setAlertSeverity('warning');
							setAlertMessage(error.message);
						})
					})
				} else{
					setDisplayAlert(true);
					setAlertSeverity('warning');
					setAlertMessage('invalid file format');

					setDisplayButton(true);
					setProgressDisplay('none');
				}
			})
		} else{
			setDisplayAlert(true);
			setAlertSeverity('warning');
			setAlertMessage('file is too big');

			setDisplayButton(true);
			setProgressDisplay('none');
		}
		
		
	}

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
				<div style={{visibility:'hidden'}}>
				  <VideoThumbnail
				  videoUrl={objectUrl}
				  thumbnailHandler={(thumbnail) => setVideoThumbnail(thumbnail)}
				  width={50}
				  height={25}
				  style={{width:'2em', height:'1em', display:'none'}}/>
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
		<div className="adcreation_container" style={{backgroundColor:'var(--blueprimary)', display: 'flex', justifyContent:'center',
		 alignItems: 'center', margin:'-1em', width:'100%', minHeight:'100%', position:'absolute'}}>
			<SpinnerDiv show={progressDisplay} />
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<div className="adcreation_subcontainer" style={{backgroundColor:'white', width:'85%', height:'auto',
			display:'flex', flexDirection:'column', alignItems: 'center', marginTop:'1em', marginBottom:'1em'}}  >
				
				<p style={{fontSize:'2em', fontWeight:'bold', color:'var(--blueprimary)'}}>Create new ad</p>
				
				<form className='adcreation_form' style={{width:'100%'}} onSubmit={uploadAd}>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
				
						<p style={{marginLeft:'1em'}}>Name the ad</p>
				
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'.5em', fontFamily:'Poppins, sans-serif', fontSize:'1em'}}
						placeholder='e.g new fashion line' required value={adName} onChange={(e)=>{setAdName(e.target.value)}}/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
					
						<p style={{marginLeft:'1em'}}>Description</p>
						
						<textarea type="text" style={{border:'none', width:'77%', height:'10em', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'.5em', fontSize:'1em'}}
						placeholder='describe the product or service you wish to promote' value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
						
						<p style={{marginLeft:'1em'}}>Tag line <span style={{color:'#F6F6F6'}}>(optional)</span></p>
					
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'.5em', fontSize:'1em'}}
						placeholder='e.g just do it' value={tagline} onChange={(e)=>{setTagline(e.target.value)}}/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
					
						<p style={{marginLeft:'1em'}}>Ad link</p>
					
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'.5em', fontSize:'1em'}}
						placeholder='add a link that will be shared by promoters' required value={adLink} onChange={(e)=>{setAdLink(e.target.value)}}/> 
				
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
