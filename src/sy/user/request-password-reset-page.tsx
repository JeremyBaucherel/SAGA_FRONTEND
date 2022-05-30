/**
 * A page where the user can request a link to reset his password.
 * 
 * The user will receive an e-mail with the link.
 */

import * as React from 'react';
import {AlertBox, Button, FormSmartText, EIcon, Page, PageBody, Col, Box, BoxBody, BoxHeading, BoxFooter, Row} from 'stk';
import {Toolbar, ToolbarTitle} from '../../ui/toolbar';
import * as Api from '../api';

interface IUserRequestPasswordResetPageState {
	formError: string;
	logon: string;
	logonError: string;
	user: Api.IMeResponse | null;
	reset: boolean;
	resetting: boolean;
}

export class UserRequestPasswordResetPage extends React.Component<{}, IUserRequestPasswordResetPageState> {

	state: IUserRequestPasswordResetPageState;

	constructor (props: {}) {
		super(props);
		
		this.state = {
			formError: '',
			logon: '',
			logonError: '',
			user: null,
			reset: false,
			resetting: false,
		};
		
		this.handleLogonChange = this.handleLogonChange.bind(this);
		this.handleResetPassword = this.handleResetPassword.bind(this);
	}
	
	handleLogonChange (newLogon: string): void {
		this.setState({logon: newLogon});
	}
	
	handleReceiveData (): void {
		this.setState({
			logonError: '',
			reset: true,
			resetting: false,
		});
	}

	handleReceiveDataError (resp: Api.IResponse): void {
		this.setState({
			logonError: resp.errorsSummary,
			reset: false,
			resetting: false,
		});
	}
	
	handleResetPassword (): void {
		var hasError = false;
		
		let logon = this.state.logon;
		
		if (logon == ''){
			this.setState({logonError: 'Veuillez renseigner votre login'});
			hasError = true;
		} else {
			this.setState({logonError: ''});
		}

		
		if (!hasError) {
			this.setState({resetting: true});

			Api.requestUserPasswordReset(logon,
				this.handleReceiveData.bind(this),
				this.handleReceiveDataError.bind(this));
		}
	}
	
	handleUserReceived (resp: Api.IMeResponse): void {
		this.setState({user: resp});
	}
	
	render (): React.ReactNode {
		if (this.state.reset === true) {
			return (
				<Page title="Réinitialiser votre mot de passe">
                    <Toolbar>
						<ToolbarTitle>
							<h1><strong>Réinitialiser votre mot de passe</strong></h1>
						</ToolbarTitle>
					</Toolbar>
					<PageBody>
                        <Row fullHeight>
				            <Col style={{display:'flex', alignItems:'center'}}>
								<Box withBorder style={{width:'30em'}}>
									<BoxHeading><h2>Réinitialiser votre mot de passe</h2></BoxHeading>
									<BoxBody center>
                                        <AlertBox icon={EIcon.CHECK}>
                                            <h2>Demande envoyée !</h2>
                                            <p>Un e-mail contenant le lien pour réinitialiser votre mot de passe vient de vous être envoyé.</p>
                                        </AlertBox>			
									</BoxBody>
								</Box>
							</Col>
						</Row>
					</PageBody>
				</Page>
			);
		} else {
			return (
				<Page title="Réinitialiser votre mot de passe">
                    <Toolbar>
						<ToolbarTitle>
							<h1><strong>Réinitialiser votre mot de passe</strong></h1>
						</ToolbarTitle>
					</Toolbar>
					<PageBody>
                        <Row fullHeight>
				            <Col style={{display:'flex', alignItems:'center'}}>
								<Box withBorder style={{width:'25em'}}>
									<BoxHeading><h2>Réinitialiser votre mot de passe</h2></BoxHeading>
									<BoxBody center>												
										<FormSmartText
											placeholder="Logon"
											value={this.state.logon}
											onChange={this.handleLogonChange}
											error={this.state.logonError} />
									</BoxBody>
									<BoxFooter alignRight>
										<Button
											primary
											onClick={this.handleResetPassword}
											icon={this.state.resetting ? EIcon.HOURGLASS_EMPTY : EIcon.REFRESH}
                                            loading={this.state.resetting === true}>Réinitialiser</Button>
									</BoxFooter>
								</Box>
							</Col>
						</Row>
					</PageBody>
				</Page>
			);
		}
	}
}