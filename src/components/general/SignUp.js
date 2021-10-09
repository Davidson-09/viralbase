import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';

import './signup.css'

function SignUp({match}){

	const [title, setTitle] = useState('Full Name') // the title of the name input

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState(''); //phone number
	const [password, setPassword] = useState('');

	useEffect(()=>{
		console.log(match)
		if (match.params.role == 'advertiser'){
			setTitle('Business name');
		}
	})

	const register =(e)=>{
		// if role is advertiser
		// register as advertiser
		// if role is promoter 
		// register as promoter
		e.preventDefault();
		if (match.params.role == 'advertiser'){
			console.log('you are a new advertiser')
		}
	}

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
						<p style={{marginBottom:'-.07em'}}>{title}</p>
						<input required type='text' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={name} onChange={(e)=>{setName(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Email</p>
						<input required type='email' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Phone Number</p>
						<input required type='phone number' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={phone} onChange={(e)=>{setPhone(e.target.value)}} />
					</div>
					<div style={{}}>
						<p style={{marginBottom:'-.07em'}}>Password</p>
						<input required type='password' style={{width:'90%', backgroundColor:'#F6F6F6', border:'none',
							padding:'1em', fontSize:'1em'}} value={password} onChange={(e)=>{setPassword(e.target.value)}} />
					</div>
					<button style={{width:'100%', marginTop:'1em', padding:'.5em',
						fontSize:'1em', border:'none', backgroundColor:'var(--blueprimary)',
						color:'white', fontWeight:'bold', height:'3em', borderRadius:'.5em'}}>Create account</button>
				</form>
				<p style={{textAlign:'center', fontSize:'.7em'}}>Already have an account? <Link to='/login'>Log in</Link></p>
			</div>
		</div>

	)
}

export default SignUp;