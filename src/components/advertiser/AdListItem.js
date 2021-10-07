import React from 'react'
import './adListItem.css'

function AdListItem() {
	return (
		<div>
		  <div className='adlistitem_container'>
			<p className='adlistitem_name'>Shoe ad</p>
			<p className='adlistitem_2' style={{display:'none'}}>5, Oct 2021</p>
			<p className='adlistitem_2' style={{display:'none'}}>2,000</p>
			<p className='adlistitem_2' style={{display:'none'}}>20,000</p>
			<p className='adlistitem_impressions'>1,000</p>
		  </div>
		  <div className='adlistitem_bottomLine'></div>
		</div>
		
	)
}

export default AdListItem
