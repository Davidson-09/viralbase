import React from 'react'
import AdCard from './AdCard'

import './listOfAds.css'

function ListOfAds() {
	return (
		<div>
			<h4 className='title'>Available ads</h4>
			<div className='list_of_ads' style={{display:'grid', gridTemplateColumns:'auto auto', marginLeft:'1em'}}>
				<AdCard/>
				<AdCard/>
				<AdCard/>
				<AdCard/>
				<AdCard/>
				<AdCard/>
			</div>
		</div>
	)
}

export default ListOfAds
