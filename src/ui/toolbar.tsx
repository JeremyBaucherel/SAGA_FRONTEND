import './toolbar.css';
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as Store from '../sy/store';
import {Button, EIcon, Icon, Popover, EPosition, ETrigger, Menu, MenuItem, MenuSeparator, ButtonBar, Tooltip} from 'stk';
import logoall from "../../images/SAGA-logo-0.png";
import logoairbus from "../../images/Airbus-logo-black.png";
import * as Cookie from '../cookie';
import * as Common from '../sy/api/common';

interface IToolbarProps {
	children: JSX.Element[];
	user: Store.User | null;
	title?: string;
}

export class ToolbarComponent extends React.PureComponent<IToolbarProps> {

	constructor (props: IToolbarProps) {
		super(props);
	}

	render (): React.ReactNode {
		let version = Cookie.readString("version");

		let title = undefined;
		if (this.props.children) {
			if (this.props.children.length > 1) {
				title = this.props.children[0];
			} else if (this.props.children.length == 1) {
				title = this.props.children;
			}
		}
		if (title === undefined) {
			if (this.props.title === undefined) {
				title = (<ToolbarTitle><h1>Bienvenue dans l'application SAGA: Single Application to Govern All !</h1></ToolbarTitle>);
			} else {
				title = (<ToolbarTitle><h1>{this.props.title}</h1></ToolbarTitle>);
			}
		}

		return (
			<div id="page-toolbar">		
				<div id="page-toolbar-title-container">
					<div id="page-toolbar-title">
						<ReactRouterDOM.Link id="page-toolbar-title-logo" to="/" >
							<div>
								<img src={'/static/2022.06.01/' + logoall} height="25" />
							</div>
							<div id="page-toolbar-title-logo-name"><span id="page-toolbar-title-logo-version">V{version}</span></div>
						</ReactRouterDOM.Link>
						{title}
					</div>
					{this.renderProcessButton()}
					{ this.props.children && this.props.children.length > 1 ? this.props.children[1] : null}
					{this.renderUserButton()}
				</div>
				{ this.props.children && this.props.children.length > 2 ? this.props.children[2] : null}
			</div>
		);
	}

	renderProcessButton(): React.ReactNode {
		let isBook = Common.hasAuthorization(this.props.user, 'BOOK_DASHBOARD:DISPLAY');
        let isfilmotheque = Common.hasAuthorization(this.props.user, 'FILMOTHEQUE_DASHBOARD:DISPLAY');
        let isBluray = Common.hasAuthorization(this.props.user, 'BLURAY_DASHBOARD:DISPLAY');
        let isComptabilite = Common.hasAuthorization(this.props.user, 'COMPTABILITE_DASHBOARD:DISPLAY');

		let buttonBook = null;
		let buttonfilmotheque = null;
		let buttonBluray = null;
		let buttonComptabilite = null;
		if(isBook){buttonBook = (<Tooltip text="Bibliothèque personelle"><Button icon={EIcon.MENU_BOOK} secondary to="/book/dashboard" /></Tooltip>);}
		if(isfilmotheque){buttonfilmotheque = (<Tooltip text="Filmothèque personelle"><Button icon={EIcon.MOVIE} secondary to="/filmotheque/dashboard" /></Tooltip>);}
		if(isBluray){buttonBluray = (<Tooltip text="Gestion des Blu-ray"><Button icon={EIcon.MOVIE_FILTER} secondary to="/bluray/dashboard" /></Tooltip>);}
		if(isComptabilite){buttonComptabilite = (<Tooltip text="Gestion des comptes"><Button icon={EIcon.ACCOUNT_BALANCE} secondary to="/comptabilite/dashboard" /></Tooltip>);}

		return(
			<div style={{right:"300px", position: "fixed", width: '100px', textAlign: "right"}}>
				<ButtonBar>
					{buttonBook}
					{buttonfilmotheque}
					{buttonBluray}
					{buttonComptabilite}
				</ButtonBar>
			</div>
		);
	}

	renderUserButton (): React.ReactNode {
		let button = null;
		if (this.props.user) {

			let paramUserList = null;
			if(this.props.user && this.props.user.hasAuthorization('UTILISATEUR_ALL:DISPLAY'))
			{
				paramUserList = (<MenuItem key="user_list" to="/utilisateurs/afficher" icon={EIcon.PERSON} text="Liste des utilisateurs" />);
			}
			let paramRoleAut = null;
			if(this.props.user && this.props.user.hasAuthorization('ROLE_AUTORISATION:DISPLAY'))
			{
				paramRoleAut = (<MenuItem key="role_autorisation" to="/param/RoleAutorisation" icon={EIcon.LOCK} text="Rôles et Autorisations" />);
			}

			let paramGlobal = null;
			if(this.props.user && this.props.user.hasAuthorization('PARAMETRE_GLOBAL:DISPLAY'))
			{
				paramGlobal = (<MenuItem key="param_global" to="/parameters" icon={EIcon.SETTINGS} text="Paramètres généraux" />);
			}

			let sepGlobal = null;
			if(this.props.user && (this.props.user.hasAuthorization('PARAMETRE_GLOBAL:DISPLAY') || this.props.user.hasAuthorization('ROLE_AUTORISATION:DISPLAY') || this.props.user.hasAuthorization('RoutingGTI_DISPLAY')))
			{
				sepGlobal = (<MenuSeparator key="sepGlobal" />);
			}


			if(this.props.user.connecte)
			{
				button = (
					<Popover trigger={ETrigger.CLICK} position={EPosition.BOTTOM_RIGHT} width="210px">
						<Button flat icon={EIcon.MORE_HORIZ} />
						<Menu>
							<MenuItem key="user" to={this.props.user.url} icon={EIcon.ACCOUNT_CIRCLE}><strong>{this.props.user.prenom} {this.props.user.nom}</strong></MenuItem>
							{paramUserList}
							<MenuSeparator key="sepUser" />

							{paramRoleAut}
							{paramGlobal}
							{sepGlobal}

							<MenuItem key="bug" to={"mailto:jeremy.j.baucherel.external@airbus.com?subject=[SAGA] Bug"} icon={EIcon.BUG_REPORT}>Signaler un bug</MenuItem>
							<MenuItem key="improvement" to="https://gheprivate.intra.corp/SAGA/SAGA/issues" icon={EIcon.FEEDBACK}>Proposer une amélioration</MenuItem>
							<MenuItem key="information" to="/information" icon={EIcon.INFO}>Information</MenuItem>
							<MenuSeparator key="sepFin" />
							
							<MenuItem key="log-out" to="/utilisateurs/deconnexion" icon={EIcon.POWER_SETTINGS_NEW} text="Déconnexion" />
						</Menu>
					</Popover>
				);	
			}
		}

		return button;
	}
}

export const Toolbar = Store.withStore(ToolbarComponent);

export class ToolbarTitle extends React.PureComponent {
	render (): React.ReactNode {		
		return (			
			<div>{this.props.children}</div>
		);
	}
}

export class ToolbarTabs extends React.Component {
	render (): React.ReactNode {
		return (
			<div id="page-toolbar-tabs">{this.props.children}</div>
		);
	}
}

interface IToolbarTabProps {
	active: boolean;
	icon?: EIcon;
	label: string;
	to: string;
}

export class ToolbarTab extends React.Component<IToolbarTabProps, {}> {
	render (): React.ReactNode {
		let className = '';
		if (this.props.active === true) {
			className = 'page-toolbar-tab-active';
		}
		return (
			<ReactRouterDOM.Link className={className} to={this.props.to}>{this.props.icon ? (<Icon icon={this.props.icon} />) : ''}{this.props.label}</ReactRouterDOM.Link>
		);
	}
}

export class ToolbarButtons extends React.PureComponent {
	render (): React.ReactNode {
		return (
			<div id="page-toolbar-buttons">
				{this.props.children}
			</div>
		);
	}
}