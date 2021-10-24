import React, { useState, useEffect } from 'react'

import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';

import { db, storage, auth } from '../../fire';
import { doc, getDoc, collection, addDoc, setDoc,  updateDoc, increment, arrayUnion } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import {  onAuthStateChanged } from "firebase/auth";

function PromotionDetails({match}) {

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState();
	const [promo, setPromo] = useState({id:'', data:{}});

	const [domain, setDomain] = useState()

	const [ad, setAd] = useState({id:'', data:{}});

	useEffect(()=>{
		getPromo();
	}, [])

	const getPromo = async ()=>{
		setProgressDisplay('block');
		// get the promotion
		// then get the related ad
		const promoRef = doc(db, 'promotions', match.params.promotion);
		const promoSnap = await getDoc(promoRef);
		setDomain(window.location.host)

		if (promoSnap.exists()) {
			setPromo({id: promoSnap.id, data: promoSnap.data()});
			getAd(promoSnap.data().ad)
			setProgressDisplay('none');
		}
	}

	const getAd = async (id)=>{
		const adRef = doc(db, 'ads', id);
		const adSnap = await getDoc(adRef);

		if (adSnap.exists()) {
			setAd({id: adSnap.id, data: adSnap.data()});
			if (adSnap.data().type === 'video'){
				setIsVideo(true)
			}
			setProgressDisplay('none');
		}
	}


	const downloadMedia = async ()=>{
		console.log('running')
		getDownloadURL(ref(storage, ad.data.mediaFile)).then(async(url)=>{
			const media = await fetch(url);
			const mediaBlob = await media.blob();
			const mediaUrl = URL.createObjectURL(mediaBlob);

			const anchor = document.createElement('a');
			anchor.href = mediaUrl;
			anchor.download = 'adfile';

			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);

			URL.revokeObjectURL(mediaUrl);
		})

	}

	return (
		<div style={{position:'fixed',backgroundColor:'#F2F2F2', Height:"100vh", width:'100%'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div style={{width:'100%', height:'100vh', overflow:"auto"}}>

				<div className='addetails_subcontainer' style={{backgroundColor:'white', Height:'30em', width:'80%', margin:'auto', marginTop:'17vh',
					borderRadius:'1em', padding:"1em", opacity:'1', overflow:'auto'}}>
						<div className='addetails_media_container' style={{width:'100%', backgroundColor:'#C4C4C4', margin:'auto', height:'10em'}}>
							{!isVideo && <img alt='ad-img' src={mediaUrl} style={{width:'100%', opacity:'1', height:"100%"}} />}
							{isVideo && 
								<video width="240" height="200" controls>
									<source src={mediaUrl} type="video/mp4"></source>
								</video>}
						</div>
						<div style={{}}>
							<div >
								<p style={{fontSize:"1.3em", marginBottom:"-.5em", fontWeight:"bold"}}>{ad.data.name}</p>
							</div>
							<button style={{marginTop:"1em", border:'none', width:"10em",
								height:'3em', fontSize:'1em', borderRadius:'.5em'}} onClick={downloadMedia}>download media file</button>
						</div>
						<div>
							<p style={{marginBottom:'-.5em', fontWeight:"bold"}}>Description:</p>
							<p style={{width:'100%', overflowY:'auto', maxHeight:"10em"}}>{ad.data.description}</p>
						</div>
						<div>
							<p style={{marginBottom:'-.5em', fontWeight:"bold"}}>Tag line</p>
							<p style={{width:'100%', overflowY:'auto', maxHeight:"2.5em"}} >{ad.data.tagline}</p>
						</div>
						<div style={{diaplay:'flex', textAlign:'center', width:'100%',
							marginTop:'2em'}}>
								<p style={{overflow:'auto'}}>{`${domain}/promotion/${match.params.promotion}`}</p>
						</div>
				</div>

			</div>
		</div>
	)
}

export default PromotionDetails
