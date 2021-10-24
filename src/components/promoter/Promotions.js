import React, {useEffect, useState} from 'react'

import SpinnerDiv from '../general/SpinnerDiv';

import {auth, db} from '../../fire'
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from '@firebase/firestore';

import {useHistory} from 'react-router-dom';

import './promoaccount.css'

function Promotions() {

	const [progressDisplay, setProgressDisplay] = useState('none');
	const [promotions, setPromotions] = useState();

	useEffect(()=>{
		getUserData();
	}, [])

	const getUserData =()=>{
		setProgressDisplay('block');
		onAuthStateChanged(auth, async (user)=>{
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userDoc = docSnap.data();
				if (userDoc.promotions){
					setPromotions(userDoc.promotions);
				} else{
					setProgressDisplay('none')
				}
				
			}
		})
	}

	

	

	function Promotion({promoId}){

		const [promotion, setPromotion] = useState({id:'', data:{impressions:0}})
		const history = useHistory();

		useEffect(()=>{
			getPromotion(promoId)
		}, [])

		const getPromotion = async (promoId)=>{
			const docRef = doc(db, 'promotions', promoId);
			const docSnap = await getDoc(docRef);
	
			if (docSnap.exists()) {
				console.log('snap that dog')
				setPromotion({id:docSnap.id, data:docSnap.data()})
	
			}

			setProgressDisplay('none')
	
		}

		const toAdPage =()=>{
			history.push(`/promoter/promotionDetails/${promotion.id}`)
		}

		return(
			<div className='promoaccount_adcontainer' style={{padding:'1em', margin:'1em', backgroundColor:'#E1F6FF', borderRadius:'.5em'}}
				onClick={toAdPage}>
					<p style={{fontSize:'1.1em', margin:0, fontWeight:'600'}}>{promotion.data.name}</p>
					<p style={{margin:0}}>{`${promotion.data.impressions} Impressions`}</p>
			</div>
		)
	}

	return (
		<div>
			<SpinnerDiv show={progressDisplay} />
			<p style={{fontSize:'1.5em', textAlign:'center', fontWeight:'bold'}}>My  Promotions</p>
			<div>
				{!promotions && <p style={{textAlign:'center'}}>You have not promoted any ads</p>}
				{promotions && promotions.map(promo =>(
					<Promotion promoId={promo} key={promo}/>
				))}
			</div>
		</div>
	)
}

export default Promotions
