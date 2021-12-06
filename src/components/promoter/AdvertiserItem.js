import React, {useState, useEffect} from 'react';
import businessprofile from '../../res/businessprofile.svg'
import * as AWS from 'aws-sdk';

function AdvertiserItem({advertiser, setChoice, choices}){

	const [selected, setSelected] = useState(false);
	const [profileImage, setProfileImage] = useState(businessprofile)

	const bucketName = 'viralbaseadsbucket'
	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});


	useEffect(()=>{
		if (advertiser.profileImage){
			getProfileImage(advertiser.profileImage)
		}
	},[])

	const getProfileImage = async (profileImage)=>{
		if (advertiser.profileImage){
			// get profile image from s3
			const params = {
				Bucket: bucketName,
				Expires: 3000,
				Key: profileImage, // this key is the S3 full file path (ex: mnt/sample.txt)
			};
			const url = await s3.getSignedUrl('getObject', params)
			setProfileImage(url)
		}
	}

	const setSelectedMode =()=>{
		let c = choices;
		if (selected){
			setSelected(false);
			// remove from selected list
			c = c.filter(item => item.uid !== advertiser)
			console.log(c)
			setChoice(c)
		} else{
			setSelected(true);
			// add to selected list
			c.push(advertiser.uid);
			console.log(c)
			setChoice(c)
		}
	}

	return (
		<div style={{display:'flex', padding:'1em', justifyContent:'center'}} onClick={setSelectedMode}>
			<img src={profileImage} alt='influencer profile' style={{width:'3em', height:'3em', borderRadius:'50%',
				margin:'1em'}}/>
			<p style={{marginTop:'2em'}}>{advertiser.uid}</p>
			{selected && <div style={{width:'1em', height:'1em', borderRadius:'50%', backgroundColor:'var(--blueprimary)',
				marginTop:'2em', marginLeft:'20%'}}></div>}
		</div>
	)
}

export default AdvertiserItem;