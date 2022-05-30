/**
 * Sign in page.
 */

import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as Store from '../store';
import {Link} from 'react-router-dom';
import * as Api from '../api';
import * as Cookie from '../../cookie';
import {Box, BoxBody, BoxHeading, BoxFooter, Button, Col, EIcon, FormControl, FormSmartText, Page, PageBody, Row, Padding} from 'stk';
import {Toolbar, ToolbarTitle} from '../../ui/toolbar';
import * as Common from '../api/common';

interface ISignInBoxProps {
	defaultLogon?: string;
	error?: string;
	logonError?: string;
	onSignIn: {(logon: string, password: string): void};
	password?: string;
	passwordError: string;
	signingIn: boolean;
}

interface ISignInBoxState {
	logon: string;
	password: string;
}

class SignInBox extends React.Component<ISignInBoxProps, ISignInBoxState> {

	constructor (props: ISignInBoxProps) {
		super(props);

		this.state = {
			logon: props.defaultLogon ? props.defaultLogon : '',
			password: '',
		}

		this.handleLogonChange = this.handleLogonChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	handleKeyUp (e: React.KeyboardEvent<HTMLElement>) {
		if (e.key == 'Enter'){
			this.handleSignIn();
		}
	}

	handleLogonChange (newLogon: string) {
		this.setState({logon: newLogon});
	}

	handlePasswordChange (newPassword: string) {
		this.setState({password: newPassword});
	}

	handleSignIn () {
		this.props.onSignIn(this.state.logon, this.state.password);
	}

	render () {
		let hasError: string|undefined = this.props.error || this.props.logonError;
		let dateJour = new Date();
		//style={{display:'flex', alignItems:'center'}}
		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
					<BoxBody style={{textAlign:"center", display:'flex', alignItems:'center'}}>
						<Box withBorder style={{width:'22em'}}>
							<BoxHeading><h2>Identifiants de connexion</h2></BoxHeading>
							<BoxBody padding={Padding.ULarge}>
								{this.props.defaultLogon ? (<p><strong>Bienvenue dans SAGA.</strong> Vous pouvez maintenant vous connecter avec le mot de passe que vous avez choisi.</p>) : null}
								<FormControl>
									<FormSmartText
										icon={EIcon.ACCOUNT_CIRCLE}
										placeholder="Logon Windows"
										value={this.state.logon}
										onChange={this.handleLogonChange}
										error={hasError}
										onKeyUp={this.handleKeyUp} />
								</FormControl>
								<FormControl>
									<FormSmartText
										icon={EIcon.VPN_KEY}
										placeholder="Mot de passe"
										password value={this.state.password}
										onChange={this.handlePasswordChange}
										error={this.props.passwordError}
										onKeyUp={this.handleKeyUp} />
								</FormControl>
								{hasError ? this.renderReinitPasswordButton() : null}
								<FormControl>
									<Button
										primary
										onClick={this.handleSignIn}
										icon={this.props.signingIn ? EIcon.HOURGLASS_EMPTY : EIcon.PERSON}
										loading={this.props.signingIn}>
										<strong>Connexion</strong>
									</Button>
								</FormControl>
							</BoxBody>
							<BoxFooter alignRight>
								<Col>
									<p><Link to="/utilisateurs/reinitialiser-mdp">Réinitialisez votre mot de passe</Link></p>
								</Col>
							</BoxFooter>
						</Box>
					</BoxBody>
					<BoxFooter>
						© {dateJour.getFullYear()} - SAGA Application
					</BoxFooter>
				</Box>
			</Row>
		);
	}

	renderReinitPasswordButton (): React.ReactNode {
		return (
			<FormControl>
				<Button caution to="/utilisateurs/reinitialiser-mdp"><strong>Mot de passe oublié ?</strong></Button>
				</FormControl>
		);
	}
}

interface IUserSignInMatchProps {
	logon: string;
}

interface IUserSignInPageProps extends ReactRouterDOM.RouteComponentProps<IUserSignInMatchProps> {
	user: Store.User;
}

interface IUserSignInPageState {
	formError: string;
	logonError: string;
	passwordError: string;
	signInError: string;
	signingIn: boolean;
	user: Store.IMe|null;
	auth: any;
	requestStatusVersion: Common.ECallStatus;
	resultVersion: any;
}

class UserSignInPageComp extends React.Component<IUserSignInPageProps, IUserSignInPageState> {
	constructor (props: IUserSignInPageProps) {
		super(props);

		this.state = {
			formError: '',
			logonError: '',
			passwordError: '',
			signingIn: false,
			signInError: '',
			user: null,
			auth: null,
			requestStatusVersion: Common.ECallStatus.RUNNING,
			resultVersion: {},
		};

		this.handleSignIn = this.handleSignIn.bind(this);
	}

	handleReceiveData (resp: Api.IResponse<any>): void {
		this.setState({
			signInError: '',
			logonError: '',
			passwordError: '',
			signingIn: false,
			user: resp.body.user,
			auth: resp.body.auth,
		});

		this.requestDataVersion();
	}

    requestDataVersion (): void 
    {
        let url_ = new Common.Url(['api', 'param', 'version']);
        Common.postAsJson(url_, {authorization:"APPLICATION_VERSION:DISPLAY"}, this.receiveDataVersion.bind(this), this.receiveDataVersionError.bind(this));
	}

	receiveDataVersion (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusVersion: Common.ECallStatus.OK,
			resultVersion: myresult
		});

		var version = '';
		for(let v in myresult){
			if(myresult[v]["target"] == "DEV"){
				version = myresult[v]["version"] + "-DEV";
			}else{
				version = myresult[v]["version"];
			}
		}

		// Par défaut le cookie expirera 10 heures après sa création (ce qui correspond à une journée de travail standard)
		let hour = 10;
		Cookie.writeString("session_id", this.state.auth.sessionId, {expires: hour});
		Cookie.writeString("session_logon", this.state.auth.logon, {expires: hour});
		Cookie.writeString("version", version, {expires: hour});

		if(this.state.user){
			Store.dispatchUserSignIn(this.state.user);
		}
	}

	receiveDataVersionError (): void {
		this.setState({
			requestStatusVersion: Common.ECallStatus.NOK,
			resultVersion:[]
		});
	}

	handleReceiveDataError (): void {
		this.setState({
			signInError: 'Aucun utilisateur pour ces informations',
			logonError: '',
			passwordError: '',
			signingIn: false,
			user: null,
		});
	}

	handleSignIn (logon: string, password: string): void {
		var hasError = false;

		if (logon == ''){
			this.setState({signInError:'', logonError: 'Veuillez renseigner votre login'});
			hasError = true;
		} else {
			this.setState({logonError: ''});
		}

		if (password == '') {
			this.setState({signInError:'', passwordError: 'Veuillez renseigner votre mot de passe'});
			hasError = true;
		} else {
			this.setState({passwordError: ''});
		}

		if (!hasError) {
			Api.signIn(logon,
				password,
				this.handleReceiveData.bind(this),
				this.handleReceiveDataError.bind(this));
			this.setState({signingIn: true});
		}
	}

	render () {
		if (this.props.user && this.props.user.connecte === true) {
			if (window.location.pathname && !window.location.pathname.startsWith('/utilisateurs/connexion')) {
				return (<ReactRouterDOM.Redirect to={window.location.pathname} />);
			} else {
				return (<ReactRouterDOM.Redirect to={'/'} />);
			}
		} else {
			let defaultLogon = '';
			if (this.props.match.params && this.props.match.params.logon) {
				defaultLogon = this.props.match.params.logon;
			}

			return (
				<Page title="Connexion">
					<Toolbar>
						<ToolbarTitle>
							<h1><strong>Connexion</strong></h1>
						</ToolbarTitle>
					</Toolbar>
					<PageBody>
						<SignInBox
							defaultLogon={defaultLogon}
							error={this.state.signInError}
							logonError={this.state.logonError}
							passwordError={this.state.passwordError}
							signingIn={this.state.signingIn}
							onSignIn={this.handleSignIn} />
					</PageBody>
				</Page>
			);
		}
	}
}

export const UserSignInPage = ReactRouterDOM.withRouter(Store.withStore(UserSignInPageComp));