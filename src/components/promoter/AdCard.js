import React from 'react'

import shoes from '../../res/shoes.jpg'
import './adCard.css'

function AdCard(){
	return(
		<div>
			<div className='ad_card_img' style={{width:'10em', height:'10em', }}>
				<img className='ad_card_img' alt='ad image' src={shoes} style={{width:'10em', height:'10em', borderRadius:'1em'}}/>
			</div>
			<p style={{color:'var(--blueprimary)', fontSize:'1.5em'}}>Shoe ad</p>
			<p style={{marginTop:'-1.5em'}}>adidas</p>
		</div>
	)
}

export default AdCard;