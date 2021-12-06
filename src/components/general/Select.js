import React, {useEffect} from 'react'
import { useHistory} from 'react-router-dom';

function Select() {

	const history = useHistory('')

	const adAction =()=>{
		// advertiser action
		// go to advertiser sign up page
		history.push('/signup/advertiser')
	}

	const proAction =()=>{
		//promoter action
		// go to promoter sign up page
		history.push('/signup/promoter')
	}

	return (
		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', padding:'2em'}}>
				<p style={{textAlign:'center'}}>Who are you?</p>
				<div style={{textAlign:'center', margin:'1em'}}>
					<button onClick={adAction} style={{fontSize:'1em', minWidth:'10em', padding:'1em', fontWeight:'bold',
						 backgroundColor:'var(--blueprimary)', border:'none', color:'white', borderRadius:'.5em'}}>An Influencer</button>
				</div>
				<div style={{textAlign:'center'}}>
					<button onClick={proAction} style={{fontSize:'1em', minWidth:'10em', padding:'1em', fontWeight:'bold',
						 backgroundColor:'var(--blueprimary)', border:'none', color:'white', borderRadius:'.5em'}}>A Promoter</button>
				</div>
				
			</div>
		</div>
	)
}

export default Select
