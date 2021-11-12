import React, {useEffect, useState, useContext} from 'react'
import SpinnerDiv from './SpinnerDiv';
import {Link, useHistory} from 'react-router-dom';
import NewAlert from './NewAlert';
import cogPool from '../../UserPool'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

import * as AWS from 'aws-sdk';

import './signup.css'

function SignUp({match}){

	const docClient = new AWS.DynamoDB.DocumentClient()


	const [title, setTitle] = useState('Full Name') // the title of the name input

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState(''); //phone number
	const [password, setPassword] = useState('');
	const [showPurposeBox, setShowPurposeBox] = useState(false);
	const [purpose, setPurpose] = useState();

	const[progressDisplay, setProgressDisplay] = useState('none');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const history = useHistory();

	//const user = {};

	useEffect(()=>{
		if (match.params.role === 'advertiser'){
			setTitle('Name'); 
			setShowPurposeBox(true);
		}
	})



	const register = async(e)=>{
		e.preventDefault();

		setProgressDisplay('block');

		if (match.params.role === 'advertiser'){
			const role = 'advertiser';
			const attributeList = [];
			attributeList.push(new CognitoUserAttribute({Name:"custom:role",Value: 'advertiser'}))
			attributeList.push(new CognitoUserAttribute({Name:"custom:purpose",Value: purpose}))
			attributeList.push(new CognitoUserAttribute({Name:"phone_number",Value: phone}))
			attributeList.push(new CognitoUserAttribute({Name:"email",Value: email}))
			attributeList.push(new CognitoUserAttribute({Name:"name",Value: name}))

			cogPool.signUp(email, password, attributeList, null, (err, data)=>{
				if (err){
					console.log(err)
					setAlertMessage(err.message);
					setDisplayAlert(true);
					setAlertSeverity('warning')
				}
				console.log(data);
				setProgressDisplay('none');

				if (data){
					// set up user account in dynamodbs
					console.log(data.userSub);
					const userCredentials = {email, password, role}
					localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
					setUpAdvertiser(data.userSub);
					
				}
			})
		} else{
			const role = 'promoter';
			const attributeList = [];
			attributeList.push(new CognitoUserAttribute({Name:"custom:role",Value: 'promoter'}))
			attributeList.push(new CognitoUserAttribute({Name:"phone_number",Value: phone}))
			attributeList.push(new CognitoUserAttribute({Name:"email",Value: email}))
			attributeList.push(new CognitoUserAttribute({Name:"name",Value: name}))

			cogPool.signUp(email, password, attributeList, null, (err, data)=>{
				if (err){
					console.log(err)
					setAlertMessage(err.message);
					setDisplayAlert(true);
					setAlertSeverity('warning')
				}
				console.log(data);
				if (data){
					// set up advertiser account in dynamodb
					// go to promoter page
					const userCredentials = {email, password, role}
					localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
					setupPromoter(data.userSub)
				}
				setProgressDisplay('none');

				
			})
		}
		
	}

	const setUpAdvertiser =(userSub)=>{
		var params = {
			TableName: 'advertisers',
			Item: {
				availableImpressions: 0,
				activeAds: 0,
				uid: userSub,
				impressionsGotten:0
			}
		}

		docClient.put(params, (err, data)=>{
			if (err){
				setAlertMessage(err.message);
				setDisplayAlert(true);
				setAlertSeverity('warning')
				console.log(err)
			}
			console.log(data);
			if (data){
				history.push('/confirmaccount')
			}
		})
	}

	const setupPromoter =(userSub)=>{
		var params = {
			TableName: 'promoters',
			Item: {
				promotions: 0, // number of promotions
				impressions: 0,
				uid: userSub,
				earnings:0,
			}
		}

		docClient.put(params, (err, data)=>{
			if (err){
				setAlertMessage(err.message);
				setDisplayAlert(true);
				setAlertSeverity('warning')
				console.log(err)
			}
			console.log(data);
			if (data){
				history.push('/confirmaccount')
			}
		})
	}

	return(

		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<div style={{textAlign:'center', }}>
					<h3>Create a free account</h3>
					<p>welcome to the future of marketing</p>
				</div>
				<form onSubmit={register} style={{padding:'1em'}}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>{title}</p>
						<input required type='text' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={name} onChange={(e)=>{setName(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Email</p>
						<input required type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Phone Number</p>
						<input required type='phone number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} placeholder='e.g. +2341234567893'
							value={phone} onChange={(e)=>{setPhone(e.target.value)}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Password</p>
						<input required type='password' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={password} onChange={(e)=>{setPassword(e.target.value)}} />
					</div>
					{showPurposeBox && (<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>What will you use viralbase for?</p>
						<input required style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} placeholder='to promote my....'
							 value={purpose} onChange={(e)=>{setPurpose(e.target.value)}} />
						</div>)}
					
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Create account</button>
				</form>
				<p style={{textAlign:'center', fontSize:'.7em'}}>Already have an account? <Link to='/login'>Log in</Link></p>
			</div>
		</div>

	)
}

export default SignUp;