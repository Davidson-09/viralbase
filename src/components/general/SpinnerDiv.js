import { CircularProgress } from '@mui/material'
import React from 'react'
import { Spinner } from 'react-bootstrap'

function SpinnerDiv({show}) {
	return (
		<div style={{ display:show, height:'100vh', width:'100%', paddingTop:'40vh', position:'fixed', opacity:'0.5', backgroundColor:'#B4B4B4'}}>
			<div style={{width:'10em', height:'10em', margin:'auto', backgroundColor:'white', borderRadius:'1em' }}>
				<CircularProgress style={{marginTop:'3.5em', marginLeft:'3.5em', color:'var(--blueprimary)'}}/>
			</div>
		</div>
	)
}

export default SpinnerDiv
