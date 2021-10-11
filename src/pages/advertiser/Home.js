import React from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox';
import AdCard from '../../components/advertiser/AdCard'
import { Button } from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import './adhome.css'


function Home() {

	return (
		<div className='ad_home_container'>
		<div style={{flex:1}}>
			<p className='home_business_name' style={{fontWeight:'700'}}>Laju inc.</p>
			<div className='home_info_div' style={{ justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column',
				 marginLeft:'auto', marginRight:'auto'}}>
				<p style={{fontWeight:'500', color:'var(--blueprimary)', marginBottom:'-1.5em'}}>Available impressions</p>
				<div style={{display:'flex'}}>
					<p style={{fontSize:'2em', fontWeight:'bold'}}>0</p>
					<AddBoxIcon className='home_add_btn' style={{color:'var(--blueprimary)', marginTop:'1.9em'}}/>
				</div>
				<button className='home_big_add_btn' style={{fontSize:'1em', backgroundColor:'var(--blueprimary)',
					border:'none', paddingTop:'.7em', paddingBottom:'.7em', borderRadius:'.5em',
					color:'white', width:'10em', marginTop:'-2em', display:'none'}}>Buy impressions</button>
			</div>
			<div>
					<div className='ad_home_stat_container'>
						<div className="ad_home_impressions_div">
							<p className='ad_home_impressions_count'>0</p>
							<p className='ad_home_impressions_text'>total impressions</p>
						</div> 
						<div className='ad_home_activeads_div'>
							<p className='ad_home_activeads_count'>0</p>
							<p className='ad_home_activeads_text'>active ads</p>
						</div>
					</div>
				</div>

				<div style={{display:'flex', justifyContent:'space-between', marginTop:'1em', paddingLeft:'1em',
					paddingRight:'1em'}}>
					<p>Your ads</p>
					<AddBoxIcon className='home_add_btn' style={{color:'var(--blueprimary)', marginTop:'.7em'}}/>
					<Button className='home_createbutton' variant="contained" startIcon={<AddRoundedIcon />} style={{height:'1em', padding:'1.4em',
					 dropShadow:'none', marginTop:'1.2em', marginLeft:'1.2em', 
					 maxWidth:'12em', textTransform: 'lowercase', flex: 1, display:'none',
					  fontWeight:'700', backgroundColor: 'var(--blueprimary)', color: 'white', marginBottom:'1em'}}>
						create new ad
					</Button> 
				</div>
				<div className='home_ad_list' style={{display:'grid', gridTemplateColumns:'auto auto', marginLeft:'1em', overflow:'auto',
					maxHeight:'25em'}}>
					<AdCard/>
				</div>
		</div>
		<div >
			<div style={{display:'none'}} className='ad_home_stat_container2'>
				<div className="ad_home_impressions_div">
					<p className='ad_home_impressions_count'>0</p>
					<p className='ad_home_impressions_text'>total impressions</p>
				</div> 
				<div className='ad_home_activeads_div'>
					<p className='ad_home_activeads_count'>0</p>
					<p className='ad_home_activeads_text'>active ads</p>
				</div>
			</div>
			</div>
		</div>
	)
}

export default Home
