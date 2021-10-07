import React from 'react'
import { Avatar,} from '@material-ui/core';
import './addetail.css';

function AdDetails() {

	function AdImage(){
		return (
			<div style={{height: '5em', minWidth: '10em', marginLeft:'.5em', marginRight:'.5em'}}>
				<img style={{backgroundColor: '#E1F6FF', width:'100%', height:'100%' }} />
			</div>
		)
	}

	return (
		<div>
			<div className="aditem_subcontainer" style={{marginTop: '.5em'}}>
				<p style={{marginRight: '1em', fontSize: '1.1em', marginTop: '-.001em'}}>Shoe</p>
				<Avatar style={{height: '1em', width: '1em', fontSize: '.5em', padding: '1em', marginTop: '.3em', backgroundColor:'#E7E7E7'}}>Ad</Avatar>
			</div>
			<div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
				<img className= 'addetail_img' style={{height: '10em', width: '20em', backgroundColor: '#E1F6FF', justifySelf: 'center', borderRadius: '5%', border:'none'}} />
				
			</div>

			<div className='adDetails_scrollmenu' style={{marginTop: '1em', justifySelf:'center'}}>
					<AdImage/>
					<AdImage/>
					<AdImage/>

			    </div>
			<p style={{fontWeight:500}}>Link</p>
			<div style={{width:'15em', backgroundColor:'#F8F8F8', overflow:'auto', paddingLeft:'1em', paddingRight:'1em'}}><p>www.websitepromo.com</p></div>
		</div>
	)
	
}



export default AdDetails
