/**
 * Initialization of a user account. 
 * 
 * When a user account is created by an admin, the user receives an e-mail with
 * a link to activate his account. This link leads to this page.
 * 
 * The user simply have to choose a password.
 */

import * as React from 'react';
import * as ReactRouter from 'react-router';
import * as ReactRouterDOM from 'react-router-dom';
import {AlertBox, Box, BoxHeading, BoxBody, BoxFooter, Button, EIcon, Icon, FormSmartText, Col, Page, PageBody, PageBodyLoading, Row} from 'stk';
import {Toolbar, ToolbarTitle} from '../../ui/toolbar';
import * as Api from '../api';


interface IUserInitPageFormProps {
	errors?: any;
	onChange: {(passwords: string[]): void};
}
interface IUserInitPageFormState {
	password: string;
	passwordBis: string;
}

class UserInitPageForm extends React.Component<IUserInitPageFormProps, IUserInitPageFormState> {

	constructor (props: IUserInitPageFormProps) {
		super(props);
		
		this.state = {
			password: '',
			passwordBis: '',
		}
		
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handlePasswordBisChange = this.handlePasswordBisChange.bind(this);
	}
	
	componentWillUpdate(_: IUserInitPageFormProps, nextState: IUserInitPageFormState) {
		if (nextState !== this.state){
			if (this.props.onChange !== null){
				this.props.onChange([nextState.password, nextState.passwordBis]);
			}
		}
	}
	
	handlePasswordChange (value: string) {
		this.setState({password: value});
	}
	
	handlePasswordBisChange (value: string) {
		this.setState({passwordBis: value});
	}
	
	render () {		
		var hasPasswordError = (this.props.errors !== null && this.props.errors.hasOwnProperty('password') === true);	
		var hasPasswordBisError = (this.props.errors !== null && this.props.errors.hasOwnProperty('passwordBis') === true);
		
		return (
			<form>
				<FormSmartText label="Mot de passe" value={this.state.password} password onChange={this.handlePasswordChange.bind(this)} error={hasPasswordError ? this.props.errors.password[0] : null} />
				<FormSmartText label="Confirmation de votre mot de passe" password onChange={this.handlePasswordBisChange.bind(this)} value={this.state.passwordBis} error={hasPasswordBisError ? this.props.errors.passwordBis[0] : null} />
			</form>
		);
	}
}


interface IUserInitPageMatchProps {
	logon: string;
	sessionId: string;
}

interface IUserInitPageComponentProps extends ReactRouter.RouteComponentProps<IUserInitPageMatchProps> {
}

interface IUserInitPageComponentState {
	user: Api.IMe | null;
	passwords: string[],
	refreshing: boolean;
	initing: boolean;
	errors: string[];
}

class UserInitPageComponent extends React.Component<IUserInitPageComponentProps, IUserInitPageComponentState> {

	constructor (props: IUserInitPageComponentProps) {
		super(props);
		
		this.state = {
			user: null,
			passwords: [],
			refreshing: true,
			initing: false,
			errors: [],
		}
	}
	
	componentDidMount (): void {
		this.requestUser();
	}
	
	handleInitClick (): void {
		this.requestInit();
	}
	
	handlePasswordChange (passwords: string[]): void {
		this.setState({passwords: passwords});
	}
		
	requestInit (): void {
		this.setState({initing: true});

		Api.initUser(this.props.match.params.logon,
			this.props.match.params.sessionId,
			this.state.passwords[0],
			this.state.passwords[1],
			this.receiveInit.bind(this),
			this.receiveInitError.bind(this));
	}
	
	requestUser (): void {
		Api.requestInitUser(this.props.match.params.logon,
			this.props.match.params.sessionId,
			this.receiveUser.bind(this),
			this.receiveUserError.bind(this))
	}
	
	receiveInit (): void {
		this.setState({initing: false});	
		this.props.history.replace('/utilisateurs/connexion/' + this.props.match.params.logon);
	}

	receiveInitError (resp: Api.IResponse): void {
		this.setState({errors: resp.errors});
	}
	
	receiveUser (resp: Api.IResponse): void {
		this.setState({
			user: resp.body,
			refreshing: false
		});
	}	
	
	receiveUserError (): void {
		this.setState({
			user: null,
			refreshing: false
		});
	}
	
	render (): React.ReactNode {
		if (this.state.refreshing !== true){
			if (this.state.user === null) {
				return (
					<Page title="Activer votre compte utilisateur">
						<Toolbar>
                            <ToolbarTitle>
                                <h1><strong>Activer votre compte utilisateur</strong></h1>
                            </ToolbarTitle>
                        </Toolbar>
                        <PageBody>
                            <Row fullHeight>
                                <Col style={{display:'flex', alignItems:'center'}}>
                                    <Box withBorder style={{width:'40em'}}>
                                        <BoxBody center>
                                            <AlertBox icon={EIcon.ERROR_OUTLINE}>
                                                <h2>Lien d'activation incorrect</h2>
                                                <p>Êtes-vous certain d'avoir suivi le lien d'activation qui vous a été communiqué par e-mail ?</p>                                                
                                            </AlertBox>
                                        </BoxBody>
                                    </Box>
								</Col>
							</Row>
						</PageBody>					
					</Page>
				);
			} else if (this.state.user.active === false) {
				return (
					<Page title="Activer un compte utilisateur">
                        <Toolbar>
                            <ToolbarTitle>
                                <h1><strong>Activer votre compte utilisateur</strong></h1>
                            </ToolbarTitle>
                        </Toolbar>
						<PageBody>
                            <Row fullHeight>
                                <Col style={{display:'flex', alignItems:'center'}}>
									<Box withBorder style={{width: '30em'}}>
										<BoxHeading><h2>Une dernière étape {this.state.user.prenom} !</h2></BoxHeading>
										<BoxBody>
											<div style={{textAlign:'center'}}><Icon style={{fontSize:'15em'}} icon={EIcon.SECURITY} /></div>
										</BoxBody>
										<BoxBody>
											<div>Afin d'initialiser votre compte utilisateur Asgard, merci de choisir un mot de passe.</div>
										</BoxBody>
										<BoxBody>
											<UserInitPageForm errors={this.state.errors} onChange={this.handlePasswordChange.bind(this)} />
										</BoxBody>
										<BoxFooter alignRight>
											<Button primary loading={this.state.initing} icon={EIcon.CHECK} onClick={this.handleInitClick.bind(this)}>ACTIVER MON COMPTE</Button>
										</BoxFooter>
									</Box>
								</Col>
							</Row>
						</PageBody>					
					</Page>
				);
			} else {
				let signInUrl = '/utilisateurs/connexion/' + this.state.user.logon;
				return (
					<Page title="Activer un compte utilisateur">
						<PageBody>
							<Row>
								<Col>
									<AlertBox icon={EIcon.ERROR}>
										<h2>Ce compte utilisateur a déjà été activé</h2>
										<p>Vous pouvez vous <ReactRouterDOM.Link to={signInUrl}><strong>connecter</strong></ReactRouterDOM.Link> avec le mot de passe que vous avez choisi.</p>
									</AlertBox>
								</Col>
							</Row>
						</PageBody>					
					</Page>
				);
			}
		} else {
			return (
				<Page title="Activer un compte utilisateur...">
					<PageBody>
						<PageBodyLoading />
					</PageBody>
				</Page>
			);
		}
	}
}
export const UserInitPage = ReactRouterDOM.withRouter(UserInitPageComponent);