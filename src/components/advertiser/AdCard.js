import React, {useState, useEffect} from 'react'

import { ref, getDownloadURL } from "firebase/storage";
import {storage} from '../../fire'
import './adCard.css'

import { useHistory } from 'react-router-dom';

function AdCard({ad}){

	const history = useHistory();

	const [impressions, setImpressions] = useState(0);
	const [image, setImage] = useState();

	useEffect(()=>{
		if (ad.data.impressions){
			setImpressions(ad.data.impressions);
		}
		getAdImage();
	}, [])

	const getAdImage = async ()=>{
		if (ad.data.type === 'photo'){
			
			const pathReference = ref(storage, ad.data.mediaFile);
			getDownloadURL(pathReference).then((url)=>{
				setImage(url);
			})
		} else{
			// it is a video
			// so get the thumbnail
			const pathReference = ref(storage, ad.data.thumbnail);
			getDownloadURL(pathReference).then((url)=>{
				setImage(url);
			})
		}
	}

	const toDetails =()=>{
		history.push(`/advertiser/addetails/${ad.id}`)
	}

	return(
		<div style={{marginBottom:'1em'}} onClick={toDetails}>
			<div className='ad_card_img1' style={{width:'10em', height:'10em' }}>
				<img className='ad_card_img1' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'.5em'}}/>
			</div>
			<p className='adcard_text' style={{fontWeight:'bold'}}>{ad.data.name}</p>
			<p style={{fontSize:'.7em', marginTop:"-1em", color:'var(--blueprimary)'}}>{`${impressions} impressions`}</p>
		</div>
	)
}

export default AdCard;