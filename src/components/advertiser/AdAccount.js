import React, {useState, useEffect} from 'react';
import SpinnerDiv from '../general/SpinnerDiv'

import { useHistory } from 'react-router-dom';

import * as AWS from 'aws-sdk';

import businessprofile from '../../res/businessprofile.svg'

// advertiser account

function AdAccount(){
	const [profile, setProfile] = useState()  // profile pic
	const [profileimg, setProfileimg] = useState(businessprofile)
	const [progressDisplay, setProgressDisplay] = useState('none')
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'));
	const docClient = new AWS.DynamoDB.DocumentClient()
	const bucketName = 'viralbaseadsbucket'
	const [showButton, setShowButton] = useState(false);
	const [btnText, setbtnText] = useState('upload profile pic')

	const s3 = new AWS.S3({
		apiVersion: "2006-03-01",
		params: { Bucket: bucketName }
	});

	const history = useHistory();

	useEffect(()=>{
		loadProfilePic()
	}, [])

	const loadProfilePic = async ()=>{
		if (localStorage.getItem('profilepic')){
			const profile = JSON.parse(localStorage.getItem('profilepic'))
			console.log(profile)
			const params = {
				Bucket: bucketName,
				Expires: 3000,
				Key: profile, // this key is the S3 full file path (ex: mnt/sample.txt)
			};
			const url = await s3.getSignedUrl('getObject', params)
			setProfileimg(url);
		}
	}

	const handleMedia =(e)=>{
		if (e.target.files[0]){
			var profile = e.target.files[0]
			if (profile.type === 'image/jpeg' || profile.type == 'image/png'){
				const objectUrl = window.URL.createObjectURL(profile)
				setProfileimg(objectUrl)
				setProfile(profile)
				console.log(profile)
				setShowButton(true)
			}
		}
	}

	const logOut =()=>{
		localStorage.setItem('userAttributes', JSON.stringify({}));
		history.push('/')
	}

	const hiddenFileInput = React.useRef(null);

	const handleClick = event => {
		hiddenFileInput.current.click();
	};


	const uploadPic =()=>{
		setbtnText('uploading...')
		if (profile){
			console.log(profile)
			if (profile.type === 'image/jpeg' || profile.type == 'image/png'){
			// upload to s3 
			var mediaFolderKey = encodeURIComponent(`profilepictures`) + '/'+  encodeURIComponent(userAttributes[3].Value) + "/";
			var photoKey = mediaFolderKey + profile.name;
			var upload = new AWS.S3.ManagedUpload({
				params: {
					Bucket: bucketName,
					Key: photoKey,
					Body: profile,
				}
			});

			var promise = upload.promise();
			promise.then(function(data){
				const key = data.Key;

				var params = {
					TableName: 'advertisers',
					Key:{
						"uid": userAttributes[3].Value,
					},
					UpdateExpression: "set profilepic=:a",
					ExpressionAttributeValues:{
						":a": key
					},
					ReturnValues:"UPDATED_NEW"
				};

				docClient.update(params, function(err, data) {
					if (err) {
						console.error(err)
					} else {
						localStorage.setItem('profilepic', JSON.stringify(key))
						console.log(key)
						loadProfilePic()
						console.log('done');
						setShowButton(false)
						
					}
				});
			})
			// update advertiser
		}
		
		}
	}

	return (
		<div style={{flex:1}}>
			<SpinnerDiv show={progressDisplay} />
			<div style={{display:'flex', justifyContent:'center', margintop:'2em', textAlign:'center'}}>
				<img src={profileimg} style={{width:'10em', height:'10em', borderRadius:'50%'}} onClick={handleClick}/>
				<input required type='file' onChange={handleMedia} ref={hiddenFileInput} style={{display:'none'}} />
			</div>
			<div style={{textAlign:'center'}}>
				{showButton && <button onClick={uploadPic}>{btnText}</button>}
			</div>
			<p style={{fontSize:'2em', fontWeight:'bold', textAlign:'center'}}>{userAttributes[3].Value}</p>
			<div style={{display:'flex', justifyContent:'center'}}>
				<button style={{fontSize:'1em', width:'5em', backgroundColor:'var(--blueprimary)', color:'white',
					border:'none', height:'2em', borderRadius:'.5em'}} onClick={logOut}>
					log out
				</button>
			</div>
		</div>
	)
}

export default AdAccount;