import React from 'react'

import shoes from '../../res/shoes.jpg'
import './adCard.css'

function AdCard(){
	return(
		<div style={{marginBottom:'1em'}}>
			<div className='ad_card_img1' style={{width:'10em', height:'10em' }}>
				<img className='ad_card_img1' alt='ad image' src={shoes} style={{width:'10em', height:'10em', borderRadius:'.5em'}}/>
			</div>
			<p className='adcard_text' style={{ }}>100 <br/>impressions</p>
		</div>
	)
}

export default AdCard;