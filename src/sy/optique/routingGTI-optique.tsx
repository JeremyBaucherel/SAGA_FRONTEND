import * as React from 'react';
import {Page, PageBody, BoxHeading, SpreadsheetColumn, Box, BoxBody, BoxFooter, Row, Spreadsheet} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import * as Common from '../api/common';
import {UnexpectedErrorAlert} from '../error-page';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {Spinner} from 'stk';
import {ProcessTabsOptique, OptiqueTabs} from '../../ui/process-tabs-optique';

interface ParamProps {
	user?: Store.User;
}

interface ParamState {
    result: any;
    filter_default: any;
    requestStatus: Common.ECallStatus;
    selectedRow: number;
	resultAdd: any;
	requestStatusAdd: Common.ECallStatus;
    resultSave: any;
    requestStatusSave: Common.ECallStatus;
    resultDel: any;
    requestStatusDel: Common.ECallStatus;
	addRow: number;
}

export class ParamComp extends React.PureComponent<ParamProps, ParamState> {

    listeChoixPGM = [{"id" :1, "text": "A320"},{"id": 2, "text": "A330"}, {"id": 3, "text": "A350"}, {"id": 4, "text": "A400M"}]
    listePATC = [{"id" : 1, "text": "PA"}, {"id": 2, "text": "TC"}]
    listeProcess = [{"id" : 1, "text": "COMS"}, {"id" : 2, "text": "ESN"}, {"id" : 3, "text": "FIBREOPTIQUE"}, {"id" : 4, "text": "METALLISATION"}]     // A aller chercher en BDD
    listeStatut =  [{"id" : 1, "text": "Supprimé"}, {"id" : 2, "text": "Pre-production"}, {"id" : 3, "text": "Production"}, {"id" : 4, "text": "Test"}] // A aller chercher en BDD

	constructor (props: ParamProps) {
		super(props);

		this.state = {
            result: {},
			filter_default: {},
			requestStatus: Common.ECallStatus.RUNNING,
            selectedRow:-1,
			resultAdd: {},
			requestStatusAdd: Common.ECallStatus.NOT_STARTED,
            resultSave: {},
            requestStatusSave: Common.ECallStatus.NOT_STARTED,
            resultDel: {},
            requestStatusDel: Common.ECallStatus.NOT_STARTED,
			addRow:0,
		}
		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleAddCell = this.handleAddCell.bind(this);
        this.handleDelCell = this.handleDelCell.bind(this);
        this.handleSaveCell = this.handleSaveCell.bind(this);
        this.recupTextItems = this.recupTextItems.bind(this);
        this.recupIdItems = this.recupIdItems.bind(this);
	}

	componentDidMount (): void {
		this.requestData();
	}

    requestData (): void {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'RoutingGTI']);
        Common.postAsJson(url_, {process:"FIBREOPTIQUE", authorization:"RoutingGTI:DISPLAY"}, this.receiveData.bind(this), this.receiveDataError.bind(this));
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

	handleAddCell(addRow:any){
        /* Pour les 4 colonnes avec menu liste on prend la valeur text et non l'id pour l'enregistrement sauf pour le statut */
        addRow["PGM"] = this.recupTextItems(addRow["PGM"], this.listeChoixPGM);
        addRow["PA_TC"] = this.recupTextItems(addRow["PA_TC"], this.listePATC);
        addRow["processName"] = this.recupTextItems(addRow["processName"], this.listeProcess);

		/* Lance enregistrement dans la database */
		this.setState({requestStatusAdd: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'RoutingGTI', 'add']);
		Common.postAsJson(url_, {authorization:"RoutingGTI:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataAddError.bind(this));

		this.setState({addRow:this.state.addRow + 1})
	}
	
	receiveDataAdd (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusAdd: Common.ECallStatus.OK,
			resultAdd: myresult,	
		});
	}

	receiveDataAddError (): void {
		this.setState({
			requestStatusAdd: Common.ECallStatus.NOK,
			resultAdd:[]
		});
	}

    handleSaveCell(saveRows:any){
        /* Pour les 4 colonnes avec menu liste on prend la valeur text et non l'id pour l'enregistrement sauf pour le statut */
        for(let el in saveRows){
            if(saveRows[el]['columnName'] == "PGM"){
                saveRows[el]['value'] = this.recupTextItems(saveRows[el]['value'], this.listeChoixPGM);
            }else if(saveRows[el]['columnName'] == "PA_TC"){
                saveRows[el]['value'] = this.recupTextItems(saveRows[el]['value'], this.listePATC);
            }else if(saveRows[el]['columnName'] == "processName"){
                saveRows[el]['value'] = this.recupTextItems(saveRows[el]['value'], this.listeProcess);
            }
        }

		/* Lance enregistrement dans la database */
		this.setState({requestStatusSave: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'RoutingGTI', 'edit']);
		Common.postAsJson(url_, {authorization:"RoutingGTI:EDIT", saveRows:saveRows}, this.receiveDataSave.bind(this), this.receiveDataSaveError.bind(this));

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
		let url_ = new Common.Url(['api', 'param', 'RoutingGTI', 'del']);
		Common.postAsJson(url_, {authorization:"RoutingGTI:DEL", RowsId:RowsId}, this.receiveDataDel.bind(this), this.receiveDataDelError.bind(this));

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

	handleClickRow(rowIndex: any, ifSelectedRow:boolean){
		if(ifSelectedRow){
			this.setState({selectedRow: -1})
		}else{
			this.setState({selectedRow: rowIndex[0]})
		}
	}

    recupTextItems(id:number, listeItems:any):string{
        for(let item in listeItems){
            if(listeItems[item]["id"] == id){
                return listeItems[item]["text"];
            }
        }
        return "";
    }

    recupIdItems(text:string, listeItems:any):number[]{
        for(let item in listeItems){
            if(listeItems[item]["text"] == text){
                return [listeItems[item]["id"]];
            }
        }
        return [0]
    }

	render (): React.ReactNode {
		let pageBody: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization('RoutingGTI:DISPLAY')) {
			pageBody = this.renderParam();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}
        let title="Paramètres des Gammes GTI";
		return (
			<Page title={title}>
				<Toolbar>
					<ToolbarTitle>
						<h1>{title}</h1>
                    </ToolbarTitle>
					<ToolbarButtons></ToolbarButtons>
                    <ProcessTabsOptique activeTab={OptiqueTabs.ROUTINGGTI} />
				</Toolbar>
				<PageBody fullWidth>{pageBody}</PageBody>
			</Page>
		);
	}

	renderParam (): React.ReactNode {

		let col = [
			new SpreadsheetColumn('Gamme', 'Gamme', 250, "text", "text", true, true, undefined, undefined, false, true, true),
			new SpreadsheetColumn('CptGrpGamme', 'Cpt Gr Gamme', 100, "menu", "text", true, true, undefined, undefined, false, true, true),
			new SpreadsheetColumn('DescriptionSAP', 'Description SAP', 800, "text", "text", true, true, undefined, undefined, false, true, false),
			new SpreadsheetColumn('PGM', 'PGM', 100, "menu", "liste", true, true, undefined, undefined, true, true, true, this.listeChoixPGM),
			new SpreadsheetColumn('PA_TC', 'PA / TC', 100, "menu", "liste", true, true, undefined, undefined, false, true, true, this.listePATC),
            new SpreadsheetColumn('processName', 'Process', 100, "menu", "liste", true, true, undefined, undefined, true, true, true, this.listeProcess),
            new SpreadsheetColumn('statut', 'Statut', 100, "menu", "liste", true, true, undefined, undefined, true, true, true, this.listeStatut),
		];

		let row = Common.copy(this.state.result);
		let dateJour = new Date();

        let add:boolean = false;
        let edit:boolean = false;
        let del:boolean = false;
        if(this.props.user && this.props.user.hasAuthorization("RoutingGTI:ADD")){add = true;}
        if(this.props.user && this.props.user.hasAuthorization("RoutingGTI:EDIT")){edit = true;}
        if(this.props.user && this.props.user.hasAuthorization("RoutingGTI:DEL")){del = true;}

		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
					<BoxHeading></BoxHeading>
					<BoxBody style={{textAlign:"center"}}>
						<Spreadsheet 
								filter_default={this.state.filter_default}
								columns={col} 
								rows={row} 
								rowIndex={["id"]} 
                                infoSupp = {true}
                                onSaveCell={this.handleSaveCell}
                                onClickRow={this.handleClickRow}
                                onAddCell={this.handleAddCell}
                                onDelCell={this.handleDelCell}
                                edit={edit}
                                add={add}
                                delete={del}
								selectedRow={this.state.selectedRow}
							/>
					</BoxBody>
					<BoxFooter>
						© {dateJour.getFullYear()} - ASGARD Application
					</BoxFooter>
				</Box>
			</Row>
		);
	}

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}
}

export const RoutingGTIOptique = Store.withStore(ParamComp);
