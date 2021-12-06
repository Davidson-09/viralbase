import React, {useState, useEffect} from 'react'
import './adCard.css'
import placeholder from '../../res/adplaceholder.svg'

import * as AWS from 'aws-sdk';

import { useHistory } from 'react-router-dom';

function AdCard({ad}){

	const history = useHistory();

	const [impressions, setImpressions] = useState(0);
	const [image, setImage] = useState(placeholder);
	const bucketName = 'viralbaseadsbucket'

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	useEffect(()=>{
		getAdImage();
	}, [])

	const getAdImage = async ()=>{
		if (ad.adtype === 'photo'){
			const params = {
				Bucket: bucketName,
				Expires: 3000,
				Key: ad.mediaFile, // this key is the S3 full file path (ex: mnt/sample.txt)
			};
			const url = await s3.getSignedUrl('getObject', params)

			// const photo = await fetch(url);
			// const photoBlob = await photo.blob();
			// const photoUrl = URL.createObjectURL(photoBlob);
			setImage(url);
		} else {
			const params = {
				Bucket: bucketName,
				Expires: 3000,
				Key: ad.adthumbnail, // this key is the S3 full file path (ex: mnt/sample.txt)
			};
			const url = await s3.getSignedUrl('getObject', params)

			// const photo = await fetch(url);
			// const photoBlob = await photo.blob();
			// const photoUrl = URL.createObjectURL(photoBlob);
			setImage(url);
		}
	}

	const toDetails =()=>{
		localStorage.setItem('currentAd', JSON.stringify(ad));
		history.push(`/influencer/addetails`)
	}

	return(
		<div style={{marginBottom:'1em'}} onClick={toDetails}>
			<div className='ad_card_img1' style={{width:'10em', height:'12em', textAlign:'center' }}>
				<img className='ad_card_img1' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'.5em',
					objectFit:'contain'}}/>
				<p className='adcard_text' style={{fontWeight:'bold'}}>{ad.adname}</p>
				<p style={{fontSize:'.7em', marginTop:"-1em", color:'var(--blueprimary)'}}>{`${ad.impressions} impressions`}</p>
			</div>
			
		</div>
	)
}

export default AdCard;