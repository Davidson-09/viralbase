import React, {useState, useEffect} from 'react'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import './promoHeader.css'

function PromoHeader() {

	  return (
		  <div>
			  <div className='sub_container' style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
					<p className='logo' style={{color:'var(--blueprimary)', fontWeight:800, textAlign:'center', fontSize:'2em', flex:'1'}}>Viralbase</p>
					<ul className='list' style={{display:'none'}}>
						<li>Home</li>
						<li>Activity</li>
						<li>Account</li>
					</ul>
				</div>
				<div className='search_container'
					style={{display:'flex', backgroundColor:'#D2E0F2', padding:'1em', height:'2em', borderRadius:'2em',
				}}>
					<input type='text'style={{flex:'1', backgroundColor:'#D2E0F2', border:'none'}} placeholder='search for ads...'/>
					<SearchRoundedIcon style={{color:'var(--blueprimary)', height:'1.5em', width:'1.5em'}}/>
				</div>
		  </div>
	  );
}

export default PromoHeader
