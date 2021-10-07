import React from 'react'
import './adcreation.css'

function AdCreation() {
	return (
		<div className="adcreation_container" style={{backgroundColor:'var(--blueprimary)', display: 'flex', justifyContent:'center',
		 alignItems: 'center', margin:'-1em', width:'100%', minHeight:'100%', position:'absolute'}}>
			
			<div className="adcreation_subcontainer" style={{backgroundColor:'white', width:'85%', height:'auto',
			display:'flex', flexDirection:'column', alignItems: 'center', marginTop:'1em', marginBottom:'1em'}}  >
				
				<p style={{fontSize:'2em', fontWeight:'bold', color:'var(--blueprimary)'}}>Create new ad</p>
				
				<form className='adcreation_form' style={{width:'100%'}}>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
				
						<p style={{marginLeft:'1em'}}>Name the ad</p>
				
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'5%', fontFamily:'Poppins, sans-serif'}}
						placeholder='e.g new fashion line' required/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
					
						<p style={{marginLeft:'1em'}}>Description</p>
						
						<textarea type="text" style={{border:'none', width:'77%', height:'10em', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'5%'}}
						placeholder='describe the product or service you wish to promote'/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
						
						<p style={{marginLeft:'1em'}}>Tag line <span style={{color:'#F6F6F6'}}>(optional)</span></p>
					
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'5%'}}
						placeholder='e.g just do it'/>
					
					</div>
					
					<div style={{width:'100%', paddingLeft:'1em', paddingRight:'1em'}}>
					
						<p style={{marginLeft:'1em'}}>Ad link</p>
					
						<input type="text" style={{border:'none', width:'77%', backgroundColor:'#F6F6F6', padding:'1em',
						marginLeft:'1em', marginTop:'-.5em',borderRadius:'5%'}}
						placeholder='add a link that will be shared by promoters' required/> 
				
					</div>
					
					<button type='submit' style={{marginLeft:'6em', width:'50%', marginTop:'2em', height:'3em',
					 backgroundColor:'var(--blueprimary)', color:'white', fontWeight:'500',
					 marginBottom:'2em', justifySelf:'center', border:'none', borderRadius:'.3em'}}>Continue</button>
				
				</form>
			
			</div>
		
		</div>
	)
}

export default AdCreation
