/**
 * Edit users.
 */

import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {AlertBox, Box, BoxBody, BoxHeading,EIcon, Col, Row, Page, PageBody, PageBodyLoading} from 'stk';
import {Toolbar, ToolbarTitle} from '../../ui/toolbar';
import * as Api from '../api';
import * as Store from '../store';
import {UserForm} from './user-form';


 

interface IUserEditPageMatchProps {
	logon: string;
}


interface IUserEditPageProps extends ReactRouterDOM.RouteComponentProps<IUserEditPageMatchProps> {
	user: Store.User;
}

interface IUserEditPageState {
	userRequest: Api.ECallStatus;
	userRolesRequest: Api.ECallStatus;
	userGammesRequest: Api.ECallStatus;
	creating: boolean,
	newUser: Api.IUser | null;
	newUserErrors: any | null;
	userAdded: boolean;
	userRoles: number[];
	userGammes: number[];
}

export class UserEditPage extends React.Component<IUserEditPageProps, IUserEditPageState> {
	constructor (props: IUserEditPageProps) {
		super(props);

		this.state = {
			creating: false,
			newUser: null,
			newUserErrors: null,
			userAdded: false,
			userRequest: Api.ECallStatus.NOT_STARTED,
			userRolesRequest: Api.ECallStatus.NOT_STARTED,
			userGammesRequest: Api.ECallStatus.NOT_STARTED,
			userRoles: [],
			userGammes:[],
		}
	}

	componentDidMount (): void {
		if (this.isUserAllowed() === true){
			this.requestUserData();
			this.requestUserRoles();
			this.requestUserGammes();
		}
	}

	handleUserChange (user: Api.IUser): void {
		this.setState({newUser: user});
	}

	handleUserUpdate (): void {
		this.requestUpdate();
	}

	requestUpdate (): void {
        this.setState({creating: true});
        Api.updateUser(this.state.newUser,
			this.receiveUpdate.bind(this),
			this.receiveUpdateError.bind(this))
	}

	isUserAllowed (): boolean {
		return this.props.user.hasAuthorization('UTILISATEUR:EDIT') || this.props.user.hasAuthorization('UTILISATEUR_GAMME:EDIT');
	}


	requestUserData (): void {
		this.setState({userRequest: Api.ECallStatus.RUNNING});

		Api.getUser(this.props.match.params.logon,
			this.receiveUserData.bind(this),
			this.receiveUserDataError.bind(this));
	}

	requestUserRoles (): void {
		this.setState({userRolesRequest: Api.ECallStatus.RUNNING, userRoles: []});
		Api.getUserRoles(this.props.match.params.logon,
			this.receiveUserRoles.bind(this),
			this.receiveUserRolesError.bind(this));
	}

	requestUserGammes (): void {
		this.setState({userGammesRequest: Api.ECallStatus.RUNNING, userGammes: []});
		Api.getUserGammes(this.props.match.params.logon,
			this.receiveUserGammes.bind(this),
			this.receiveUserGammesError.bind(this));
	}
		
	receiveUpdate (_: Api.IResponse<any>): void {
		this.setState({
			creating: false,
			userAdded: true,
		});
	}

	receiveUpdateError (resp: Api.IResponse<any>): void {
		this.setState({
			creating: false,
			newUserErrors: resp.errors
		});
	}

	receiveUserData (resp: Api.IResponse<Api.IUserResponse>): void {
		this.setState({
			userRequest: Api.ECallStatus.OK,
			newUser: resp.body
		});
	}

	receiveUserDataError (_: Api.IUserResponse): void {
		this.setState({
			userRequest: Api.ECallStatus.NOK
		});
	}

	receiveUserRoles (resp: Api.IUserRolesResponse): void {
		let roles: number[] = [];
		for (let i = 0; i < resp.body.length; ++i) {
			roles.push(resp.body[i].id);
		}

		this.setState({
			userRolesRequest: Api.ECallStatus.OK,
			userRoles: roles,
		});
	}

	receiveUserRolesError (_: Api.IUserRolesResponse): void {
		this.setState({
			userRolesRequest: Api.ECallStatus.NOK
		});
	}
 
	receiveUserGammes (resp: Api.IUserGammesResponse): void {
		let Gammes: number[] = [];
		for (let i = 0; i < resp.body.length; ++i) {
			Gammes.push(resp.body[i].id);
		}

		this.setState({
			userGammesRequest: Api.ECallStatus.OK,
			userGammes: Gammes,
		});
	}

	receiveUserGammesError (_: Api.IUserGammesResponse): void {
		this.setState({
			userGammesRequest: Api.ECallStatus.NOK
		});
	}

	render (): React.ReactNode {
		if (this.isUserAllowed() === true){
			if (this.state.userRequest == Api.ECallStatus.RUNNING || this.state.userRequest == Api.ECallStatus.NOT_STARTED ||
				this.state.userRolesRequest == Api.ECallStatus.RUNNING || this.state.userRolesRequest == Api.ECallStatus.NOT_STARTED ||
				this.state.userGammesRequest == Api.ECallStatus.RUNNING || this.state.userGammesRequest == Api.ECallStatus.NOT_STARTED) {
				return this.renderLoading();
			}
			else if (this.state.newUser !== null){
				if (this.props.user && !this.props.user.hasAuthorization("UTILISATEUR:EDIT")) {
					if(this.state.newUser.logon != this.props.user.logon){
						return this.renderNotAuthorized();
					}
				}
				if(this.state.userAdded === true)
				{
					// Modification d'un utilisateur, affichage après validation des modifications
					return this.renderUserIsUpdated();
				}else
				{
					// Modification d'un utilisateur
					return this.renderForm();
				}
			}else{
				return this.renderUserNotExist();
			}
		} else {
			return this.renderNotAuthorized();
		}
	}
 
	renderForm(): React.ReactNode {
		return (
			<Page title="Modifier un utilisateur">
				<Toolbar title="Modifier un utilisateur" />
				<PageBody>
					<UserForm
					    user={this.props.user}
						newUser={this.state.newUser}
						roles={this.state.userRoles}
						gammes={this.state.userGammes}
						admin={this.props.user}
						errors={this.state.newUserErrors}
						onChange={this.handleUserChange.bind(this)}
						onSubmit={this.handleUserUpdate.bind(this)}
						creating={this.state.creating} />
				</PageBody>
			</Page>
		);
	}

	renderLoading(): React.ReactNode {
		return (
			<Page title="Modifier un utilisateur...">
				<Toolbar title="Modifier un utilisateur..." />
				<PageBody><PageBodyLoading /></PageBody>
			</Page>
		);
	}

 	renderUserNotExist(): React.ReactNode {
		return (
			<Page title="Modifier un utilisateur">
				<Toolbar title="Modifier un utilisateur" />
				<PageBody>
					<Row fullHeight>
						<Col>
							<Box fullHeight>
								<BoxHeading><h2>Modification d'un compte utilisateur</h2></BoxHeading>
								<BoxBody>
									<AlertBox title="Utilisateur demandé n'existe pas.">
										<p>Il y a eu une erreur, l'utilisateur demandé n'a pas été trouvé dans la base de données.</p>
									</AlertBox>
								</BoxBody>
							</Box>
						</Col>
					</Row>
				</PageBody>
			</Page>
		);
	}

	renderNotAuthorized(): React.ReactNode {
		return (
			<Page title="Créer / Modifier un utilisateur">
				<Toolbar title="Créer / Modifier un utilisateur" />
				<PageBody>
					<Row fullHeight>
						<Col>
							<Box fullHeight>
								<BoxHeading><h2>Création / Modification d'un compte utilisateur</h2></BoxHeading>
								<BoxBody>
									<AlertBox title="Autorisations insuffisantes">
										<p>Vous n'avez pas l'autorisation de créer / modifier un compte utilisateur.</p>
									</AlertBox>
								</BoxBody>
							</Box>
						</Col>
					</Row>
				</PageBody>
			</Page>
		);
	}

	renderUserIsUpdated(): React.ReactNode {
		let userUrl = '/utilisateurs/' + this.state.newUser.logon;
		return (
			<Page title="Modifier un utilisateur">
				<Toolbar title="Modifier un utilisateur" />
				<PageBody>
					<Row fullHeight>
						<Col style={{display:'flex', alignItems:'center'}}>
							<Box withBorder style={{width:'40em'}}>
								<BoxBody>
									<AlertBox icon={EIcon.CHECK}>
										<h2>Compte modifié !</h2>
										<p>Les informations de <ReactRouterDOM.Link to={userUrl}><strong>{this.state.newUser.name} {this.state.newUser.familyName}</strong></ReactRouterDOM.Link> ({this.state.newUser.logon}) ont bien été modifiées.</p>
									</AlertBox>
								</BoxBody>
							</Box>
						</Col>
					</Row>
				</PageBody>
			</Page>
		);
	}
}