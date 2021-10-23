import { Alert } from '@mui/material'
import React, { useState } from 'react'

function NewAlert({message, severity, displayAlert, setDisplayAlert}) {

	if (displayAlert){
		return(
			<div style={{marginTop:'90vh', position:'fixed', zIndex:1}} >
				<Alert onClose={() => {setDisplayAlert(false)}} severity={severity}>{message}</Alert>
			</div>
		)
	} else{
		return(
			<div></div>
		)
	}
}

export default NewAlert
