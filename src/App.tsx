import { Fragment, useState, useMemo } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
	materialCells,
	materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@mui/styles';
import axios, { isCancel, AxiosError } from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles({
	container: {
		padding: '1em',
		width: '100%',
	},
	title: {
		textAlign: 'center',
		padding: '0.25em',
	},
	dataContent: {
		display: 'flex',
		justifyContent: 'center',
		borderRadius: '0.25em',
		backgroundColor: '#cecece',
		marginBottom: '1rem',
	},
	resetButton: {
		margin: 'auto !important',
		display: 'block !important',
	},
	demoform: {
		margin: 'auto',
		padding: '1rem',
	},
});

const initialData = {
	name: 'Send email to Adrian',
	description: 'Confirm if you have passed the subject\nHereby ...',
	done: true,
	recurrence: 'Daily',
	rating: 3,
};

const renderers = [
	...materialRenderers,
	//register custom renderers
	{ tester: ratingControlTester, renderer: RatingControl },
];

const App = () => {
	const classes = useStyles();
	const [data, setData] = useState<any>(initialData);
	const [open, setOpen] = useState(false);
	const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
	const flask_api_url = 'http://localhost:5000'

	const clearData = () => {
		setData({});
	};

	const openSnackBar = () => {
		setOpen(true);
	};

	const closeSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const sendData = () => {
		axios.post(flask_api_url + '/add', data)
			.then(function (response) {
				if (response.status === 200) {
					openSnackBar();
				}
			})
			.catch(function (error) {
				console.log(error)
			})
	};

	const action = (
		<Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={closeSnackBar}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Fragment>
	);

	return (
		<Fragment>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to JSON Forms with React</h1>
					<p className='App-intro'>More Forms. Less Code.</p>
				</header>
			</div>

			<Grid
				container
				justifyContent={'center'}
				spacing={1}
				className={classes.container}
			>
				<Grid item sm={6}>
					<Typography variant={'h4'} className={classes.title}>
						Bound data
					</Typography>
					<div className={classes.dataContent}>
						<pre id='boundData'>{stringifiedData}</pre>
					</div>
					<div>
						<Button
							// className={classes.resetButton}
							onClick={clearData}
							color='error'
							variant='contained'
						>
							Clear data
						</Button>
						<Button
							// className={classes.resetButton}
							onClick={sendData}
							style={{ float: 'right' }}
							color='primary'
							variant='contained'
						>
							Save
						</Button>
					</div>
				</Grid>
				<Grid item sm={6}>
					<Typography variant={'h4'} className={classes.title}>
						Rendered form
					</Typography>
					<div className={classes.demoform}>
						<JsonForms
							schema={schema}
							uischema={uischema}
							data={data}
							renderers={renderers}
							cells={materialCells}
							onChange={({ errors, data }) => setData(data)}
						/>
					</div>
				</Grid>
			</Grid>
			<div>
				<Snackbar
					open={open}
					autoHideDuration={3000}
					onClose={closeSnackBar}
					message="Data Saved Successfully"
					action={action}
				/>
			</div>
		</Fragment>
	);
};

export default App;
