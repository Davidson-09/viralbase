import React from 'react'
import Happy from './res/Happy'
import InviteCards from './res/InviteCards'
import InviteCards2 from './res/InviteCards2'
import Currency from './res/Currency'
import People from './res/People'
import promoters from './res/promoters.svg'
import './landing.css'

import { useHistory} from 'react-router-dom';

function Landing() {

	const history = useHistory();

	const toLogin =()=>{
		history.push('/login')
	}
	
	const toSelectPageSignUp =()=>{
		history.push('/select')
	}

	const toAdSignUp =()=>{
		// go to advertiser sign up page
		history.push('/signup/advertiser')
	}

	const toPromoSignUp =()=>{
		history.push('/signup/promoter')
	}

	return (
		<div className='landing_container' style={{}}>
			<div className='landing_header' style={{display:'flex', justifyContent:'space-between', paddingLeft:'2em',
				paddingRight:'2em'}}>
				<p style={{color:'var(--blueprimary)', fontWeight:'bold', fontSize:'1.5em', flex:'1'}}>viralbase</p>
				<button style={{marginTop:'1.7em', marginRight:'1em', backgroundColor:'white',
					borderRadius:'.5em', width:'10em', height:'3em'}} onClick={toLogin}>log in</button>
				<button className='landing_signin_btn' style={{marginTop:'1.7em', marginRight:'1em', backgroundColor:'var(--blueprimary)',
					borderRadius:'.5em', width:'10em', height:'3em', border:'none',
					color:'white', fontWeight:'bold', display:'none'}} onClick={toSelectPageSignUp}>Sign up</button>
			</div>

			<div className='landing_hero' style={{justifyContent:'center', alignContent:'center', display:'flex', flexDirection:'column',
				marginBottom:'3em'}}>
				<div>
					<h1 className='landing_text' style={{textAlign:'center'}}>
						Get attention for <br/>
						<span style={{color:'var(--blueprimary)'}}> your hustle</span>
					</h1>
					<p className='landing_text' style={{textAlign:'center', marginTop:'-.3em'}}>viralbase helps people and businesses <br/> gather attention for their<br/> goods and services</p>
					<div className='landing_cta_btn' style={{marginLeft:'auto', marginRight:'auto', textAlign:'center'}}>
					<button onClick={toAdSignUp} style={{padding:'1em', borderRadius:'.6em', backgroundColor:'var(--blueprimary)',
					 border:'none', color:'white', fontWeight:'bold', fontSize:'1em'}}>create free advertiser account</button>
						</div>
				</div>
				<div className='landing_hero_img' style={{marginLeft:'auto', marginRight:'auto'}}>
				<Happy/>
				</div>
			</div>

			<div className='landing_promoter_hero'>
				<div>
				<h1 className='landing_promoter_text' style={{textAlign:'center'}}>Promote products and <br/> <span style={{color:'var(--blueprimary)'}}>make easy money</span></h1>
				<p className='landing_promoter_text' style={{textAlign:'center', marginTop:'-.3em', padding:'.5em'}}>viralbase provides one of the easiest ways to make money online,<br/>
					you make money by sharing promotion links<br/> and getting people to interact with them</p>
					<div className='landing_promoter_btn' style={{marginLeft:'auto', marginRight:'auto', textAlign:'center'}}>
					<button onClick={toPromoSignUp} style={{padding:'1em', borderRadius:'.6em', backgroundColor:'var(--blueprimary)',
					 border:'none', color:'white', fontWeight:'bold', fontSize:'1em'}}>become a promoter</button>
					 </div>
				</div>
				
					 <div style={{display:'flex', justifyContent:'center'}}>
					 	<img src={promoters} style={{width:'20em', height:'10em', marginTop:"1em", marginBottom:'2em'}}/>
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
				
				<div className='landing_invitecards' style={{marginLeft:'auto', marginRight:'auto', marginTop:'-1em'}}>
				<InviteCards />
				</div>
				<div className='landing_invitecards2' style={{display:'none'}}>
				<InviteCards2  style={{display:'none'}}/>
				</div>
			</div>

			<div className='landing_usp_div' style={{display:'flex', flexDirection:'column', alignContent:'center'}}>
				<div className='landing_usp_text-div' style={{padding:'.5em', margin:'2.5em', backgroundColor:'#FDF3F6', borderRadius:'1em', maxWidth:'20em'}}>
					<h2 className='landing_text' style={{textAlign:'center'}}>let others do the promoting for you</h2>
					<p className='landing_text' style={{textAlign:'center'}}>viralbase provides you with an army of promoters ready to help you get the exposure you require</p>
					
				</div>
				<div className='landing_people_img' style={{display:'none'}}>
					<People/>
				</div>
			</div>

			<div className='landing_currency_div' style={{display:'flex', flexDirection:'column', alignContent:'center'}}>
				<div style={{marginLeft:'auto', marginRight:'auto'}}>
					<Currency/>
				</div>
				<div className='landing_currency_text_div' style={{padding:'.5em', margin:'2.5em', backgroundColor:'#E1F6FF', borderRadius:'1em'}}>
					<h2 style={{textAlign:'center'}}>Impression is the currency</h2>
					<p style={{textAlign:'center'}}>buy as many impressions as you like and let the promoters hustle for them</p>
				</div>
			</div>
		</div>
	)
}

export default Landing
