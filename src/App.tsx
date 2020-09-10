import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
	createMuiTheme,
	colors,
	Container,
	CssBaseline,
	ThemeProvider,
} from '@material-ui/core';
import { Title } from './containers/Title';
import { Sidebar } from './containers/Sidebar';
import { Board } from './containers/Board';
import {
	IProcedureService,
	IProcedureSiteService,
} from './services';
import { EditorActions, IState } from './states';


interface IAppProps {
	procedureService: IProcedureService;
	procedureSiteService: IProcedureSiteService;
	updateAllSites: Function;
}

export const App = connect(
	(state: IState) => {
		return {
			procedureService: state.service.procedureService,
			procedureSiteService: state.service.procedureSiteService,
		};
	},
	{
		updateAllSites: EditorActions.updateAllSites,
	},
)((props: IAppProps) => {
	console.log(process.env.REACT_APP_API_URL);

	useEffect(() => {
		props.updateAllSites({ service: props.procedureSiteService });
	});

	const theme = createMuiTheme({
		palette: {
			primary: {
				main: '#75409A',
				light: '#c5b4ef',
				// light: '#a079bc',
			},
			secondary: {
				main: '#11cb5f',
				light: '#75dba0',
			},
			text: {
				primary: '#e6ddec',
				secondary: '#dfccec',
				disabled: '#a093a8',
				hint: '#75dba0',
			},
			error: {
				main: colors.red.A400,
			},
			background: {
				default: '#d3d3d3',
				paper: '#c5b4ef',
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<Container>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Sidebar />
				<Title />
				<Board />
			</Container>
		</ThemeProvider>
	);
})


export default App;




