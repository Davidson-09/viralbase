import React, {useEffect, useState} from 'react'


import { useHistory } from 'react-router-dom';
import './adCard.css'
import * as AWS from 'aws-sdk';
import placeholder from '../../res/adplaceholder.svg'

function AdCard({ad}){

	const history = useHistory();

	const [image, setImage] = useState(placeholder);

	const bucketName = 'viralbaseadsbucket'

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	useEffect(()=>{
		loadMedia();
	}, [])

	const loadMedia = async ()=>{
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

	const toAdDetails =()=>{
		history.push(`/promoter/addetails/${ad.adId}`)
	}

	return(
		<div style={{margin:'1em'}} onClick={toAdDetails}>
			<div className='ad_card_img' style={{width:'10em', height:'12em', textAlign:'center'}}>
				<img className='ad_card_img' alt='ad image' src={image} style={{width:'10em', height:'10em', borderRadius:'1em',
					objectFit:'contain'}}/>
				<p style={{color:'var(--blueprimary)', marginTop:'-.1em'}}>{ad.adname}</p>
			</div>
			
		</div>
	)
}

export default AdCard;