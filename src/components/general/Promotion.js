import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'

import { db} from '../../fire'
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

function Promotion({match}) {

	useEffect(()=>{
		execute();
	},[])
	// get the related promotion
	// add fifty naira to the promoters account
	// add the gotten impression to the promoter, the promotion, the ad and the owner of the ad
	// subtract the impression from the owner of the ad
	// redirect to wherever the ad link goes.

	const execute = async ()=>{
		//get the related promotion
		const promoRef = doc(db, 'promotions', match.params.promo);
		const promoSnap = await getDoc(promoRef);

		if (promoSnap.exists()) {
			// get the related advertiser
			console.log(promoSnap.data())
			const adRef = doc(db, 'users',promoSnap.data().advertiser);
			const adSnap = await getDoc(adRef);
			if (adSnap.exists()){
				// check if the adertiser has enough impressions
				if (adSnap.data().availableImpressions > 0){
					// increment the impressions of the promotion by 1
					const ref = doc(db, "promotions", match.params.promo);
					await updateDoc(ref, {
						impressions: increment(1)
						// the rest will be handled by cloud functions
					}).then(()=>{
						// redirect to the promotions adlink
						const link = promoSnap.data().link;
						//window.location.host = link;
						window.location.host = 'about.google/contact-google/'
					})
				} else {
					// deactivate the ad
					const ref = doc(db, "ads", promoSnap.data().ad);
					await updateDoc(ref, {
						active: false
					}).then(()=>{
						//redirect to 404 page
						console.log('404')
					})
				}
			}
		}
	}

	return (
		<div style={{ height:'100vh', width:'100%', paddingTop:'40vh', position:'fixed', opacity:'0.5'}}>
			<div style={{width:'10em', height:'10em', margin:'auto', backgroundColor:'white', borderRadius:'1em', backgroundColor:'#B4B4B4' }}>
				<p style={{textAlign:'center', color:'var(--blueprimary)', margin:0}}>viralbase</p>
				<CircularProgress style={{marginTop:'3.5em', marginLeft:'3.5em', color:'var(--blueprimary)'}}/>
			</div>
		</div>
	)
}

export default Promotion
