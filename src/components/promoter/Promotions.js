import React, {useEffect, useState} from 'react'

import SpinnerDiv from '../general/SpinnerDiv';

import {useHistory} from 'react-router-dom';

import './promoaccount.css'

function Promotions() {

	const [progressDisplay, setProgressDisplay] = useState('none');
	const accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
	const promotions = accountDetails.listOfPromotions
	

	function Promotion({promotion}){
		const history = useHistory();

		const toAdPage =()=>{
			localStorage.setItem('currentPromotion', JSON.stringify(promotion))
			history.push(`/promoter/promotionDetails`)
		}

		return(
			<div className='promoaccount_adcontainer' style={{padding:'1em', margin:'1em', backgroundColor:'#E1F6FF', borderRadius:'.5em'}}
				onClick={toAdPage}>
					<p style={{fontSize:'1.1em', margin:0, fontWeight:'600'}}>{promotion.adname}</p>
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
					<Promotion promotion={promo} key={promo.adId}/>
				))}
			</div>
		</div>
	)
}

export default Promotions
