import React, { useState, useEffect } from 'react';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import SpinnerDiv from '../../components/general/SpinnerDiv';

import { useHistory } from 'react-router-dom';

import { db, storage } from '../../fire';
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import shoe from '../../res/shoes.jpg'

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

	

	const history = useHistory();

	useEffect(()=>{
		console.log('on God')
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
		 const adRef = doc(db, 'ads', match.params.adid);
		 const adSnap = await getDoc(adRef);

		 if (adSnap.exists()) {
			setAd({id: adSnap.id, data: adSnap.data()});
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
		setProgressDisplay('block');
		await deleteDoc(doc(db, "ads", ad.id));
		history.push('/advertiser/dashboard/Home')
	}

	const changeMode = async ()=>{
		if (ad.data.active){
			// if the a is active deactivate it
			setProgressDisplay('block');
			await updateDoc(doc(db, "ads", ad.id), {
				active: false
			  });
			  setModeColor(red);
			  setButtonColor(green);
			  setButtonText('activate');
			  setMode('inactive')
			  setProgressDisplay('none');
		} else{
			setProgressDisplay('block');
			await updateDoc(doc(db, "ads", ad.id), {
				active: false
			  });
			  setModeColor(green);
			  setButtonColor(red);
			  setButtonText('deactivate');
			  setMode('active')
			  setProgressDisplay('none');
		}
		
	}

	return (
		<div style={{position:'fixed',backgroundColor:'#F2F2F2', Height:"100vh", width:'100%'}}>
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
