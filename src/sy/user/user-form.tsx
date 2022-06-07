import * as React from 'react';
import {AlertBox, Box, BoxBody, BoxHeading, BoxFooter, Button, EIcon, Icon, Col, Row, Page, PageBody, FormCheckBox, FormList, FormSmartText} from 'stk';
import { threadId } from 'worker_threads';
import * as Api from '../api';
import * as Store from '../store';


interface IRoleListProps {
	user?: Store.User;
	selectedRoles?: number[]; // A list of selected roles names
	onSelectionChange: {(newSelection: any): void};
	style?:any;
}

interface IRoleListState{
	roles: {text: string, id: string}[];
}

class _RoleList extends React.Component<IRoleListProps, IRoleListState> {

	constructor (props: IRoleListProps) {
		super(props);

		this.state = {
			roles: [],
		};
	}

	componentDidMount (): void {
		this.requestData();
	}

	receiveData (resp: Api.IResponse<any>): void {
		let roles: {text: string, id: string}[] = [];
		for (let i = 0; i < resp.body.length ; ++i) {
			roles.push({
				text: resp.body[i].name + " - " + resp.body[i].description,
				id: resp.body[i].id
			});
		}
		this.setState({roles: roles});
	}
	

	receiveDataError (): void {
		// FIXME : Should handle error
	}

	requestData (): void {
		Api.getRoles(this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	render (): React.ReactNode {
		var disabled = true;
		if(this.props.user && this.props.user.hasAuthorization('UTILISATEUR:EDIT')){
			disabled = false;
		}
		return (<FormList disabled={disabled} items={this.state.roles} onSelectionChange={this.props.onSelectionChange} style={this.props.style} enableMultiSelection value={this.props.selectedRoles} />);
	}
}


interface IUserFormProps {
	admin: any;
	creating: boolean;
	errors: any;
	onChange?: {(newUser: any): void};
	onSubmit: {(): void};
	newUser?: Api.IUser | null;
	user?: Store.User;
	roles?: number[];
	gammes?: number[];
}

interface IUserFormState {
	logon: string;
	name: string;
	familyName: string;
	roles: number[];
	gammes: number[];
	sendEmail: boolean;
}

export class UserForm extends React.Component<IUserFormProps, IUserFormState> {
	constructor (props: IUserFormProps) {
		super(props);

		let roles: number[] = [];
		if (this.props.roles) {
			roles = this.props.roles;
		}
		let gammes: number[] = [];
		if (this.props.gammes) {
			gammes = this.props.gammes;
		}

		if (this.props.newUser) {
			this.state = {
				logon: this.props.newUser.logon,
				name: this.props.newUser.prenom,
				familyName: this.props.newUser.nom,
				roles: roles,
				gammes: gammes,
				sendEmail: false,
			}
		} else {
			this.state = {
				logon: '',
				name: '',
				familyName: '',
				roles: roles,
				gammes: gammes,
				sendEmail: false,
			}
		}
	}

	componentWillUpdate(newProps: IUserFormProps, nextState: IUserFormState): void {
		if(newProps.roles){
			if (newProps.roles != this.props.roles) {
				this.setState({roles: newProps.roles});
			}
		}
		if(newProps.gammes){
			if (newProps.gammes != this.props.gammes) {
				this.setState({gammes: newProps.gammes});
			}
		}
		if (nextState !== this.state){
			if (this.props.onChange !== undefined){
				this.props.onChange(nextState);
			}
		}
	}

	handleRoleChange (selectedIds: any): void {
		this.setState({roles: selectedIds});
	}

	handleGammeChange (selectedIds: any): void {
		this.setState({gammes: selectedIds});
	}

	handleLogonChange (value: string): void {
		this.setState({logon: value});
	}

	handleNameChange (value: string): void {
		this.setState({name: value});
	}

	handleFamilyNameChange (value: string): void {
		this.setState({familyName: value});
	}

	handleSendEmailChange (value: boolean): void {
		this.setState({sendEmail: value});
	}

	render () {
		let logonError = '';
		if (this.props.errors !== null && this.props.errors.hasOwnProperty('logon') === true) {
			logonError = this.props.errors.logon;
		}

		let nameError = '';
		if (this.props.errors !== null && this.props.errors.hasOwnProperty('name') === true) {
			nameError = this.props.errors.name;
		}

		let familyNameError = '';
		if (this.props.errors !== null && this.props.errors.hasOwnProperty('familyName') === true) {
			familyNameError = this.props.errors.familyName;
		}

		let emailActivation;
		let activationLogonField = true;
		if (!this.props.newUser) {
			emailActivation = (<FormCheckBox checked={this.state.sendEmail} onChange={this.handleSendEmailChange.bind(this)} label="Envoyer un e-mail d'activation à l'utilisateur" />);
			activationLogonField = false;
		}

		let buttonUser;
		if (this.props.newUser) {
			buttonUser = (this.renderButtonMajUser());
		}else{
			buttonUser = (this.renderButtonAddUser());
		}

		let dateJour = new Date();

		let buttonReturn;
		if(this.props.newUser){
			buttonReturn = (<div style={{textAlign:"right", flex: "auto"}}><Button to={"./"} tooltip="Retour" icon={EIcon.ARROW_BACK} secondary></Button></div>);
		}

		return (
				<Row fullHeight>
					<Box style={{width:"100%"}}>
						<BoxBody style={{textAlign:"center", display:'flex'}}>
								<Col>
									<Row>
										<h2>Informations personnelles</h2>
									</Row>
									<Row>
										<Col style={{paddingRight:"20px", paddingBottom:"20px"}}>
											<FormSmartText
												label="Logon"
												placeholder={'ex : ' + this.props.admin.logon}
												onChange={this.handleLogonChange.bind(this)}
												value={this.state.logon}
												error={logonError} 
												disabled={activationLogonField}/>
										</Col>
										<Col style={{paddingRight:"20px", paddingBottom:"20px"}}>
											<FormSmartText
													label="Prénom"
													placeholder={'ex : ' + this.props.admin.prenom}
													onChange={this.handleNameChange.bind(this)}
													value={this.state.name}
													error={nameError} />
										</Col>
										<Col style={{paddingRight:"20px", paddingBottom:"20px"}}>
											<FormSmartText
												label="Nom"
												placeholder={'ex : ' + this.props.admin.nom}
												onChange={this.handleFamilyNameChange.bind(this)}
												value={this.state.familyName}
												error={familyNameError} />
										</Col>
									</Row>
									<Row>
										<h2>Rôles et autorisations</h2>
									</Row>
									<Row style={{paddingRight:"20px", paddingBottom:"20px"}}>
										<_RoleList style={{width:"100%"}} onSelectionChange={this.handleRoleChange.bind(this)} selectedRoles={this.state.roles} user={this.props.user}/>
									</Row>
									<Row>
											{emailActivation}
									</Row>
								</Col>
						</BoxBody>
						<BoxBody>
							{buttonUser}
						</BoxBody>
						<BoxFooter>
								© {dateJour.getFullYear()} - SAGA Application
						</BoxFooter>
					</Box>
				</Row>
		);
	}

	renderButtonAddUser(): React.ReactNode {
		return (
			<Row>
				<Col style={{textAlign:"center"}}>
					<Box fullHeight>
						<Button primary icon={EIcon.PERSON_ADD} loading={this.props.creating} onClick={this.props.onSubmit.bind(this)}>
						&nbsp;<strong>Créer le compte utilisateur</strong>
						</Button>
					</Box>
				</Col>
			</Row>
		);
	}

	renderButtonMajUser(): React.ReactNode {
		return (
			<Row>
				<Col style={{textAlign:"center"}}>
					<Box fullHeight>
						<Button primary icon={EIcon.PERSON_ADD} loading={this.props.creating} onClick={this.props.onSubmit.bind(this)}>
						&nbsp;<strong>Mettre à jour le compte utilisateur</strong>
						</Button>
					</Box>
				</Col>
			</Row>
		);
	}

}