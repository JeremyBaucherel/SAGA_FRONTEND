import * as React from 'react';
import {Page, PageBody} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import * as Common from '../api/common';
import {UnexpectedErrorAlert} from '../error-page';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {EIcon, Spinner, Box, BoxHeading, BoxFooter, BoxBody, Col, Row, FormList, ButtonBar, Button, Padding} from 'stk';

interface ParamProps {
	user?: Store.User;
}

interface ParamState {
	result: any;
	requestStatus: Common.ECallStatus;
	resultAut: any;
	requestStatusAut: Common.ECallStatus;
	resultAutEdit: any;
	requestStatusAutEdit: Common.ECallStatus;
	resultRole: any;
	requestStatusRole: Common.ECallStatus
}

export class RoleAutorisationComp extends React.PureComponent<ParamProps, ParamState> {

	constructor (props: ParamProps) {
		super(props);

		this.state = {
			result: {},
			requestStatus: Common.ECallStatus.NOT_STARTED,
			resultAut: {},
			requestStatusAut: Common.ECallStatus.NOT_STARTED,
			resultAutEdit: {},
			requestStatusAutEdit: Common.ECallStatus.NOT_STARTED,
			resultRole: {},
			requestStatusRole: Common.ECallStatus.NOT_STARTED,
		}
	}

	componentDidMount (): void {
		this.requestData();
		this.requestDataAutorisation();
		this.requestDataRole();
	}

	requestData(){
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'role-autorisation']);
		Common.getJson(url_, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}
	
	receiveData (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatus: Common.ECallStatus.OK,
			result: myresult,	
		});
	}

	receiveDataError (): void {
		this.setState({
			requestStatus: Common.ECallStatus.NOK,
			result:[]
		});
	}

	requestDataAutorisation(){
		this.setState({requestStatusAut: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'Autorisation']);
		Common.postAsJson(url_, {authorization: "ROLE_AUTORISATION:DISPLAY"}, this.receiveDataAut.bind(this), this.receiveDataAutError.bind(this));
	}
	
	receiveDataAut (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusAut: Common.ECallStatus.OK,
			resultAut: myresult,	
		});
	}

	receiveDataAutError (): void {
		this.setState({
			requestStatusAut: Common.ECallStatus.NOK,
			resultAut:[]
		});
	}

	requestDataRole(){
		this.setState({requestStatusRole: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'Role']);
		Common.postAsJson(url_, {authorization: "ROLE_AUTORISATION:DISPLAY"}, this.receiveDataRole.bind(this), this.receiveDataRoleError.bind(this));
	}
	
	receiveDataRole (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusRole: Common.ECallStatus.OK,
			resultRole: myresult,	
		});
	}

	receiveDataRoleError (): void {
		this.setState({
			requestStatusRole: Common.ECallStatus.NOK,
			resultRole:[]
		});
	}

	onSelectionChange(value: number[], id_role:number): void{
		this.setState({requestStatusAutEdit: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'role-autorisation', 'edit']);
		Common.postAsJson(url_, {id_role: id_role, value: value, authorization: "ROLE_AUTORISATION:EDIT"}, this.receiveDataAutEdit.bind(this), this.receiveDataAutEditError.bind(this));
	}

	receiveDataAutEdit (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusAutEdit: Common.ECallStatus.OK,
			resultAutEdit: myresult,	
		});
	}

	receiveDataAutEditError (): void {
		this.setState({
			requestStatusAutEdit: Common.ECallStatus.NOK,
			resultAutEdit:[]
		});
	}

	getTabIdAut(id_role:number): any {
		let result = this.state.result;
		for(let r in result){
			if(result[r].id_role == id_role){
				return result[r].tabIdAut;
			}
		}
		return [];
	}

	render (): React.ReactNode {

		let title="Roles et Autorisations";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING || this.state.requestStatusAut == Common.ECallStatus.RUNNING  || this.state.requestStatusRole == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK || this.state.requestStatusAut == Common.ECallStatus.NOK || this.state.requestStatusRole == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization("ROLE_AUTORISATION:DISPLAY")) {

			let disabled = true;
			if(this.props.user && this.props.user.hasAuthorization("ROLE_AUTORISATION:EDIT")){
				disabled = false;
			}
	
			var resultRole = this.state.resultRole;
			var rolecomp = [];
			var tabIdAut = [];
			
			for(let role in resultRole){
				tabIdAut = this.getTabIdAut(resultRole[role].id);
				rolecomp.push(<Col key={role}>
								<Box fullHeight>
									<BoxBody padding={Padding.Small}>
										<FormList
											items={this.state.resultAut}
											label={resultRole[role].nom}
											enableMultiSelection={true}
											onSelectionChange={(value) => this.onSelectionChange.bind(this)(value, resultRole[role].id)}
											value={tabIdAut}
											disabled={disabled}
											style={{height:'95%'}}
											/>
									</BoxBody>
								</Box>
							</Col>)
			}
			let buttonBarRoleAut;
			let buttonBarRole;
			let buttonBarAut;
			if(this.props.user && this.props.user.hasAuthorization("ROLE:DISPLAY")){
				buttonBarRole = (<Button to={'./Role'} icon={EIcon.PERSON_PIN} secondary>&nbsp;Gestion des Rôles</Button>)
			}
			if(this.props.user && this.props.user.hasAuthorization("AUTORISATION:DISPLAY")){
				buttonBarAut = (<Button to={'./Autorisation'} icon={EIcon.VPN_KEY} secondary>&nbsp;Gestion des Autorisations</Button>)
			}
			buttonBarRoleAut = (<Row style={{backgroundColor: "#FFFFFF", padding:"10px 0px 0px 20px"}}>
									{buttonBarRole}	
									{buttonBarAut}		
								</Row>)
			let dateJour = new Date();
			pageBody = (
					<Page title={title}>
						<Toolbar>
							<ToolbarTitle>
								<h1>{title}</h1>
							</ToolbarTitle>
							<ToolbarButtons></ToolbarButtons>
						</Toolbar>
						<PageBody fullWidth>
							<Row fullHeight>
								<Box style={{width:"100%"}}>
									<BoxHeading>{buttonBarRoleAut}</BoxHeading>
									<BoxBody>
										<Row style={{height:"98%"}}>{rolecomp}</Row>
									</BoxBody>
									<BoxFooter>
										© {dateJour.getFullYear()} - ASGARD Application
									</BoxFooter>
								</Box>
							</Row>
						</PageBody>
					</Page>);
				} else {
					pageBody = (<NotAuthorizedAlert />);
				}
		
				return (pageBody);
			}
		
			renderRefreshing (): React.ReactNode {
				return (
					<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Spinner />
					</div>
				);
			}
		}
		
export const RoleAutorisation = Store.withStore(RoleAutorisationComp);
