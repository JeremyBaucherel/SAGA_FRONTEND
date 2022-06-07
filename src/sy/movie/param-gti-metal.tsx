import * as React from 'react';
import {Page, PageBody, SpreadsheetColumn} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import {ProcessTabsMetal, MetalTabs} from '../../ui/process-tabs-metal';
import {ParamProcess} from '../shared/param-process';
import * as Common from '../api/common';
import {UnexpectedErrorAlert} from '../error-page';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {Spinner} from 'stk';

interface ParamProps {
	user?: Store.User;
}

interface ParamState {
	resultAdd: any;
	requestStatusAdd: Common.ECallStatus;
	addRow: number;
}

export class ParamComp extends React.PureComponent<ParamProps, ParamState> {

	constructor (props: ParamProps) {
		super(props);

		this.state = {
			resultAdd: {},
			requestStatusAdd: Common.ECallStatus.NOT_STARTED,
			addRow:0,
		}

		this.handleAddCell = this.handleAddCell.bind(this);
	}

	handleAddCell(addRow:any){
		/* Lance enregistrement dans la database */
		this.setState({requestStatusAdd: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'ParamGTI', 'add']);
		Common.postAsJson(url_, {process: "METALLISATION", authorization:"METAL_PARAM:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

		this.setState({addRow:this.state.addRow + 1})
	}
	
	receiveDataAdd (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusAdd: Common.ECallStatus.OK,
			resultAdd: myresult,	
		});
	}

	receiveDataError (resp: Common.IResponse<any>): void {
		let myresult = resp.errors;
		this.setState({
			requestStatusAdd: Common.ECallStatus.NOK,
			resultAdd: myresult,
		});
	}

	render (): React.ReactNode {
		let col = [
			new SpreadsheetColumn("GTI", "GTI", 50, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("DocType", "DocType", 20, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("Part", "Part", 20, "menu", "int,positive", true, false, true, true, true),
			new SpreadsheetColumn("Gamme", "Gamme", 50, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("cptGrGam", "CptGrGam", 20, "menu", "int,positive", true, false, true, true, true),
			new SpreadsheetColumn("Operation", "Operation", 20, "menu", "int,positive", true, false, true, true, true),
			new SpreadsheetColumn("nbDigitMsnSap", "NbDigitMsnSap", 20, "menu", "int,positive", true, false, true, true, true),
			new SpreadsheetColumn("groupeGestionnaire", "Groupe Gestionnaire", 20, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("DesignationsCSV", "Designations CSV", 50, "text", "text", true, false, false, true, false),
			new SpreadsheetColumn("Section", "Section", 50, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("Libelle", "Libelle", 50, "text", "text", true, false, false, true, false),
			new SpreadsheetColumn("NumDocMsn", "NumDocMsn", 20, "menu", "int", true, false, true, true, true),
			new SpreadsheetColumn("pvnameCSV", "Pvname CSV", 50, "text", "text", true, false, false, true, false),
			new SpreadsheetColumn("pvnamePDF", "Pvname PDF", 50, "text", "text", true, false, false, true, true),
			new SpreadsheetColumn("folderpv", "Folder PV", 50, "text", "text", true, false, false, true, true),
			new SpreadsheetColumn("Zone", "Zone", 50, "menu", "text", true, false, true, true, false),
			new SpreadsheetColumn("Langue", "Langue", 20, "menu", "text", true, false, true, true, true),
			new SpreadsheetColumn("LongTitle", "LongTitle", 50, "text", "text", true, false, false, true, false),
			new SpreadsheetColumn("ShortTitle", "ShortTitle", 50, "text", "text", true, false, false, true, false),
			new SpreadsheetColumn("creationStatut", "Actif", 20, "menu", "boolean", true, false, true, true, false),
		];

		let title="Paramétrage GTI - Process Métallisation";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = (this.renderRefreshing());
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert error={this.state.resultAdd}/>);
		} else if (this.props.user && this.props.user.hasAuthorization("METAL:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("METAL_PARAM:ADD")){
				add = true;
			}
			pageBody = (
					<ParamProcess 
						url={['api', 'param', 'gti']} 
						urlEdit={['api', 'param', 'ParamGTI', 'edit']}  
						urlDel={['api', 'param', 'ParamGTI', 'del']} 
						authorization={"METAL:DISPLAY"}
						authorizationEdit={"METAL_PARAM:EDIT"}
						authorizationDel={"METAL_PARAM:DEL"}
						process={"METALLISATION"}
						pageTitle={title} 
						col={col}
						rowIndex={["id"]} 
						style={{textAlign:"left"}}
						add={add}
						onAddCell={this.handleAddCell}
					/>);
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (<Page title={title}>
			<Toolbar>
				<ToolbarTitle>
					<h1>{title}</h1>
				</ToolbarTitle>
				<ToolbarButtons></ToolbarButtons>
				<ProcessTabsMetal activeTab={MetalTabs.PARAMGTI} />
			</Toolbar>
			
			<PageBody fullWidth>
				{pageBody}
			</PageBody>
			</Page>);
	}

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}
}

export const ParamGtiMetal = Store.withStore(ParamComp);
