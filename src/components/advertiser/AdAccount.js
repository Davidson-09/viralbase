import React, {useState, useEffect} from 'react';
import SpinnerDiv from '../general/SpinnerDiv'

import {auth, db} from '../../fire'
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, collection, query, where, getDocs } from '@firebase/firestore';

import { useHistory } from 'react-router-dom';

import businessprofile from '../../res/businessprofile.svg'

function AdAccount(){

	const [user, setUser] = useState({});
	const [progressDisplay, setProgressDisplay] = useState('none')

	const history = useHistory();

	useEffect(()=>{
		getUser()
	}, [])

	const getUser =()=>{
		setProgressDisplay('block');
		onAuthStateChanged(auth, async (user)=>{
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userDoc = docSnap.data();
				setUser(userDoc);
				setProgressDisplay('none');
			} else{
				setProgressDisplay('none');
			}
		})
	}

	const signOut =()=>{
		history.push('/')
	}

	return (
		<div style={{flex:1}}>
			<SpinnerDiv show={progressDisplay} />
			<div style={{display:'flex', justifyContent:'center', margintop:'2em'}}>
				<img src={businessprofile} style={{width:'10em', height:'10em'}}/>
			</div>
			<p style={{fontSize:'2em', fontWeight:'bold', textAlign:'center'}}>{user.businessName}</p>
			<div style={{display:'flex', justifyContent:'center'}}>
				<button style={{fontSize:'1em', width:'5em', backgroundColor:'var(--blueprimary)', color:'white',
					border:'none', height:'2em', borderRadius:'.5em'}} onClick={signOut}>
					log out
				</button>
			</div>
		</div>
	)
}

export default AdAccount;