import React from 'react';
import './adItem.css';
import { Avatar,} from '@material-ui/core';
import {Bar} from 'react-chartjs-2';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import ReplayRoundedIcon from '@material-ui/icons/ReplayRounded';

function AdItem() {

	const labels = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
	  ];


	const data = canvas => {
		return {
			labels: labels,
			datasets: [{
			  label: 'impression stats',
			  backgroundColor: '#0066F5',
			  borderColor: 'rgb(255, 99, 132)',
			  data: [0, 10, 5, 2, 20, 30, 45],
			}]
		};
	}

	const opt =()=> {
		return{
			options: {
				scales:{
					x:{
						grid:{
							borderColor: 'red',
						}
					}
				}
			}
		}
	}

	return (
		<div style={{padding: '1em'}} className="aditem_container">
			<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1em'}}>
				<div className="aditem_subcontainer" style={{marginTop: '.3em'}}>
					<p style={{marginRight: '1em', fontSize: '1.1em', marginTop: '-.001em'}}>Shoe</p>
					<Avatar style={{height: '1em', width: '1em', fontSize: '.5em', padding: '1em', marginTop: '.3em', backgroundColor:'#E7E7E7'}}>Ad</Avatar>
				</div>
				<label className="switch">
  					<input type="checkbox"/>
 					<span className="slider round"></span>
				</label>
			</div>
			<div className='ad_home_bargraph'><Bar data = {data} options={opt}/></div>
			<p style={{color:'var(--blueprimary)', fontWeight:'500'}}>Stats</p>
			<div style={{display:'flex', justifyContent: 'space-between'}}>
				<p style={{fontWeight:'500'}}>Today's impressions</p>
				<p>2000</p>
			</div>
			<div style={{display:'flex', justifyContent: 'space-between'}}>
				<p style={{fontWeight:'500'}}>Total impressions</p>
				<p>2000000</p>
			</div>
			<div style={{display:'flex', justifyContent: 'space-between'}}>
				<p style={{fontWeight:'500'}}>impressions left</p>
				<p>200</p>
			</div>
			<div style={{display:'flex', justifyContent: 'space-between'}}>
				<p style={{fontWeight:'500'}}>Promoters</p>
				<p>20</p>
			</div>
			<div className='aditem_buttoncontainer'>
				<button style={{backgroundColor: 'var(--blueprimary)', border: 'none', width: '5em', borderRadius: '10%'}}><VisibilityRoundedIcon style={{color: 'white'}} /></button>
				<button style={{backgroundColor: 'var(--blueprimary)', border: 'none', width: '5em', borderRadius: '10%'}}><ReplayRoundedIcon style={{color: 'white'}}/></button>
			</div>
		</div>
	)
}

export default AdItem
