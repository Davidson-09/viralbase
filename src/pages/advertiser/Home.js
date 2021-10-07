import React from 'react'
import Header from '../../components/advertiser/Header'
import './adhome.css'
import {Bar} from 'react-chartjs-2';
import HomeActiveAdItem from '../../components/advertiser/HomeActiveAdItem';
import {firebase} from '../../fire'


function Home() {

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
			  data: [100, 10, 5, 2, 20, 30, 45],
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
		<div className='ad_home_container'>
			<div>
					<div className='ad_home_stat_container'>
						<div className="ad_home_impressions_div">
							<p className='ad_home_impressions_count'>1,000</p>
							<p className='ad_home_impressions_text'>total impressions</p>
						</div> 
						<div className='ad_home_activeads_div'>
							<p className='ad_home_activeads_count'>20</p>
							<p className='ad_home_activeads_text'>active ads</p>
						</div>
					</div>
					
					{/*the graph will show the number of impressioins per day for thirty days*/}
					<div className='ad_home_bargraph'><Bar data = {data} options={opt}/></div>
					<div>
						<div className='ad_home_activeads_header'>
							<p className='ad_home_activeads_header_text'>Active ads</p>
							<p className='ad_home_activeads_header_text'>impressions</p>
						</div>
						<div>
							<HomeActiveAdItem/>
							<HomeActiveAdItem/>
						</div>
					</div>
				</div>
		</div>
	)
}

export default Home
