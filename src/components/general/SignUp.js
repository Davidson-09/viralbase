import React from 'react'

import './signup.css'

function SignUp(){
	return(

		<div style={{backgroundColor:'var(--blueprimary)', minHeight:'100vh', margin:'-1em', padding:'2em'}}>
			<div><p style={{textAlign:'center', color:'white', fontWeight:'bold', fontSize:'1.5em',
					}}>viralbase</p></div>
			<div className='signup_form-div' style={{backgroundColor:'white', borderRadius:'1em', paddingTop:'2em'}}>
				<div style={{textAlign:'center', }}>
					<h3>Create a free account</h3>
					<p>welcome to the future of marketing</p>
				</div>
				<form style={{padding:'1em'}}>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Full Name</p>
						<input type='text' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Email</p>
						<input type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Phone Number</p>
						<input type='phone number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Password</p>
						<input type='password' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} />
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Create account</button>
				</form>
			</div>
		</div>

	)
}

export default SignUp;