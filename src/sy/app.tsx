/**
 * Entry for the SAGA web application: essentially a routing component.
 */

import './app.css';
import './app-font.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {AlertBox, Button, Col, EIcon, Page, PageBody, Row, Spinner, Popup, PopupTitle, PopupBody, PopupFooter} from 'stk';
import * as Store from './store';
import {
	UserCreatePage,
	UserEditPage,
	UserInitPage,
	UserPage,
	UserRequestPasswordResetPage,
	UserResetPasswordPage,
	UserSignInPage,
	UserSignOutPage,
	UserDisplayAllPage
} from './user';
import {HomePage} from './home-page';

import {DashboardMetal} from './metal/dashboard-metal';
import {ParamPfeMetal} from './metal/param-pfe-metal';
import {ParamGtiMetal} from './metal/param-gti-metal';
import {TemplateFullConfMetal} from './metal/templatefullconf-metal';
import {ParamOthersMetal} from './metal/param-others-metal';
import {RoutingGTIMetal} from './metal/routingGTI-metal';

import {DashboardOptique} from './optique/dashboard-optique';
import {DashboardBdoOptique} from './optique/dashboard-bdo-optique'
import {ParamOthersOptique} from './optique/param-others-optique';
import {ParamPfeOptique} from './optique/param-pfe-optique';
import {ParamGtiOptique} from './optique/param-gti-optique';
import {TypeCableOptique} from './optique/type-cable-optique';
import {TypePinOptique} from './optique/type-pin-optique';
import {RoutingGTIOptique} from './optique/routingGTI-optique';

import {DashboardComs} from './coms/dashboard-coms';

import {ParamOthersGlobal} from './menu/parameters';
import {RoutingGTI} from './menu/routingGti';
import {Information} from './menu/information';

import {Autorisation} from './menu/autorisation'
import {Role} from './menu/role';
import {RoleAutorisation} from './menu/role-autorisation';

import {NotFoundPage} from './not-found-page';
import {Toolbar, ToolbarTitle} from '../ui/toolbar';
import * as Api from './api';


interface ISAGARouterProps {
	user?: Store.User;
}

interface ISAGARouterState {
	error: boolean;
	errorDescription: string;
	fetchingUser: boolean;
}

interface IRgpdPopupState {
	acceptRequest: Api.ECallStatus;
	accepted: boolean | null;
}

/**
 * A popup to get the user consent regarding Private Individual Information (PII)
 * collection by SAGA in the frame of the GDPR.
 *
 * https://en.wikipedia.org/wiki/General_Data_Protection_Regulation
 */
class RgpdPopup extends React.Component<{}, IRgpdPopupState> {
	constructor (props: {}) {
		super(props);

		this.state = {
			acceptRequest: Api.ECallStatus.NOT_STARTED,
			accepted: null
		};

		this.receiveAccept = this.receiveAccept.bind(this);
		this.receiveAcceptError = this.receiveAcceptError.bind(this);
	}

	/**
	 * Send a request to the API for accepting PII collection.
	 */
	requestAccept (): void {
		this.setState({
			acceptRequest: Api.ECallStatus.RUNNING,
			accepted: null
		});
		Api.acceptMeRgpd(this.receiveAccept, this.receiveAcceptError);
	}

	receiveAccept (resp: Api.IResponse): void {
		this.setState({
			acceptRequest: Api.ECallStatus.OK,
			accepted: true,
		});
	}

	receiveAcceptError (resp: Api.IResponse): void {
		this.setState({
			acceptRequest: Api.ECallStatus.NOK,
			accepted: null
		});
	}

	render (): React.ReactNode {
		if (this.state.accepted !== true) {
			return (
				<Popup onBlanketClick={(e) => {}} width="800px" height="400px">
					<PopupTitle>
						<h2>Collecte des données personnelles (RGPD)</h2>
					</PopupTitle>
					<PopupBody style={{overflow:"auto", display: "block"}}>
					<p>Dans le cadre de la mise en application du Réglement Général sur la Protection des Données (RGPD), entrée en application le 25/05/2018, nous vous informons que l'outil <em>SAGA</em> collecte certaines de vos données personnelles.</p>

					<h4>Quelles données personnelles sont collectées ?</h4>
					<ul>
						<li>Votre nom et votre prénom</li>
						<li>Votre matricule Windows (logon)</li>
					</ul>

					<h4>Pourquoi collectons-nous ces données ?</h4>
					<ol>
						<li>Maîtriser l'accès aux données. En donnant l'accès à <em>SAGA</em> sur la base de comptes utilisateurs individuels, nous nous assurons que les données ne sont accessibles que par les personnes autorisées</li>
						<li>Supporter un travail collaboratif. </li>
					</ol>

					<h4>Qui utilise ces données ?</h4>
					<p>Ces données sont uniquement utilisées par l'application <em>SAGA</em>. Elles ne sont pas transférées vers d'autres applications ou services.</p>

					<h4>Où sont stockées vos données ?</h4>
					<p>Vos données personnelles sont uniquement hébergées sur des serveurs <em>Airbus</em>, à Toulouse.</p>

					<h4>Combien de temps ces données sont-elles conservées ?</h4>
					<p>Au maximum 2 ans après la dernière connexion à <em>SAGA</em>, nous supprimerons les données personnelles stockées dans l'outil.</p>

					<h4>Je souhaite en savoir plus</h4>
					<p>Pour plus d'informations, vous pouvez consulter la <a href="https://sites.google.com/airbus.com/dataprivacy/gdpr-basics">page explicative du RGPD</a>.</p>

					</PopupBody>

					<PopupFooter>
						<strong>Acceptez-vous que ces données personnelles soient collectées par <em>SAGA</em> ?</strong>
						<Button caution icon={EIcon.CLOSE} to={"mailto:jeremy.j.baucherel.external@airbus.com?subject=SAGA:%20Je%20souhaite%20supprimer%20mes%20données%20personnelles"}>Je refuse</Button>
						<Button primary icon={this.state.acceptRequest == Api.ECallStatus.RUNNING ? EIcon.HOURGLASS_EMPTY : EIcon.CHECK} onClick={() => this.requestAccept()}>J'accepte</Button>
					</PopupFooter>
				</Popup>
			);
		} else {
			return null;
		}
	}
}

/**
 * The global router component for the application.
*/
class SAGARouterComp extends React.Component<ISAGARouterProps, ISAGARouterState> {
	constructor (props: ISAGARouterProps) {
		super(props);

		this.state = {
			fetchingUser: false,
			error: false,
			errorDescription: '',
		};
	}

	componentWillMount (): void {
		this.requestUser();
	}

	/**
	 * If no user has been received so far, request it.
	 * @param nextProps
	 */
	componentWillReceiveProps (nextProps: ISAGARouterProps): void {
		if (nextProps.user === null) {
			this.requestUser();
		}
	}

	/**
	 * Request current user (could be anonymous if not logged in).
	*/
	requestUser (): void {
		if (this.state.fetchingUser === false && this.props.user === null) {
			this.setState({
				fetchingUser: true,
				error: false
			});
			Api.getMe(this.receiveUser.bind(this), this.receiveUserError.bind(this))
		}
	}

	receiveUser (resp: Api.IMeResponse): void {
		this.setState({
			error: false,
			errorDescription: '',
			fetchingUser: false
		});
		Store.dispatchUserUpdate(resp.body);
	}

	receiveUserError (resp: Api.IMeResponse): void {
		this.setState({
			fetchingUser: false,
			error: true,
			errorDescription: resp.errorsSummary,
		});
	}


	render (): React.ReactNode {
		let router = null;

		if (this.state.error === true) {
			router = this.renderError();
		} else if (this.state.fetchingUser === true) {
			router = (
				<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Spinner />
				</div>
			);
		} else {
			if (this.props.user && this.props.user.connecte === true) {
				router = this.renderLoggedIn();
			} else {
				router = this.renderLoggedOut();
			}
		}

		return (<BrowserRouter>{router}</BrowserRouter>);
	}

	/**
	 * Render an GDPR popup asking for the user consent regarding the 
	 * personal data collection.
	 */
	renderRgpdAlert (): React.ReactNode {
		let ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;

		if (this.props.user && this.props.user.connecte === true) {
			let lastRgpdConsent: Date | null = this.props.user.rgpd_date === null ? null : new Date(this.props.user.rgpd_date);

			if (lastRgpdConsent === null || (lastRgpdConsent !== null && (new Date() - lastRgpdConsent) > ninetyDaysInMs)) {
				return (<RgpdPopup />);
			}
		}
		return '';
	}

	/**
	 * Render the requested page as a logged in user.
	*/
	renderLoggedIn (): React.ReactNode {
		return (
			<div style={{height: "calc(100%)", boxSizing: "border-box"}}>
				<Switch>
					<Route exact path="/optique/dashboard" component={DashboardOptique} />
					<Route exact path="/optique/dashboard-bdo-optique" component={DashboardBdoOptique} />
					<Route exact path="/optique/parampfe" component={ParamPfeOptique} />
					<Route exact path="/optique/paramgti" component={ParamGtiOptique} />
					<Route exact path="/optique/paramautres" component={ParamOthersOptique} />
					<Route exact path="/optique/typecable" component={TypeCableOptique} />
					<Route exact path="/optique/typepin" component={TypePinOptique} />
					<Route exact path="/optique/routingGTI" component={RoutingGTIOptique} />

					<Route exact path="/metal/dashboard" component={DashboardMetal} />
					<Route exact path="/metal/parampfe" component={ParamPfeMetal} />
					<Route exact path="/metal/paramgti" component={ParamGtiMetal} />
					<Route exact path="/metal/paramautres" component={ParamOthersMetal} />
					<Route exact path="/metal/templatefullconf" component={TemplateFullConfMetal} />
					<Route exact path="/metal/routingGTI" component={RoutingGTIMetal} />

					<Route exact path="/coms/dashboard" component={DashboardComs} />

					<Route exact path="/parameters" component={ParamOthersGlobal} />
					<Route exact path="/routingGTI" component={RoutingGTI} />
					<Route exact path="/information" component={Information} />
					<Route exact path="/param/Role" component={Role} /> 
					<Route exact path="/param/Autorisation" component={Autorisation} /> 
					<Route exact path="/param/RoleAutorisation" component={RoleAutorisation} /> 

					<Route exact path="/utilisateurs/connexion" component={UserSignInPage} />
					<Route exact path="/utilisateurs/connexion/:logon" component={UserSignInPage} />
					<Route exact path="/utilisateurs/creer" component={Store.withStore(UserCreatePage)} />
					<Route exact path="/utilisateurs/deconnexion" component={UserSignOutPage} />
					<Route exact path="/utilisateurs/afficher" component={Store.withStore(UserDisplayAllPage)} />
					<Route exact path="/utilisateurs/:logon" component={UserPage} />
					<Route exact path="/utilisateurs/:logon/modifier" component={Store.withStore(UserEditPage)} />
					<Route exact path="/" component={Store.withStore(HomePage)} />
					<Route path="*" component={NotFoundPage} />
				</Switch>
				{this.renderRgpdAlert()}
			</div>
		);
	}

	/**
	 * Render the requested page as an anonymous user.
	*/
	renderLoggedOut (): React.ReactNode {
		return (
			<Switch>
				<Route exact path="/utilisateurs/connexion" component={Store.withStore(UserSignInPage)} />
				<Route exact path="/utilisateurs/connexion/:logon" component={UserSignInPage} />
				<Route exact path="/utilisateurs/deconnexion" component={Store.withStore(UserSignOutPage)} />
				<Route exact path="/utilisateurs/:logon/initialiser/:sessionId" component={UserInitPage} />
				<Route exact path="/utilisateurs/reinitialiser-mdp" component={UserRequestPasswordResetPage} />
				<Route exact path="/utilisateurs/:logon/reinitialiser-mdp/:passwordToken" component={UserResetPasswordPage} />
				<Route path="*" component={Store.withStore(UserSignInPage)} />
			</Switch>
		);
	}

	renderError (): React.ReactNode {
		return (
			<Page title="Woops...">
				<Toolbar>
					<ToolbarTitle>
						<h1>SAGA</h1>
					</ToolbarTitle>
				</Toolbar>
				<PageBody>
					<Row>
						<Col>
							<AlertBox icon={EIcon.BUG_REPORT} title="Une erreur inattendue s'est produite">
								<p>Essayez de rafraîchir la page (F5).</p>
							</AlertBox>
						</Col>
					</Row>
				</PageBody>
			</Page>
		);
	}
}
const SAGARouter = Store.withStore(SAGARouterComp);

class SAGAApp extends React.Component {
	render() {
		return (
			<Provider store={Store.get()}>
				<SAGARouter />
			</Provider>
		);
	}
}

ReactDOM.render(React.createElement(SAGAApp), document.getElementById('body'));