/**
 * Sign out page.
 */

import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {Page, PageBody, PageBodyLoading} from 'stk';
import * as Store from '../store'
import * as Api from '../api';

interface IUserSignOutPageState {
	refreshing: boolean;
}

export class UserSignOutPage extends React.Component<{}, IUserSignOutPageState> {
	constructor (props: {}) {
		super(props);
		
		this.state = {
			refreshing: true,
		};
	}
	
	componentDidMount (): void {
		this.requestSignOut();
	}
	
	handleReceiveData (resp: Api.IResponse<any>): void {
		this.setState({refreshing: false});
		Store.dispatchUserUpdate(resp.body.user)
	}
	
	handleReceiveDataError (): void {
		this.setState({refreshing: false});
	}

	requestSignOut (): void {
		this.setState({refreshing: true});		
		Api.signOut(this.handleReceiveData.bind(this), this.handleReceiveDataError.bind(this));
	}

	render (): React.ReactNode {
		if (this.state.refreshing == false){
			return (<ReactRouterDOM.Redirect to="/" />);
		} else {
			return (
				<Page title="Déconnexion">
					<PageBody>
						<PageBodyLoading />
					</PageBody>
				</Page>
			);
		}
	}
}
