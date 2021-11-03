import React, {useEffect, useState} from 'react'

import { ref, getDownloadURL } from "firebase/storage";
import {storage} from '../../fire'

import { useHistory } from 'react-router-dom';
import './adCard.css'

function AdCard({ad}){

	const history = useHistory();

	const [image, setImage] = useState();

	useEffect(()=>{
		loadMedia();
	}, [])

	const loadMedia = async ()=>{
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

	const toAdDetails =()=>{
		history.push(`/promoter/addetails/${ad.id}`)
	}

	return(
		<div style={{margin:'1em'}} onClick={toAdDetails}>
			<div className='ad_card_img' style={{width:'10em', height:'12em', textAlign:'center'}}>
				<img className='ad_card_img' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'1em',
					objectFit:'contain'}}/>
				<p style={{color:'var(--blueprimary)', marginTop:'-.1em'}}>{ad.data.name}</p>
			</div>
			
		</div>
	)
}

export default AdCard;