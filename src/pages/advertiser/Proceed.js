import React, {useState, useEffect} from 'react'
import SpinnerDiv from '../../components/general/SpinnerDiv'
import NewAlert from '../../components/general/NewAlert';

import { usePaystackPayment } from 'react-paystack';
import * as AWS from 'aws-sdk';

import { useHistory } from 'react-router-dom';

import './proceed.css'

// NOTE: this component is supposed to be named ImpressionPurchase
// it has its current name because the idea for this site went
// through a lot of changes in my mind but due to the feeling
// of urgency during development I couldn't care less about 
// making the necessary changes

function Proceed() {

	const history = useHistory();
	const docClient = new AWS.DynamoDB.DocumentClient()

	const [impressions, setImpressions] = useState(0);
	const [price, setPrice] = useState(0);
	const [user, setUser] = useState('')

	const[progressDisplay, setProgressDisplay] = useState('none')
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState('');
	const [displayAlert, setDisplayAlert] = useState(false);

	const userAttributes = JSON.parse(localStorage.getItem('userAttributes'));
	const userCredentials = JSON.parse(localStorage.getItem('userCredentials'));

	useEffect(()=>{
	}, [])

	const calculatePrice =(e)=>{
		let newPrice = e.target.value * 100;
		setPrice(newPrice);
	}

	const updateImpressions =(e)=>{
		setImpressions(e.target.value);
		calculatePrice(e);
	}

	const addImpressions = async ()=>{
		// add purchased impressions to users account

		setProgressDisplay(true);

		let newimpressions = 0;
		var params = {
			TableName: 'advertisers',
			Key:{
				"uid": userAttributes[0].Value
			},
			UpdateExpression: "set availableImpressions = availableImpressions + :val",
			ExpressionAttributeValues:{
				":val": parseInt(impressions)
			},
			ReturnValues:"UPDATED_NEW"
		};
		docClient.update(params, function(err, data) {
			if (err) {
				setAlertMessage(err.message);
				setDisplayAlert(true);
				setAlertSeverity('warning');
				setProgressDisplay(true);
			} else{
				history.push('/advertiser/dashboard/Home');
			}
		});
	}


	//---------------------------------------------------------------------------------
	//paystack implementation
	const config = {
		reference: (new Date()).getTime().toString(),
		amount: price*100,
		publicKey: 'pk_live_b18f3f98c9492f2211ee0991cb6f13c51d54b5df',
		email: userCredentials.email,
	};

	const onSuccess = (reference) => {
		// Implementation for whatever you want to do with reference and after success call.
		addImpressions();
		console.log(reference);
	  };
	  
	const onClose = () => {
	// implementation for  whatever you want to do when the Paystack dialog closed.
	console.log('closed')
	}

	const initializePayment = usePaystackPayment(config);

	const pay =(e)=>{
		e.preventDefault();
		if (impressions >= 30){
			initializePayment(onSuccess, onClose)
		} else{
			setAlertMessage('you cannot purhase less than 30 impressions');
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
							padding:'1em', fontSize:'1em', textAlign:'center'}}
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
