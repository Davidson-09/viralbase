import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@mui/material'

import { db} from '../../fire'
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import axios from 'axios'

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
		console.log('started')
		if (promoSnap.exists()) {
			console.log('promosnap!')
			// get the related advertiser
			console.log(promoSnap.data())
			const adRef = doc(db, 'users',promoSnap.data().advertiser);
			const adSnap = await getDoc(adRef);
			if (adSnap.exists()){
				console.log('gotten related ad')
				// get the device ip address
				const res = await axios.get('https://geolocation-db.com/json/');
				const ip = res.data.IPv4;
				let ispresent = false;
				// check if the device ip address already exists in the promotion's array of addresses
				if (promoSnap.data().addresses){
					console.log('checking ip...')
					promoSnap.data().addresses.forEach((address)=>{
						if (address === ip){
							ispresent = true;
							console.log('found a match')
						}
					})
				}
				
				if ( ispresent){
					console.log('moving straight on to promotional link')
					window.location.replace(`https://${promoSnap.data().link}`);
				} else {
					// check if the adertiser has enough impressions
					if (adSnap.data().availableImpressions > 0){
						// increment the impressions of the promotion by 1
						console.log('updating promotion')
						const ref = doc(db, "promotions", match.params.promo);
						await updateDoc(ref, {
							impressions: increment(1),
							addresses: arrayUnion(ip)
							// the rest will be handled by cloud functions
							// update the nummber of impressions for the promoter
						}).then( async ()=>{
							const ref = doc(db, "users", promoSnap.data().promoter);
							await updateDoc(ref, {
								impressions: increment(1), 
								earnings: increment(50)
								// update the nummber of impressions for the ad
							}).then( async ()=>{
								const ref = doc(db, "ads", promoSnap.data().ad);
								await updateDoc(ref, {
									impressions: increment(1)
									// update the nummber of impressions for the advertiser
								}).then( async ()=>{
									const ref = doc(db, "users", promoSnap.data().advertiser);
									await updateDoc(ref, {
										impressions: increment(1)
										// update the nummber of impressions for the advertiser
									}).then(()=>{
										console.log('redirecting to promo link')
										// redirect to the promotions adlink
										console.log('moving straight on to promotional link')
									window.location.replace(`https://${promoSnap.data().link}`);	
									})
								})
							})

							
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
				
			} else {
				console.log('redirecting to 404 page')
			}
		} else {
			console.log('promo does not exist')
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
