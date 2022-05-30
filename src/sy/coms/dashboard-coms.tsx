import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {AlertBox, EIcon, Page, PageBody, Row, Button, Spreadsheet, SpreadsheetColumn, Box, BoxHeading, BoxBody, Padding, Spinner} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Common from '../api/common';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';
import * as Store from '../store';



interface DashboardProps {
	user?: Store.User;
}

interface DashboardState {

}

export class DashboardComsComp extends React.PureComponent<DashboardProps, DashboardState> {

	constructor (props: DashboardProps) {
		super(props);
	}


	render (): React.ReactNode {
		let pageBody: React.ReactNode = '';

		/*if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else */
		if (this.props.user && (this.props.user.hasAuthorization('COMS-E:DISPLAY') || this.props.user.hasAuthorization('COMS-M:DISPLAY'))) {
			pageBody = this.renderDashboard();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (
			<Page title="Dashboard COMS">
				<Toolbar title='SAGA - Process COMS'>
					<ToolbarTitle>
                        <h1>Process Coms - Dashboard</h1>
                    </ToolbarTitle>
					<ToolbarButtons></ToolbarButtons>
				</Toolbar>
				<PageBody fullWidth>{pageBody}</PageBody>
			</Page>
		);
	}

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}


	renderDashboard (): React.ReactNode {

		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
					<BoxHeading>

					</BoxHeading>
					<BoxBody>

					</BoxBody>
				</Box>
			</Row>
		);
	}
}

export const DashboardComs = Store.withStore(DashboardComsComp);
