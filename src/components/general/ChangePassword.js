import React, {useEffect, useState} from 'react'
import SpinnerDiv from './SpinnerDiv'
import NewAlert from './NewAlert';
import { useHistory, Link } from 'react-router-dom';

import {auth} from '../../fire'
import { sendPasswordResetEmail } from "firebase/auth";


function ChangePassword() {

	const [email, setEmail] = useState('');
	const[progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const sendEmail =(e)=>{
		// send change password email
		e.preventDefault();
		setProgressDisplay('block')
		sendPasswordResetEmail(auth, email)
		.then(() => {
			setProgressDisplay('none')
			setAlertMessage('Password reset email sent: check your inbox');
			setAlertSeverity('success');
			setDisplayAlert(true);
		})
		.catch((error) => {
			setProgressDisplay('none')
			setAlertMessage(error.message);
			setAlertSeverity('warning');
			setDisplayAlert(true);
		});

	}


	return (
		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<div style={{textAlign:'center', }}>
					<h3>Change password</h3>
				</div>
				<form style={{padding:'1em'}} onSubmit={sendEmail}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Enter your email</p>
						<input required type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={email} onChange={(e)=>{setEmail(e.target.value)}} />
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Reset password</button>
				</form>
				<p style={{textAlign:'center', fontSize:'.7em'}}><Link to='/login'>Log in</Link></p>
			</div>
		</div>
	)
}

export default ChangePassword
