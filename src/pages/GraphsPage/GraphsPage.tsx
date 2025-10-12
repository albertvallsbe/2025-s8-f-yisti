import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Layout } from '../../components/Layout/Layout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function GraphsPage() {

	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const randomBarData = Array.from({ length: 12 }, () => Math.floor(Math.random() * (30 - 5 + 1)) + 5);
	const randomLineData = Array.from({ length: 12 }, () => Math.floor(Math.random() * (30 - 10 + 1)) + 10);
	const randomPieData = Array.from({ length: 5 }, () => Math.floor(Math.random() * (100000 - 2000 + 1)) + 2000);

	const barData = {
		labels,
		datasets: [
			{
				label: 'Map locations per month',
				data: randomBarData,
				backgroundColor: '#008000',
			},
		],
	};

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Calendar events per month',
        data: randomLineData,
        borderColor: '#0038B8',
        backgroundColor: '#00175d',
        tension: 0.4,
        fill: true,
      },
    ],
  }

	const pieData = {
		labels: [
			'Africa (orange)',
			'Asia (red)',
			'Europe (blue)',
			'America (green)',
			'Australia (yellow)'
		],
		datasets: [{
			label: 'Users by continent',
			data: randomPieData,
			backgroundColor: [
				'rgb(255, 159, 64)',
				'rgb(255, 99, 132)',
				'rgb(54, 162, 235)',
				'rgb(75, 192, 192)',
				'rgb(255, 205, 86)'
			],
			hoverOffset: 5
		}]
	};

  return (
		<Layout>
			<div className="graphs-page-wrapper">
				<div className="graphs-header">
					<h1>Graphs Page</h1>
					<p>This page shows some example graphs using Chart.js and react-chartjs-2.</p>
				</div>
				<div className="graphs-container">
					<div className="graph-card">
						<h2>📊 User's number of map locations per month</h2>
						<Bar data={barData} />
					</div>
					<div className="graph-card">
						<h2>📈 User's number of calendar events per month</h2>
						<Line data={lineData} />
					</div>
					<div className="graph-card">
						<h2>🍰 Number of users by continent</h2>
						<Pie data={pieData}/>
					</div>
				</div>
			</div>
		</Layout>
  )
}
