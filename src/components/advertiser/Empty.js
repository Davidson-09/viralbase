import React, {useEffect, useState} from 'react'


import empty from '../../res/emptymedia.svg'
import empty2 from '../../res/empty2.svg'
import './adCard.css'

// this component is designed like the ad card but it indicates that the advertisers ad gallery is empty

function Empty(){

	const [pic, setPic] = useState(empty2)

	useEffect(()=>{
		if ((window.innerWidth>=720)&&(window.innerHeight>=1024)){
			setPic(empty);
		}

		if (window.innerWidth >window.innerHeight){
			setPic(empty);
		}

	}, [])

	return(
		<div style={{marginBottom:'1em'}}>
			<div className='ad_card_img1' style={{ marginLeft:'auto', marginRight:'auto' }}>
				<img className='ad_card_img1' alt='ad image' src={pic} style={{ borderRadius:'.5em'}}/>
			</div>
			<p className='adcard_text' style={{ textAlign:'center', fontSize:'.7em' }}>You have no ads</p>
		</div>
	)
}

export default Empty;