import React from 'react'
import promoters from './res/promoters.svg'
import './landing.css'
import logo from './logo.svg'
import happy from './res/happy.svg'
import listening from './res/peoplelistening.svg'

import { useHistory} from 'react-router-dom';

function Landing2() {

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
				<div style={{display:'flex', flex:'1', marginTop:'1.5em'}}>
					<img src={logo} alt='logo' style={{width:'2em', height:'3em'}}/>
					<p style={{color:'var(--blueprimary)', margin:0, fontWeight:'bold', fontSize:'1.5em', marginLeft:'.5em' }}>viralbase</p>
				</div>
				<button style={{marginTop:'.7em', marginRight:'1em', backgroundColor:'white',
					borderRadius:'.5em', border:"none", fontSize:'1.1em',
					fontWeight:'bold'}} onClick={toLogin}>log in</button>
				<button className='landing_signin_btn' style={{marginTop:'1.7em', marginRight:'1em', backgroundColor:'var(--blueprimary)',
					borderRadius:'.5em', width:'10em', height:'3em', border:'none',
					color:'white', fontWeight:'bold', display:'none'}} onClick={toSelectPageSignUp}>Sign up</button>
			</div>

			<div className='landing_hero' style={{justifyContent:'center', alignContent:'center', display:'flex', flexDirection:'column',
				marginBottom:'3em'}}>
				<div>
					<h1 className='landing_text' style={{textAlign:'center'}}>
						Promote your music <br/>
						<span style={{color:'var(--blueprimary)'}}> without breaking the bank</span>
					</h1>
					<p className='landing_text' style={{textAlign:'center', marginTop:'-.3em'}}>viralbase helps artists <br/> promote their music<br/> and make them go viral.</p>
					<div className='landing_cta_btn' style={{marginLeft:'auto', marginRight:'auto', textAlign:'center'}}>
					<button onClick={toAdSignUp} style={{padding:'1em', borderRadius:'.6em', backgroundColor:'var(--blueprimary)',
					 border:'none', color:'white', fontWeight:'bold', fontSize:'1em'}}>create free advertiser account</button>
						</div>
				</div>
				<div className='landing_hero_img' style={{marginLeft:'auto', marginRight:'auto'}}>
				<div style={{display:'flex', justifyContent:'center'}}>
					 	<img src={listening} style={{width:'20em', height:'10em', marginTop:"1em", marginBottom:'2em'}}/>
					 </div>
				</div>
			</div>

			<div className='landing_promoter_hero'>
				<div>
				<h1 className='landing_promoter_text' style={{textAlign:'center'}}>Promote music and <br/> <span style={{color:'var(--blueprimary)'}}>make easy money</span></h1>
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
		</div>
	)
}

export default Landing2
