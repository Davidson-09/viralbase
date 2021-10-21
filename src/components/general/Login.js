import React, {useEffect, useState} from 'react'
import SpinnerDiv from './SpinnerDiv'
import NewAlert from './NewAlert';

import {auth, db} from '../../fire'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from '@firebase/firestore';

import { useHistory, Link } from 'react-router-dom';

import './signup.css' // uses the same css as sign up page



function Login() {

	const history = useHistory();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const[progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);


	const signIn = async (e)=>{
		e.preventDefault();
		setProgressDisplay('block');
		signInWithEmailAndPassword(auth, email, password).then(()=>{
			onAuthStateChanged(auth, async (user)=>{
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const userDoc = docSnap.data();
					console.log(userDoc)
					if (userDoc.role == 'advertiser'){
						// go to advertiser dashbaord
						history.push('/advertiser/dashboard/Home');
					} else{
						// the user is a promoter
						//go to promoter page
						history.push('/promoter/front/home');
					}
				}
			})
		}).catch((error)=>{
			setProgressDisplay('none');
			setDisplayAlert(true);
			setAlertSeverity('warning');
			setAlertMessage(error.message);
		})
	}

	return (
		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<div style={{textAlign:'center', }}>
					<h3>Login to your account</h3>
					<p>Enter the future of marketing</p>
				</div>
				<form style={{padding:'1em'}} onSubmit={signIn}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Email</p>
						<input required type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={email} onChange={(e)=>{setEmail(e.target.value)}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Password</p>
						<input required type='password' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={password} onChange={(e)=>{setPassword(e.target.value)}} />
							<p style={{fontSize:'.7em'}}><Link to='/changepassword'>forgot password?</Link></p>
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Log in</button>
				</form>
				<p style={{textAlign:'center', fontSize:'.7em'}}>Don't have an account? <Link to='/select'>Sign up</Link></p>
			</div>
		</div>
	)
}

export default Login
