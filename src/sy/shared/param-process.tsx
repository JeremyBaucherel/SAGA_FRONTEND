import * as React from 'react';
import * as Store from '../store';
import {Row, Spreadsheet, SpreadsheetColumn, Box, BoxHeading, BoxBody, Spinner, Button, EIcon, BoxFooter} from 'stk';
import * as Common from '../api/common';
import {UnexpectedErrorAlert} from '../error-page';
import {NotAuthorizedAlert} from '../not-authorized-page';

interface ParamProcessProps {
	user?: Store.User;
	url: string[];
	urlEdit: string[];
	urlDel: string[];
	authorization: string;
	authorizationEdit: string;
	authorizationDel: string;
	process: string;
    pageTitle: string;
    col: SpreadsheetColumn[];
    rowIndex: string[];
    style?: any;
	add?: boolean;
	onAddCell?: any;
	urlRetour?: string;
}

interface ParamProcessState {
	result: any;
	resultSave: any;
	resultDel: any;
	requestStatus: Common.ECallStatus;
	requestStatusSave: Common.ECallStatus;
	requestStatusDel: Common.ECallStatus;
	selectedRow: number;
}

export class ParamProcessComp extends React.PureComponent<ParamProcessProps, ParamProcessState> {

	constructor (props: ParamProcessProps) {
		super(props);

		this.state = {
			result: {},
			resultSave: {},
			resultDel: {},
			requestStatus: Common.ECallStatus.RUNNING,
			requestStatusSave: Common.ECallStatus.RUNNING,
			requestStatusDel: Common.ECallStatus.RUNNING,
			selectedRow:-1,
		}

		this.handleSaveCell = this.handleSaveCell.bind(this);
		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleDelCell = this.handleDelCell.bind(this);
	}

	componentDidMount (): void {
		this.requestData ()
	}

    requestData (): void 
    {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(this.props.url);
		Common.postAsJson(url_, {process: this.props.process, authorization:this.props.authorization}, this.receiveData.bind(this), this.receiveDataError.bind(this));
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

	handleClickRow(rowIndex: any, ifSelectedRow:boolean){
		if(ifSelectedRow){
			this.setState({selectedRow: -1})
		}else{
			this.setState({selectedRow: rowIndex[0]})
		}
	}

	handleSaveCell(saveRows:any){
		console.log(saveRows)
		/* Lance enregistrement dans la database */
		this.setState({requestStatusSave: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(this.props.urlEdit);
		Common.postAsJson(url_, {process: this.props.process, authorization:this.props.authorizationEdit, saveRows:saveRows}, this.receiveDataSave.bind(this), this.receiveDataSaveError.bind(this));

		this.requestData();
	}
	
	receiveDataSave (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusSave: Common.ECallStatus.OK,
			resultSave: myresult,	
		});
	}

	receiveDataSaveError (): void {
		this.setState({
			requestStatusSave: Common.ECallStatus.NOK,
			resultSave:[]
		});
	}

	handleDelCell(RowsId:number){
		/* Lance la suppresion dans la database */
		this.setState({requestStatusDel: Common.ECallStatus.RUNNING});
		let url_ = new Common.Url(this.props.urlDel);
		Common.postAsJson(url_, {process: this.props.process, authorization:this.props.authorizationDel, RowsId:RowsId}, this.receiveDataDel.bind(this), this.receiveDataDelError.bind(this));

		this.requestData();
	}

	receiveDataDel (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusDel: Common.ECallStatus.OK,
			resultDel: myresult,	
		});
	}

	receiveDataDelError (): void {
		this.setState({
			requestStatusDel: Common.ECallStatus.NOK,
			resultDel:[]
		});
	}

	render (): React.ReactNode {

		let pageBody: React.ReactNode = '';

		let row = Common.copy(this.state.result);

		if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization(this.props.authorization)) {
			let edit:boolean = false;
			let del:boolean = false;
			if(this.props.user.hasAuthorization(this.props.authorizationEdit)){
				edit = true;
			}
			if(this.props.user.hasAuthorization(this.props.authorizationDel)){	
				del = true;
			}
			let urlRetour;
			if(this.props.urlRetour){
				urlRetour = (<div style={{textAlign:"right", flex: "auto"}}><Button to={this.props.urlRetour} tooltip="Retour" icon={EIcon.ARROW_BACK} secondary></Button></div>)
			}
			let dateJour = new Date();
			pageBody = (<Row fullHeight>
							<Box style={{width:"100%"}}>
								<BoxHeading>
									{urlRetour}
								</BoxHeading>
								<BoxBody style={this.props.style}>
								
									<Spreadsheet 
										columns={this.props.col} 
										rows={row} 
										rowIndex={this.props.rowIndex}
										infoSupp={true}
										onSaveCell={this.handleSaveCell}
										onClickRow={this.handleClickRow}
										onAddCell={this.props.onAddCell}
										onDelCell={this.handleDelCell}
										edit={edit}
										add={this.props.add}
										delete={del}
										selectedRow={this.state.selectedRow}
									/>
								</BoxBody>
								<BoxFooter>
									© {dateJour.getFullYear()} - ASGARD Application
								</BoxFooter>
							</Box>
						</Row>);
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

export const ParamProcess = Store.withStore(ParamProcessComp);
