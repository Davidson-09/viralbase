import React, {useState, useEffect} from 'react'
import './proceed.css'

// NOTE: this component is supposed to be named ImpressionPurchase
// it has its current name because the idea for this site went
// through a lot of changes in my mind but due to the feeling
// of urgency during development I couldn't care less about 
// making the necessary changes

function Proceed() {

	const [impressions, setImpressions] = useState(0);
	const [price, setPrice] = useState(0);

	const calculatePrice =(e)=>{
		let newPrice = e.target.value * 300;
		setPrice(newPrice);
	}

	const updateImpressions =(e)=>{
		setImpressions(e.target.value);
		calculatePrice(e);
	}

	return (
		<div className="proceed_container" style={{backgroundColor:'var(--blueprimary)', display: 'flex', justifyContent:'center',
		alignItems: 'center', margin:'-1em', width:'100%', height:'100vh', position:'absolute'}}>
			
			<div className="proceed_subcontainer"style={{backgroundColor:'white', width:'85%', height:'25em',
			display:'flex', flexDirection:'column', alignItems: 'center', marginTop:'1em', marginBottom:'1em', borderRadius:'1em'}}>
				
				<p style={{fontSize:'2em', color:'var(--blueprimary)', fontWeight:'bold'}}>Buy impressions</p>
				
				<div className='proceed_form_container' style={{ display: 'flex', flexDirection:'column',
				 justifyContent: 'center', alignItems: 'center'}}>
				
					<p style={{ fontWeight:'500'}}>Set number of impressions</p>

					<form>

						<input className="proceed_input" style={{border:'none', backgroundColor:'#F6F6F6', padding:'1em',borderRadius:'.5em',
						 width:'80%',textAlign:'center', marginLeft:'1em', fontSize:'1em'}}
						type='number' placeholder='number of desired impressions: min 10' value={impressions} onChange={updateImpressions}/>
						
						<button className='proceed_btn' type='submit' style={{marginLeft:'6em', width:'50%', marginTop:'2em', height:'3em',
						backgroundColor:'var(--blueprimary)', color:'white', fontWeight:'500', fontSize:'1em',
						marginBottom:'2em', justifySelf:'center', border:'none', borderRadius:'.3em'}}>pay <span style={{fontWeight:900}}>{`N${price}`}</span></button>
					
					</form>

				</div>
			
			</div>
		
		</div>
	)
}

export default Proceed
