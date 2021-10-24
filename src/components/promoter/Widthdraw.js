import React, {useEffect, useState} from 'react'
import SpinnerDiv from '../general/SpinnerDiv';
import NewAlert from '../general/NewAlert';
import { db, storage, auth } from '../../fire';
import { doc, getDoc, collection, addDoc, setDoc,  updateDoc, increment, arrayUnion } from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";
import {useHistory} from 'react-router-dom';

function Widthdraw() {

	const history = useHistory();

	const[progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const [amount, setAmount] = useState();
	const [bank, setBank] = useState('zenith');
	const [accountNum, setAccountNum] = useState();

	const sendRequest =(e)=>{
		e.preventDefault();
		onAuthStateChanged(auth, async (user)=>{
			setProgressDisplay('block')
			// send withdrawal request to firestore
			const requestRef = doc(collection(db, "withdrawals"));
			await setDoc(requestRef, {
				recepient: user.uid,
				amount, bank, amount,
				status:'pending', accountNum
			}).then(()=>{
				setBank('');
				setAmount(0);
				setAccountNum(0);
				// show message
				setProgressDisplay('none')
				setAlertMessage('withdrawal request sent successfully');
				setAlertSeverity('success')
				setDisplayAlert(true)
				setTimeout(()=>{
					history.push('/promoter/front/account');
				}, 1500)
				// and go back to account page
			}).catch(()=>{
				setProgressDisplay('none')
				setAlertMessage('something went wrong');
				setAlertSeverity('warning')
				setDisplayAlert(true)
			})
		})
	}

	return (
		<div style={{backgroundColor:'#F2F2F2', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			<SpinnerDiv show={progressDisplay} />
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<form style={{padding:'1em'}} onSubmit={sendRequest}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Enter account number</p>
						<input required type='number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={accountNum}  onChange={(e)=>{setAccountNum(e.target.value)}}/>
					</div>
					<div>
					<p style={{marginBottom:'-.07em'}} onChange={(e)=>{setBank(e.target.value)}}>Select your bank</p>
						<select required name='banks' >
							<option value="zenith">Zenith Bank</option>
							<option value='firstbank'>First Bank</option>
							<option value='uba'>UBA</option>
						</select>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Enter amount</p>
						<input required type='number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}}  value={amount}  onChange={(e)=>{setAmount(e.target.value)}}/>
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Send withdrawal request</button>
				</form>
			</div>
		</div>
	)
}

export default Widthdraw
