import React, { useState, useEffect } from 'react'
import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';

import { db, storage, auth } from '../../fire';
import { doc, getDoc, collection, addDoc, setDoc,  updateDoc, increment, arrayUnion } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import {  onAuthStateChanged } from "firebase/auth";

function AdPage({match}) {

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);


	const [isVideo, setIsVideo] = useState(false);
	const [mediaUrl, setMediaUrl] = useState();
	const [promoId, setPromoId] = useState();
	const [linkGenerated, setLinkGenerated] = useState(false);


	const [ad, setAd] = useState({id:'', data:{}});

	useEffect(()=>{
		getAd();
		loadMedia();
	}, [])

	const loadMedia =()=>{
		getDownloadURL(ref(storage, ad.data.mediaFile)).then((url)=>{
			setMediaUrl(url)
		})
	}

	const getAd = async ()=>{
		setProgressDisplay('block');
		 // get the ad from firestore
		 const adRef = doc(db, 'ads', match.params.ad);
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

	const generateLink =  async ()=>{
		setProgressDisplay('block');
		let generated = false;
		// set up a promotion object in firestore
		onAuthStateChanged(auth, async (user)=>{
			// check if the promoter has already generated a link
			const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				let promotions = userSnap.data().promotions;
				if (promotions){
					promotions.forEach((promo) => {
						if (promo === ad.id){
							generated = true
						}
					});
				}
			  }

			  if (!generated){
				  // create promorion objecct in firestore
				const promoRef = doc(collection(db, "promotions"));
				await setDoc(promoRef, {
					ad: ad.id,
					promoter: user.uid,
					link: ad.data.link,
					impressions: 0,
				  }).then(async ()=>{
					  // update the number of promoters for the ad
					  setPromoId(promoRef.id)
					  const adRef = doc(db, "ads", ad.id);
					  await updateDoc(adRef, {
						promoters: increment(1)
					  }).then(async ()=>{
						  // add the ad to the promoter's list of promotions
						  const promoterRef = doc(db, "users", user.uid);
						  await updateDoc(promoterRef, {
							promotions: arrayUnion(ad.id)
						}).then(()=>{
							setProgressDisplay('none');
						});
					  });
					  
					  setLinkGenerated(true);
	
				  }).catch((error)=>{
					setProgressDisplay('none');
					setAlertMessage(error.message);
					setAlertSeverity('warning')
					setDisplayAlert(true)
				  });
			  } else {
				setProgressDisplay('none');
				setAlertMessage('you have already generted a link for this ad');
				setAlertSeverity('warning')
				setDisplayAlert(true)
			  }


			
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
							{!linkGenerated && <button style={{fontSize:'1em', padding:"1em", borderRadius:'.6em', width:'10em',
								border:'none', color:'white', backgroundColor:'var(--blueprimary)'}} onClick={generateLink}>generate link</button>}
							{linkGenerated && <p style={{maxWidth:'70%', overflowX:'auto', color:"var(--blueptimary)"}}>{`viralbase.co/promotions/${promoId}`}</p>}
						</div>
				</div>

			</div>
		</div>
	)
}

export default AdPage
