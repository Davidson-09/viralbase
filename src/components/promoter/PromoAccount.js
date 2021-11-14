import React, {useEffect, useState} from 'react'
import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';


import {auth, db} from '../../fire'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from '@firebase/firestore';
import * as AWS from 'aws-sdk';

import {useHistory, Link} from 'react-router-dom';

import profile from '../../res/profile.svg'

//promoter account

import './promoaccount.css'

function PromoAccount() {

	const history = useHistory();
	const docClient = new AWS.DynamoDB.DocumentClient()

	const [userData, setUserData] = useState({});

	const [failed, setFailed] = useState(false); // failed to meet withdrawal requirements

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'))

	useEffect(()=>{
		 getUserData()
	}, [])

	const getUserData =()=>{
		// get account details
		getUserAttributes();
	}

	const getUserAttributes =()=>{
		setProgressDisplay('block');
		var params = {
			TableName: 'promoters',
			KeyConditionExpression: "#uid = :id",
			ExpressionAttributeNames:{
				"#uid": "uid"
			},
			ExpressionAttributeValues: {
				// item zero of user attributes is sub
				":id": userAttributes[0].Value
			}
		}

		docClient.query(params, (err, data)=>{
			
			if (err){
				setProgressDisplay('none')
				setProgressDisplay('none');
			} else{
				var accountDetails = data.Items[0]
				localStorage.setItem('accountDetails', JSON.stringify(accountDetails));
				setUserData(accountDetails)
				setProgressDisplay('none');
			}
		})
	}

	const toWidthdraw =()=>{
		if (userData.earnings < 5000){
			setFailed(true)
			// show alert
			console.log('running')
			setAlertMessage('you must have at least N5000 in earnings to withdraw')
			setAlertSeverity('warning');
			setDisplayAlert(true);
		} else{
			history.push(`/promoter/withdraw/${userAttributes[0].Value}`)
		}
	}

	const goToPromotionsPage =()=>{
		history.push('/promoter/front/promotions')
	}

	return (
		<div style={{}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} style={{marginTop:'-10em'}}/>
			<SpinnerDiv show={progressDisplay} />
			<div style={{display:'flex', justifyContent:"center", marginTop:"3em"}}>
			 <img src={profile} style={{width:'10em', height:'10em'}} />
			</div>
			<p style={{textAlign:"center", fontSize:'1.5em'}}>{userAttributes[2].Value}</p>
			<div className='promoaccount_subcontainer'>
				<div style={{padding:'1em', margin:'1em', backgroundColor:'#E7EDF4', borderRadius:'.5em'}}>
					<p style={{fontSize:'1.1em', margin:0, fontWeight:'600'}}>Impressions</p>
					<p style={{margin:0}}>{userData.impressions}</p>
				</div>
				<div style={{padding:'1em', margin:'1em', backgroundColor:'#E1F6FF', borderRadius:'.5em'}}>
					<p style={{fontSize:'1.1em', margin:0, fontWeight:'600'}}>Earnings</p>
					<p style={{margin:0}}>N <span>{userData.earnings}</span></p>
				</div>
			</div>
			<div className='promoaccount_adcontainer' style={{padding:'1em', margin:'1em', backgroundColor:'#FDF3F6', borderRadius:'.5em'}}
				onClick={goToPromotionsPage}>
					<p style={{fontSize:'1.1em', margin:0, fontWeight:'600'}} >Ads promoted</p>
					<p style={{margin:0}}>{userData.promotions} <span style={{fontWeight:'100', marginLeft:'1em'}}>click to see</span></p>
			</div>
			<div style={{textAlign:'center'}}>
			<button style={{width:'10em', fontSize:'1em', height:'3em', border:'none', borderRadius:'.5em',
				backgroundColor:'var(--blueprimary)', fontWeight:'700', color:'white'}} onClick={toWidthdraw}>withdraw</button>
			</div>
			{failed && <p style={{textAlign:'center', color:'red'}}>you must have at least N5000 in earnings to withdraw</p>}
			<Link to='/'><p style={{textAlign:'center', color:'var(--blueprimary)'}} onClick={()=>{signOut(auth)}}>log out</p></Link>
			
		</div>
	)
}

export default PromoAccount
