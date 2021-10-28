import React, {useState, useEffect} from 'react'
import SpinnerDiv from '../../components/general/SpinnerDiv'
import NewAlert from '../../components/general/NewAlert';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

import {auth, db} from '../../fire'
import { onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc, increment } from '@firebase/firestore';

import { useHistory, Link } from 'react-router-dom';

import './proceed.css'

// NOTE: this component is supposed to be named ImpressionPurchase
// it has its current name because the idea for this site went
// through a lot of changes in my mind but due to the feeling
// of urgency during development I couldn't care less about 
// making the necessary changes

function Proceed() {

	const history = useHistory();

	const [impressions, setImpressions] = useState(0);
	const [price, setPrice] = useState(0);
	const [user, setUser] = useState('')

	const[progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const config = {
		public_key: 'FLWPUBK_TEST-3c04ac41964e14544df0f3ec7b4068ef-X',
		tx_ref: Date.now(),
		amount: price,
		currency: 'NGN',
		payment_options: 'card,mobilemoney,ussd',
		customer: {
		  email: user.email,
		  uid: user.uid
		},
		customizations: {
		  title: 'viralbase'
		},
	  };

		const handleFlutterPayment = useFlutterwave(config);

	useEffect(()=>{
		getUser();
	}, [])

	const getUser =()=>{
		onAuthStateChanged(auth, async (user)=>{
			setUser(user)
		})
	}

	const calculatePrice =(e)=>{
		let newPrice = e.target.value * 300;
		setPrice(newPrice);
	}

	const updateImpressions =(e)=>{
		setImpressions(e.target.value);
		calculatePrice(e);
	}

	const addImpressions = async ()=>{
		// add purchased impressions to users account

		setProgressDisplay(true);
		const userRef = doc(db, "users", user.uid);
		await updateDoc(userRef, {
			availableImpressions: increment(impressions)
		}).then(()=>{
			history.push('/advertiser/dashboard/Home');
		}).catch((error)=>{
				setAlertMessage(error.message);
				setDisplayAlert(true);
				setAlertSeverity('warning');
				setProgressDisplay(true);
		});
	}

	const pay =(e)=>{

		e.preventDefault();
		if (impressions >= 10){
			handleFlutterPayment({
				callback: (response) => {
					console.log(response);
				   setAlertMessage('successful');
				   setDisplayAlert(true);
				   setAlertSeverity('success');
				   addImpressions();
					closePaymentModal() // this will close the modal programmatically
				},
				onClose: () => {},
			});
		} else{
			setAlertMessage('you cannot purhase less than 10 impressions');
			setDisplayAlert(true);
			setAlertSeverity('warning');
		}

	}

	return (
		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<SpinnerDiv show={progressDisplay} />
			<NewAlert displayAlert={displayAlert} message={alertMessage} severity={alertSeverity} setDisplayAlert={setDisplayAlert} />
			
			<div className='proceed_subcontainer'  style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				
				<p style={{fontSize:'2em', color:'var(--blueprimary)', fontWeight:'bold', textAlign:'center'}}>Buy impressions</p>
				
				<div className='proceed_form_container' style={{padding:'1em'}}>
				
					<p style={{ fontWeight:'500', textAlign:'center'}}>Set number of impressions</p>

					<div>

						<input style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}}
						type='number' placeholder='number of desired impressions: min 10' value={impressions} onChange={updateImpressions}/>
						
						<div style={{textAlign:'center'}}>
						<button type='submit' style={{width:'10em', marginTop:'1em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}} onClick={pay} >Pay <span style={{fontWeight:900}}>{`N${price}`}</span></button>
						</div>
					</div>

				</div>
			
			</div>
		
		</div>
	)
}

export default Proceed
