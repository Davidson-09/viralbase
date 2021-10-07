import React from 'react'
import './proceed.css'

function Proceed() {
	return (
		<div className="proceed_container" style={{backgroundColor:'var(--blueprimary)', display: 'flex', justifyContent:'center',
		alignItems: 'center', margin:'-1em', width:'100%', height:'100%', position:'absolute'}}>
			
			<div className="proceed_subcontainer"style={{backgroundColor:'white', width:'85%', height:'25em',
			display:'flex', flexDirection:'column', alignItems: 'center', marginTop:'1em', marginBottom:'1em'}}>
				
				<p style={{fontSize:'2em', color:'var(--blueprimary)', fontWeight:'bold'}}>Almost there...</p>
				
				<div className='proceed_form_container' style={{ display: 'flex', flexDirection:'column',
				 justifyContent: 'center', alignItems: 'center'}}>
				
					<p style={{fontSize:'1.5em', fontWeight:'500'}}>Impressions target</p>

					<form>

						<input className="proceed_input" style={{border:'none', backgroundColor:'#F6F6F6', padding:'1em',borderRadius:'5%',
						 width:'80%',textAlign:'center', marginLeft:'1em'}}
						type='number' placeholder='number of desired impressions: min 10'/>
						
						<button className='proceed_btn' type='submit' style={{marginLeft:'6em', width:'50%', marginTop:'2em', height:'3em',
						backgroundColor:'var(--blueprimary)', color:'white', fontWeight:'500',
						marginBottom:'2em', justifySelf:'center', border:'none', borderRadius:'.3em'}}>pay N10,000,000,000</button>
					
					</form>

				</div>
			
			</div>
		
		</div>
	)
}

export default Proceed
