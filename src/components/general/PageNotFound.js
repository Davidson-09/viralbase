import React from 'react'
import pagenotfound from '../../res/pagenotfound.svg'
import {useHistory} from 'react-router-dom';

function PageNotFound() {

	const history = useHistory();

	const toHome =()=>{
		history.push('/');
	}

	return (
		<div>
			<div style={{display:'flex', justifyContent:"center", marginTop:'30vh'}}>
				<img src={pagenotfound} alt='404' style={{with:'20em', height:'10em'}}/>
			</div>
			
			<p style={{textAlign:'center'}}><span style={{color:'var(--blueprimary)'}}>Hmmm...</span>
				<br/>we can't find this page
			</p>
			<div style={{textAlign:'center'}}>
				<button style={{backgroundColor:'var(--blueprimary)', color:'white',
					border:'none', width:'20em', height:'4em', borderRadius:'.5em',}}
					onClick={toHome}>GO TO HOMEPAGE</button>
			</div>
			
		</div>
	)
}

export default PageNotFound
