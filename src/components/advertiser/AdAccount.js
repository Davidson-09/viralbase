import React, {useState, useEffect} from 'react';
import SpinnerDiv from '../general/SpinnerDiv'

import {auth, db} from '../../fire'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc} from '@firebase/firestore';

import { useHistory } from 'react-router-dom';

import businessprofile from '../../res/businessprofile.svg'

// advertiser account

function AdAccount(){

	const [user, setUser] = useState({});
	const [progressDisplay, setProgressDisplay] = useState('none')
	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'));

	const history = useHistory();

	useEffect(()=>{
	}, [])

	

	const logOut =()=>{
		localStorage.setItem('userAttributes', JSON.stringify({}));
		history.push('/')
	}

	return (
		<div style={{flex:1}}>
			<SpinnerDiv show={progressDisplay} />
			<div style={{display:'flex', justifyContent:'center', margintop:'2em'}}>
				<img src={businessprofile} style={{width:'10em', height:'10em'}}/>
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