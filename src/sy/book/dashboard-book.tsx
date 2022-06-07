import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {EIcon, EPosition, Page, ETrigger, PageBody, Row, Button, ButtonBar, Spreadsheet, SpreadsheetColumn, Box, Padding, BoxBody, BoxFooter, Spinner, Popover, Tooltip} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Common from '../api/common';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';
import * as Store from '../store';
import {ProcessTabsBook, BookTabs} from '../../ui/process-tabs-Book';
import * as DateUtils from '../../date-utils';

interface DashboardProps {
	user?: Store.User;
}

interface IDashboardState {
	result: any;
	resultSave: any;
	resultAdd: any;
	resultDel: any;

	resultMenuType: any;
	resultMenuSaga: any;
	resultMenuPublishing: any;
	resultMenuOwner: any;
	resultMenuLocation: any;

	filter_default: any;

	requestStatus: Common.ECallStatus;
	requestStatusSave: Common.ECallStatus;
	requestStatusDel: Common.ECallStatus;
	requestStatusAdd: Common.ECallStatus;

	requestStatusMenuType: Common.ECallStatus;
	requestStatusMenuSaga: Common.ECallStatus;
	requestStatusMenuPublishing: Common.ECallStatus;
	requestStatusMenuOwner: Common.ECallStatus;
	requestStatusMenuLocation: Common.ECallStatus;

	selectedRow: number;
}

export class DashboardBookComp extends React.PureComponent<DashboardProps, IDashboardState> {

	constructor (props: DashboardProps) {
		super(props);

		this.state = {
			result: {},
			resultSave: {},
			resultAdd: {},
			resultDel: {},

			resultMenuType: {},
			resultMenuSaga: {},
			resultMenuPublishing: {},
			resultMenuOwner: {},
			resultMenuLocation: {},

			filter_default: {},

			requestStatus: Common.ECallStatus.NOT_STARTED,
			requestStatusSave: Common.ECallStatus.NOT_STARTED,
			requestStatusDel: Common.ECallStatus.NOT_STARTED,
			requestStatusAdd: Common.ECallStatus.NOT_STARTED,

			requestStatusMenuType: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuSaga: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuPublishing: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuOwner: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuLocation: Common.ECallStatus.NOT_STARTED,

			selectedRow:-1,
		};

		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleResetFilter = this.handleResetFilter.bind(this);
		this.handleDefineFilterDefault = this.handleDefineFilterDefault.bind(this);

		this.handleAddCell = this.handleAddCell.bind(this);
		this.handleSaveCell = this.handleSaveCell.bind(this);
		this.handleDelCell = this.handleDelCell.bind(this);
	}
	
	componentDidMount (): void {
		this.requestData();
		this.requestMenuType();
		this.requestMenuSaga();
		this.requestMenuPublishing();
		this.requestMenuOwner();
		this.requestMenuLocation();
	}

	// Requète bibliothèque
    requestData (): void {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'dashboard']);
        Common.getJson(url_, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	receiveData (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatus: Common.ECallStatus.OK,
			result: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveDataError (): void {
		this.setState({
			requestStatus: Common.ECallStatus.NOK,
			result:[]
		});
	}

	// Menu Type
	requestMenuType (): void {
		this.setState({requestStatusMenuType: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'liste', 'type']);
		Common.postAsJson(url_, {authorization:"BOOK:DISPLAY"}, this.receiveMenuType.bind(this), this.receiveMenuTypeError.bind(this));
	}

	receiveMenuType (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuType: Common.ECallStatus.OK,
			resultMenuType: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuTypeError (): void {
		this.setState({
			requestStatusMenuType: Common.ECallStatus.NOK,
			resultMenuType:[]
		});
	}

	// Menu SAGA
	requestMenuSaga (): void {
		this.setState({requestStatusMenuSaga: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'liste', 'saga']);
		Common.postAsJson(url_, {authorization:"BOOK:DISPLAY"}, this.receiveMenuSaga.bind(this), this.receiveMenuSagaError.bind(this));
	}

	receiveMenuSaga (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuSaga: Common.ECallStatus.OK,
			resultMenuSaga: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuSagaError (): void {
		this.setState({
			requestStatusMenuSaga: Common.ECallStatus.NOK,
			resultMenuSaga:[]
		});
	}

	// Menu Publishing
	requestMenuPublishing (): void {
		this.setState({requestStatusMenuPublishing: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'liste', 'publishing']);
		Common.postAsJson(url_, {authorization:"BOOK:DISPLAY"}, this.receiveMenuPublishing.bind(this), this.receiveMenuPublishingError.bind(this));
	}

	receiveMenuPublishing (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuPublishing: Common.ECallStatus.OK,
			resultMenuPublishing: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuPublishingError (): void {
		this.setState({
			requestStatusMenuPublishing: Common.ECallStatus.NOK,
			resultMenuPublishing:[]
		});
	}

	// Menu Owner
	requestMenuOwner (): void {
		this.setState({requestStatusMenuOwner: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'liste', 'owner']);
		Common.postAsJson(url_, {authorization:"BOOK:DISPLAY"}, this.receiveMenuOwner.bind(this), this.receiveMenuOwnerError.bind(this));
	}

	receiveMenuOwner (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuOwner: Common.ECallStatus.OK,
			resultMenuOwner: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuOwnerError (): void {
		this.setState({
			requestStatusMenuOwner: Common.ECallStatus.NOK,
			resultMenuOwner:[]
		});
	}

	// Menu Location
	requestMenuLocation (): void {
		this.setState({requestStatusMenuLocation: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'liste', 'location']);
		Common.postAsJson(url_, {authorization:"BOOK:DISPLAY"}, this.receiveMenuLocation.bind(this), this.receiveMenuLocationError.bind(this));
	}

	receiveMenuLocation (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuLocation: Common.ECallStatus.OK,
			resultMenuLocation: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuLocationError (): void {
		this.setState({
			requestStatusMenuLocation: Common.ECallStatus.NOK,
			resultMenuLocation:[]
		});
	}

	// action si Click sur ligne tableau
	handleClickRow(rowIndex: any, ifSelectedRow:boolean){
		if(ifSelectedRow){
			this.setState({selectedRow: -1})
		}else{
			this.setState({selectedRow: rowIndex[0]})
		}
	}

	render (): React.ReactNode {
		let pageBody: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING || this.state.requestStatusMenuType == Common.ECallStatus.RUNNING || 
			this.state.requestStatusMenuSaga == Common.ECallStatus.RUNNING || this.state.requestStatusMenuPublishing == Common.ECallStatus.RUNNING ||
			this.state.requestStatusMenuOwner == Common.ECallStatus.RUNNING || this.state.requestStatusMenuLocation == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK || this.state.requestStatusMenuType == Common.ECallStatus.NOK || 
			this.state.requestStatusMenuSaga == Common.ECallStatus.NOK || this.state.requestStatusMenuPublishing == Common.ECallStatus.NOK ||
			this.state.requestStatusMenuOwner == Common.ECallStatus.NOK || this.state.requestStatusMenuLocation == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization('BOOK:DISPLAY')) {
			pageBody = this.renderDashboard();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (
			<Page title="Dashboard Fibre Book">
				<Toolbar>
					<ToolbarTitle>
						<h1>Bibliothèque - Dashboard</h1>
                    </ToolbarTitle>
					<ToolbarButtons></ToolbarButtons>
					<ProcessTabsBook activeTab={BookTabs.DASHBOARD} />
				</Toolbar>
				<PageBody fullWidth>{pageBody}</PageBody>
			</Page>
		);
	}

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}

	handleResetFilter(){
		this.handleDefineFilterDefault();
	}

	handleDefineFilterDefault(){
		this.setState({filter_default: {"name_owner":["Jérémy","A acheter"]}});
	}

	handleSaveCell(saveRows:any){
		console.log(saveRows)
		/* Lance enregistrement dans la database */
		this.setState({requestStatusSave: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'dashboard', 'edit']);
		Common.postAsJson(url_, {process: "Bibliothèque", authorization:"BOOK_DASHBOARD:EDIT", saveRows:saveRows}, this.receiveDataSave.bind(this), this.receiveDataSaveError.bind(this));

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

	handleDelCell(delRow:any){
		/* Lance suppression dans la database */
		this.setState({requestStatusDel: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'dashboard', 'del']);
		Common.postAsJson(url_, {process: "Bibliothèque", authorization:"BOOK_DASHBOARD:DEL", delRow:delRow}, this.receiveDataDel.bind(this), this.receiveDataDelError.bind(this));

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

	handleAddCell(addRow:any){
		/* Lance l'ajout dans la database */
		this.setState({requestStatusAdd: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'book', 'dashboard', 'add']);
		Common.postAsJson(url_, {process: "Bibliothèque", authorization:"BOOK_DASHBOARD:DEL", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataAddError.bind(this));

		this.requestData();
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

	renderDashboard (): React.ReactNode {
		console.log(this.state.resultMenuSaga)
		let col = [
			new SpreadsheetColumn('name_type', "Catégorie", 50, "menu", "liste", true, true, true, true, true, this.state.resultMenuType),
			new SpreadsheetColumn('name_saga', "Saga", 120, "menu", "liste", true, true, false, true, false, this.state.resultMenuSaga),
			new SpreadsheetColumn('number', "Numéro", 85, "text", "text", true, true, false, true, false),
			new SpreadsheetColumn('name', "Nom", 120, "text", "text", true, true, false, true, true),
			new SpreadsheetColumn("name_book_publishing", "Maison d'édition", 150, "text", "liste", true, true, false, true, false, this.state.resultMenuPublishing),
			new SpreadsheetColumn('name_owner', "Propriétaire", 150, "menu", "liste", true, true, true, true, true, this.state.resultMenuOwner),
			new SpreadsheetColumn('name_location', "Localisation", 150, "menu", "liste", true, true, true, true, false, this.state.resultMenuLocation),
		];

		/*
		id: int
        id_type: int
        name_type: str
        id_saga: int
        name_saga: str
        number: str
        name: int
        id_book_publishing: int
        name_book_publishing: bool
        id_owner: int
        name_owner: str
        id_location: int
        name_location: str
		*/
		let row = Common.copy(this.state.result);
		let dateJour = new Date();
		/*
		

		let tab_gamme = [];
		let tab_cptGrGam = [];
		let nb_MSN_Calcules = 0;
		let nb_MSN_OK = 0;
		let nb_MSN_KO = 0;
		let nb_MSN_Retard = 0;

		// Définition des styles
		for(var ligne in row)
		{
			let dateEntreeStation = row[ligne]['Date entrée station'];
			let dateEntreeStationFormate = null;
			if(dateEntreeStation != null)
			{
				dateEntreeStationFormate = DateUtils.parseDateDatabase(dateEntreeStation);
			}else{
				dateEntreeStationFormate = new Date(1900, 0, 1, 0, 0);
			}

			// Colonne Date
			let dateJourCompare = dateJour.getFullYear() + "-" + String(dateJour.getMonth() + 1).padStart(2, '0') + "-" + String(dateJour.getDate()).padStart(2, '0');
			row[ligne]['Date Prépa SAP'] = this.renderDateColor(row[ligne]['Date Prépa SAP'], dateJourCompare);
			row[ligne]['Date Ajout OF'] = this.renderDateColor(row[ligne]['Date Ajout OF'], dateJourCompare);
			row[ligne]['Date Maj PV'] = this.renderDateColor(row[ligne]['Date Maj PV'], dateJourCompare);
			row[ligne]['Date entrée station'] = this.renderDateBold(row[ligne]['Date entrée station'], dateJourCompare);

			// Tableau listant les gammes et Compteurs
			tab_gamme.push(row[ligne]['Gamme']);
			tab_cptGrGam.push(row[ligne]['CptGrGam']);

			nb_MSN_Calcules = nb_MSN_Calcules + 1;
		}

		// Garde les valeurs uniques
		tab_gamme = Array.from(new Set(tab_gamme)).sort();
		tab_cptGrGam = Array.from(new Set(tab_cptGrGam)).sort();
		*/
		let bandeau_recap = (this.renderBandeauRecap(0,0,0,0));

		let edit:boolean = false;
		let del:boolean = false;
		let add:boolean = false;
		if(this.props.user && this.props.user.hasAuthorization("BOOK_DASHBOARD:EDIT")){
			edit = true;
		}
		if(this.props.user && this.props.user.hasAuthorization("BOOK_DASHBOARD:DEL")){	
			del = true;
		}
		if(this.props.user && this.props.user.hasAuthorization("BOOK_DASHBOARD:ADD")){	
			add = true;
		}
		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
				<div style={{padding: '0 20px 0 20px', fontWeight:'bold', alignItems:'center'}}>
						<div>
							{bandeau_recap}
						</div>
						<div>
							<ButtonBar>
								<Tooltip text="RAZ filtres"><Button onClick={this.handleResetFilter} icon={EIcon.DELETE} secondary>&nbsp;</Button></Tooltip>
							</ButtonBar>
						</div>
					</div>
					<BoxBody style={{textAlign:"center"}}>
						<Spreadsheet 
								filter_default={this.state.filter_default}
								columns={col} 
								rows={row} 
								rowIndex={["id"]} 
								selectedRow={this.state.selectedRow}
								onSaveCell={this.handleSaveCell}
								onDelCell={this.handleDelCell}
								onAddCell={this.handleAddCell}
								onClickRow={this.handleClickRow}
								infoSupp = {true}
								sortable_default = {["name_type", "name_saga", "number"]}
								add={add}
								delete={del}
								edit={edit}
							/>
					</BoxBody>
					<BoxFooter>
						© {dateJour.getFullYear()} - SAGA Application
					</BoxFooter>
				</Box>
			</Row>
		);
	}

	renderDateBold(date:string, dateJourCompare:string): React.ReactNode {
		if(date){
			if(dateJourCompare == date.split(" ")[0]){
				return (<div style={{fontWeight:"bold"}}>{date}</div>);
			}
		}
		return (<div>{date}</div>);
	}

	renderDateColor(date:string, dateJourCompare:string): React.ReactNode {
		if(date){
			if(dateJourCompare == date.split(" ")[0]){
				return (<div style={{backgroundColor:"#f7e973", color:"#000000"}}>{date}</div>);
			}
		}
		return (<div>{date}</div>);
	}

	renderBandeauRecap (nb_MSN_Calcules: number, nb_MSN_OK:number, nb_MSN_KO:number, nb_MSN_Retard:number): React.ReactNode {
		let msnAvenir:number = nb_MSN_Calcules - nb_MSN_OK - nb_MSN_KO - nb_MSN_Retard;

		return (<div style={{fontSize:'1.2em', marginBottom:'15px', marginTop:'10px'}}>
					<div style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>NB de MSN OK:</strong> <span style={{color:'#007800', paddingRight:'20px'}}>{nb_MSN_OK}</span></div>
					<div style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>NB de MSN KO:</strong> <span style={{color:'#FF0000', paddingRight:'20px'}}>{nb_MSN_KO}</span></div>
					<div style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>NB de MSN en retard:</strong> <span style={{color:'#FF0000', paddingRight:'20px'}}>{nb_MSN_Retard}</span></div>
					<div style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>NB de MSN à venir:</strong> <span style={{color:'#000000', paddingRight:'20px'}}>{msnAvenir}</span></div>
				</div>);
	}



	makeFilterButton(label: React.ReactNode, button: any, isActive: boolean, key: number, value: string): React.ReactNode {
		let isLoading = isActive && this.state.requestStatus == Common.ECallStatus.RUNNING;
		if (isActive) {
			label = (<strong>{label}</strong>);
		}
		return (
			<Button key={key} primary={isActive} secondary={!isActive} loading={isLoading} onClick={() => button.bind(this)(value, key)} >{label}</Button>
		);
	}

}

export const DashboardBook = Store.withStore(DashboardBookComp);
