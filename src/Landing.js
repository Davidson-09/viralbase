import React from 'react'
import Happy from './res/Happy'
import InviteCards from './res/InviteCards'
import Currency from './res/Currency'
import './landing.css'

function Landing() {
	return (
		<div className='landing_container' style={{}}>
			<div className='landing_header' style={{display:'flex', justifyContent:'space-between'}}>
				<p style={{color:'var(--blueprimary)', fontWeight:'bold', fontSize:'1.5em'}}>viralbase</p>
				<button style={{marginTop:'1.7em', marginRight:'1em', backgroundColor:'white',
					borderRadius:'.5em'}}>log in</button>
			</div>

			<div className='landing_hero' style={{justifyContent:'center', alignContent:'center', display:'flex', flexDirection:'column',
				marginBottom:'3em'}}>
				<div>
					<h1 className='landing_text' style={{textAlign:'center'}}>
						Make your products <br/>
						<span style={{color:'var(--blueprimary)'}}> top-of-mind</span>
					</h1>
					<p className='landing_text' style={{textAlign:'center', marginTop:'-.3em'}}>viralbase helps people and businesses <br/> gather attention for their<br/> goods and services</p>
					<button style={{padding:'1em', borderRadius:'.6em', backgroundColor:'var(--blueprimary)',
						border:'none', color:'white', fontWeight:'bold', marginLeft:'auto', marginRight:'auto',
						display:'static'}}>create free account</button>
				</div>
				<div className='landing_img' style={{marginLeft:'auto', marginRight:'auto'}}>
				<Happy/>
				</div>
			</div>
			
			<div className='landing_invitation' style={{display:'flex', flexDirection:'column', justifyContent:'center', alignContent:'center', paddingLeft:'3em', paddingRight:'3em',
				}}>
				
				<div style={{backgroundColor:'#E7EDF4', borderRadius:'1em', marginBottom:'2em', paddingLeft:'.5em',
					paddingRight:'.5em'}}>
					<h2 className='landing_text' style={{textAlign:'center'}}>Everybody is invited!</h2>
					<p className='landing_text' style={{textAlign:'center', maxWidth:'30em'}}>whether you are a musician on your way to fame, a writer with a unique story or an innovator on
						 a new mission viralbase will give you all the
						  attention you need</p>
				</div>
				
				<div className='landing_img' style={{marginLeft:'auto', marginRight:'auto', marginTop:'-1em'}}>
				<InviteCards/>
				</div>
				<button className='landing_coa' style={{padding:'1em', borderRadius:'.6em', backgroundColor:'var(--blueprimary)',
					border:'none', color:'white', fontWeight:'bold', marginLeft:'auto', marginRight:'auto',
					display:'static', marginTop:'.5em', marginBottom:'1em'}}>get started</button>
			</div>
			<div style={{display:'flex', flexDirection:'column', alignContent:'center'}}>
				<div style={{padding:'.5em', margin:'2.5em', backgroundColor:'#FDF3F6', borderRadius:'1em'}}>
					<h2 style={{textAlign:'center'}}>let others do the promoting for you</h2>
					<p style={{textAlign:'center'}}>viralbase provides you with an army of promoters ready to help you acheive the exposure you require</p>
					
				</div>
				
			</div>

			<div style={{display:'flex', flexDirection:'column', alignContent:'center'}}>
				<div style={{marginLeft:'auto', marginRight:'auto'}}>
					<Currency/>
				</div>
				<div style={{padding:'.5em', margin:'2.5em', backgroundColor:'#E1F6FF', borderRadius:'1em'}}>
					<h2 style={{textAlign:'center'}}>Impression is the currency</h2>
					<p style={{textAlign:'center'}}>buy as many impressions as you like and let the promoters hustle for them</p>
				</div>
			</div>
		</div>
	)
}

export default Landing
