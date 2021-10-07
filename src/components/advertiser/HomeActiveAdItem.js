import { Avatar } from '@material-ui/core'
import React from 'react'
import './homeActiveAdItem.css'

function HomeActiveAdItem({name, impressions}) {

	//const letter = name.slice(0,1);

	return (
		<div className='homeActiveAdItem_container'>
			<Avatar className='homeActiveAdItem_tag' style={{backgroundColor: '#00B2FF'}}>s</Avatar>
			<div className='homeActiveAdItem_info'>
				<p className='homeActiveAdItem_name'>shoe ad</p>
				<p className='homeActiveAdItem_date'>20 october 2021</p>
			</div>
			<p className='homeActiveAdItem_impressions'>250</p>
		</div>
	)
}

export default HomeActiveAdItem
