import React, {useContext, useState} from 'react'
import NewAlert from './NewAlert';
import { useHistory} from 'react-router-dom';
import SpinnerDiv from './SpinnerDiv';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'
import cogPool from '../../UserPool';

function ConfirmAccount() {

	const userCredentials = JSON.parse(localStorage.getItem('userCredentials'));

	const history = useHistory('')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);
	const[progressDisplay, setProgressDisplay] = useState('none');

	const signIn =()=>{
		setProgressDisplay('block');
		// sign in the user if the account is confirmed
		const cogUser = new CognitoUser({
			Username: userCredentials.email,
			Pool: cogPool
		});
		const authDetails = new AuthenticationDetails({
			Username: userCredentials.email,
			Password: userCredentials.password
		})

		cogUser.authenticateUser(authDetails, {
			onSuccess: (result)=>{
				cogUser.getUserAttributes((err, data)=>{
					if(err){
						setAlertMessage(err.message);
						setAlertSeverity('warning');
						setDisplayAlert(true);
						setProgressDisplay('none')
					}else{
						localStorage.setItem('userAttributes', JSON.stringify(data));
						if (userCredentials.role === 'advertiser'){
							history.push('/advertiser/dashboard/Home')
						} else{
							// the user is a promoter
							history.push('/promoter/front/home')
						}
						
					}
				});
				
			},
			onFailure: (err)=>{
				setAlertMessage(err.message);
				setAlertSeverity('warning');
				setDisplayAlert(true);
				setProgressDisplay('none')
			}
		})
		
	}

	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', padding:'2em'}}>
				<p style={{textAlign:'center'}}>verify your account: check your inbox for a verification link</p>
				<div style={{textAlign:'center', margin:'1em'}}>
					<button onClick={signIn} style={{fontSize:'1em', minWidth:'10em', padding:'1em', fontWeight:'bold',
						 backgroundColor:'var(--blueprimary)', border:'none', color:'white', borderRadius:'.5em'}}>continue</button>
				</div>
			</div>
		</div>
		</div>
	)
}

export default ConfirmAccount
