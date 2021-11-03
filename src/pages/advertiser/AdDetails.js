import React, { useState, useEffect } from 'react';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import SpinnerDiv from '../../components/general/SpinnerDiv';

import { useHistory } from 'react-router-dom';

import { db, storage, auth } from '../../fire';
import { doc, getDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { ref, getDownloadURL,  deleteObject } from "firebase/storage";
import {  onAuthStateChanged } from "firebase/auth";
import ReactPlayer from 'react-player'

import './addetail.css';

function AdDetails({match}) {

	const green = '#00FF00';
	const red = '#FF0000';

	const [ad, setAd] = useState({id:'', data:{}});
	const [progressDisplay, setProgressDisplay] = useState('none')
	const [mode, setMode] = useState('active');
	const [modeColor, setModeColor] = useState(green);
	const [statement, setStatement] = useState(''); // the statement of how many people are promoting the ad
	const [buttonColor, setButtonColor] = useState(red);
	const [buttonText, setButtonText] = useState('deactivate');
	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState();
	const [active, setActive] = useState();

	

	const history = useHistory();

	useEffect(()=>{
		getAd();
		
	}, [])

	const loadMedia =(ad)=>{
		if (ad.data.type === 'photo'){
			getDownloadURL(ref(storage, ad.data.mediaFile)).then((url)=>{
				setMediaUrl(url)
			})
		} else {
			// it is a video
			getDownloadURL(ref(storage, ad.data.mediaFile)).then(async (url)=>{
			const media = await fetch(url);
			const mediaBlob = await media.blob();
			const mediaUrl = URL.createObjectURL(mediaBlob);
			setMediaUrl(mediaUrl);
			})
		}
		
	}

	const getAd = async ()=>{
		setProgressDisplay('block');
		 // get the ad from firestore
		 const adRef = doc(db, 'ads', match.params.adid);
		 const adSnap = await getDoc(adRef);

		 if (adSnap.exists()) {
			setAd({id: adSnap.id, data: adSnap.data()});
			setActive(adSnap.data().active)
			loadMedia({id: adSnap.id, data: adSnap.data()});
			if (!(adSnap.data().active)){
				setMode('Inactive');
				setModeColor(red);
				setButtonColor(green);
				setButtonText('activate');
			}
			if (adSnap.data().promoters === 0){
				setStatement('Nobody is');
			} else if(adSnap.data().promoters === 1){
				setStatement('1 person is');
			} else {
				setStatement(`${adSnap.data().promoters} people are`);
			}
			if (adSnap.data().type === 'video'){
				setIsVideo(true)
			}
			setProgressDisplay('none');
		} else{
			setProgressDisplay('none');
		}
	}

	const deleteAd = async ()=>{
		// delete firestore object
		setProgressDisplay('block');
		await deleteDoc(doc(db, "ads", ad.id)).then(()=>{
			const mediaRef = ref(storage, ad.data.mediaFile);
			deleteObject(mediaRef).then(() => {
				// File deleted successfully
				// decrement the number of active ads
				decrementActiveAds()
				
			  }).catch((error) => {
				// Uh-oh, an error occurred!
			  });
		});
		//delete media file
	}

	const decrementActiveAds =()=>{
		// this function reduces the number of an advertisers active ads by 1
		
		onAuthStateChanged(auth, async (user)=>{
			const userRef = doc(db, "users", user.uid);
			await updateDoc(userRef, {
				activeAds: increment(-1)
			}).then(()=>{
				history.push('/advertiser/dashboard/Home')
			})
		})
	}

	const changeMode = async ()=>{
		if (active){
			// if the ad is active deactivate it
			setProgressDisplay('block');
			await updateDoc(doc(db, "ads", ad.id), {
				active: false
			  });
			  setModeColor(red);
			  setButtonColor(green);
			  setButtonText('activate');
			  setMode('inactive')
			  setProgressDisplay('none');
			  setActive(false)
			  console.log('deactivated');
		} else{
			setProgressDisplay('block');
			await updateDoc(doc(db, "ads", ad.id), {
				active: true
			  });
			  setModeColor(green);
			  setButtonColor(red);
			  setButtonText('deactivate');
			  setMode('active')
			  setProgressDisplay('none');
			  setActive(true)
			  console.log('activated')
		}
		
	}

	return (
		<div style={{position:'fixed',backgroundColor:'#F2F2F2', Height:"100vh", width:'100%'}}>
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
								<p style={{fontSize:"1.3em", marginBottom:"-.5em", fontWeight:"bold"}}>{ad.data.name}</p>
								<p style={{color:'var(--blueprimary)'}}>{`${ad.data.impressions} impressions`}</p>
							</div>
							<p style={{marginTop:'1.5em', color:modeColor}}>{mode}</p>
						</div>
						<div>
							<p style={{marginBottom:'-1.5em'}}>Link:</p>
							<p style={{ width:'70%', overflow:'auto', color:'var(--blueprimary)'}}>{ad.data.link}</p>
						</div>
						<div>
							<p style={{marginBottom:'-.5em', fontWeight:"bold"}}>Description:</p>
							<p style={{width:'100%', overflowY:'auto', maxHeight:"10em"}}>{ad.data.description}</p>
						</div>
						<div>
							<p style={{marginBottom:'-.5em', fontWeight:"bold"}}>Tag line</p>
							<p style={{width:'100%', overflowY:'auto', maxHeight:"3em"}}>{ad.data.tagline}</p>
						</div>
						<p style={{textAlign:'center', marginTop:'1.5em', color:'var(--blueprimary)'}}>{`${statement} promoting this ad`}</p>
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
