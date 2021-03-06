import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {EIcon, EPosition, Page, ETrigger, PageBody, Row, Button, ButtonBar, Spreadsheet, SpreadsheetColumn, Box, Popup, PopupTitle, PopupBody, Padding, BoxBody, BoxFooter, Spinner, Popover, Tooltip} from 'stk';
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

	resultMenuCategorie: any;
	resultMenuSaga: any;
	resultMenuPublishing: any;
	resultMenuOwner: any;
	resultMenuLocation: any;
	resultMenuAuthor: any;

	filter_default: any;

	requestStatus: Common.ECallStatus;
	requestStatusSave: Common.ECallStatus;
	requestStatusDel: Common.ECallStatus;
	requestStatusAdd: Common.ECallStatus;

	requestStatusMenuCategorie: Common.ECallStatus;
	requestStatusMenuSaga: Common.ECallStatus;
	requestStatusMenuPublishing: Common.ECallStatus;
	requestStatusMenuOwner: Common.ECallStatus;
	requestStatusMenuLocation: Common.ECallStatus;
	requestStatusMenuAuthor: Common.ECallStatus;

	resultReturnBook: any;
	requestStatusReturnBook: Common.ECallStatus;

	selectedRow: number;
	popupReturnBookShown: boolean;

	filtreActifLivrePret: boolean;

	boutonActiveCategorie: number;
}

export class DashboardBookComp extends React.PureComponent<DashboardProps, IDashboardState> {

	constructor (props: DashboardProps) {
		super(props);

		this.state = {
			result: {},
			resultSave: {},
			resultAdd: {},
			resultDel: {},

			resultMenuCategorie: {},
			resultMenuSaga: {},
			resultMenuPublishing: {},
			resultMenuOwner: {},
			resultMenuLocation: {},
			resultMenuAuthor: {},

			filter_default: {},

			requestStatus: Common.ECallStatus.NOT_STARTED,
			requestStatusSave: Common.ECallStatus.NOT_STARTED,
			requestStatusDel: Common.ECallStatus.NOT_STARTED,
			requestStatusAdd: Common.ECallStatus.NOT_STARTED,

			requestStatusMenuCategorie: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuSaga: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuPublishing: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuOwner: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuLocation: Common.ECallStatus.NOT_STARTED,
			requestStatusMenuAuthor: Common.ECallStatus.NOT_STARTED,

			resultReturnBook: {},
			requestStatusReturnBook: Common.ECallStatus.NOT_STARTED,

			selectedRow:-1,
			popupReturnBookShown: false,
			filtreActifLivrePret: false,

			boutonActiveCategorie: -1,
		};

		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleResetFilter = this.handleResetFilter.bind(this);
		this.handleDefineFilterDefault = this.handleDefineFilterDefault.bind(this);

		this.handleAddCell = this.handleAddCell.bind(this);
		this.handleSaveCell = this.handleSaveCell.bind(this);
		this.handleDelCell = this.handleDelCell.bind(this);

		this.handleAffPopupReturnBook = this.handleAffPopupReturnBook.bind(this);
		this.handleCancelReturnBook = this.handleCancelReturnBook.bind(this);
		this.handleReturnBook = this.handleReturnBook.bind(this);
	}

	componentDidMount (): void {
		this.requestData();
		this.requestMenuCategorie();
		this.requestMenuSaga();
		this.requestMenuPublishing();
		this.requestMenuOwner();
		this.requestMenuLocation();
		this.requestMenuAuteur();
	}

	// Requ??te biblioth??que
    requestData (): void {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'dashboard']);
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

	// Menu Auteur
	requestMenuAuteur (): void {
		this.setState({requestStatusMenuAuthor: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'author']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuAuteur.bind(this), this.receiveMenuAuteurError.bind(this));
	}

	receiveMenuAuteur (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuAuthor: Common.ECallStatus.OK,
			resultMenuAuthor: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuAuteurError (): void {
		this.setState({
			requestStatusMenuAuthor: Common.ECallStatus.NOK,
			resultMenuAuthor:[]
		});
	}

	// Menu categorie
	requestMenuCategorie (): void {
		this.setState({requestStatusMenuCategorie: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'categorie']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuCategorie.bind(this), this.receiveMenuCategorieError.bind(this));
	}

	receiveMenuCategorie (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusMenuCategorie: Common.ECallStatus.OK,
			resultMenuCategorie: myresult,
		});
		this.handleDefineFilterDefault();
	}

	receiveMenuCategorieError (): void {
		this.setState({
			requestStatusMenuCategorie: Common.ECallStatus.NOK,
			resultMenuCategorie:[]
		});
	}

	// Menu SAGA
	requestMenuSaga (): void {
		this.setState({requestStatusMenuSaga: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'saga']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuSaga.bind(this), this.receiveMenuSagaError.bind(this));
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
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'publishing']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuPublishing.bind(this), this.receiveMenuPublishingError.bind(this));
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
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'owner']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuOwner.bind(this), this.receiveMenuOwnerError.bind(this));
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
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'location']);
		Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveMenuLocation.bind(this), this.receiveMenuLocationError.bind(this));
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

    handleAffPopupReturnBook (): void {
        this.setState({popupReturnBookShown: true})
    }

    handleCancelReturnBook (): void {
        this.setState({popupReturnBookShown: false})
        // On d??s??lectionne la ligne
        this.setState({selectedRow: -1})
    }

	handleReturnBook():void {
		this.setState({requestStatusReturnBook: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'dashboard', 'valretour']);
		Common.postAsJson(url_, {rowId: this.state.selectedRow, authorization:"BOOK_DASHBOARD:EDIT"}, this.receiveReturnBook.bind(this), this.receiveReturnBookError.bind(this));
		this.handleCancelReturnBook();
		this.requestData();
	}

	receiveReturnBook (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusReturnBook: Common.ECallStatus.OK,
			resultReturnBook: myresult,	
		});	
	}

	receiveReturnBookError (): void {
		this.setState({
			requestStatusReturnBook: Common.ECallStatus.NOK,
			resultReturnBook:[]
		});
	}

	render (): React.ReactNode {
		let pageBody: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING || this.state.requestStatusMenuCategorie == Common.ECallStatus.RUNNING || 
			this.state.requestStatusMenuSaga == Common.ECallStatus.RUNNING || this.state.requestStatusMenuPublishing == Common.ECallStatus.RUNNING ||
			this.state.requestStatusMenuOwner == Common.ECallStatus.RUNNING || this.state.requestStatusMenuLocation == Common.ECallStatus.RUNNING || 
			this.state.requestStatusMenuAuthor == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK || this.state.requestStatusMenuCategorie == Common.ECallStatus.NOK || 
			this.state.requestStatusMenuSaga == Common.ECallStatus.NOK || this.state.requestStatusMenuPublishing == Common.ECallStatus.NOK ||
			this.state.requestStatusMenuOwner == Common.ECallStatus.NOK || this.state.requestStatusMenuLocation == Common.ECallStatus.NOK || 
			this.state.requestStatusMenuAuthor == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization('BOOK_DASHBOARD:DISPLAY')) {
			pageBody = this.renderDashboard();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (
			<Page title="Dashboard Biblioth??que">
				<Toolbar>
					<ToolbarTitle>
						<h1>Biblioth??que - Dashboard</h1>
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
		this.setState({boutonActiveCategorie:-1});
		this.setState({filtreActifLivrePret:false});
	}

	handleDefineFilterDefault(){
		this.setState({filter_default: {"name_owner":["J??r??my","A acheter"]}});
	}

	handleSaveCell(saveRows:any){
		/* Lance enregistrement dans la database */
		this.setState({requestStatusSave: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'dashboard', 'edit']);
		Common.postAsJson(url_, {process: "Biblioth??que", authorization:"BOOK_DASHBOARD:EDIT", saveRows:saveRows}, this.receiveDataSave.bind(this), this.receiveDataSaveError.bind(this));

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
        let url_ = new Common.Url(['api', 'bibliotheque', 'dashboard', 'del']);
		Common.postAsJson(url_, {process: "Biblioth??que", authorization:"BOOK_DASHBOARD:DEL", delRow:delRow}, this.receiveDataDel.bind(this), this.receiveDataDelError.bind(this));

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
        let url_ = new Common.Url(['api', 'bibliotheque', 'dashboard', 'add']);
		Common.postAsJson(url_, {process: "Biblioth??que", authorization:"BOOK_DASHBOARD:DEL", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataAddError.bind(this));

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

    recupColumnFromDict(myDict:any, columnName:string):any{
        var tabResult = [];
		for(let item in myDict){
            tabResult.push(myDict[item][columnName])
        }
        return tabResult;
    }

	affLivrePret():void{

		if(this.state.filtreActifLivrePret){
			this.handleResetFilter();
		}
		else{
			this.setState({filter_default:{"borrower":"*"}});
		}
		this.setState({filtreActifLivrePret:!this.state.filtreActifLivrePret});
	}

	filter_categorie(categorie:string, boutonActiveCategorie:number):void{
		var myFilter_default = this.state.filter_default;
		if(this.state.boutonActiveCategorie == boutonActiveCategorie){
			delete myFilter_default.name_categorie;
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveCategorie:-1});
		}else{
			myFilter_default["name_categorie"] = [categorie];
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveCategorie:boutonActiveCategorie});
		}
	}

	renderDashboard (): React.ReactNode {

		let col = [
			new SpreadsheetColumn('id', "id", 50, "text", "text", true, true, true, false, false),
			new SpreadsheetColumn('name_categorie', "Cat??gorie", 50, "menu", "liste", true, true, true, true, true, this.state.resultMenuCategorie),
			new SpreadsheetColumn('name_saga', "Saga", 120, "text", "liste", true, true, false, true, false, this.state.resultMenuSaga),
			new SpreadsheetColumn('number', "Num??ro", 85, "text", "text", true, true, false, true, false),
			new SpreadsheetColumn('name', "Nom", 120, "text", "text", true, true, false, true, true),
			new SpreadsheetColumn("name_book_publishing", "Maison d'??dition", 150, "text", "liste", true, true, false, true, false, this.state.resultMenuPublishing),
			new SpreadsheetColumn('name_owner', "Propri??taire", 150, "menu", "liste", true, true, true, true, true, this.state.resultMenuOwner),
			new SpreadsheetColumn('name_location', "Localisation", 150, "menu", "liste", true, true, true, true, false, this.state.resultMenuLocation),
			new SpreadsheetColumn('authors', "Auteur", 150, "menu", "liste", true, true, true, true, false, this.state.resultMenuAuthor, true),
			new SpreadsheetColumn('borrower', "Pr??t??", 150, "text", "text", true, true, true, true, false),
			new SpreadsheetColumn('borrowing_date', "Date de pr??t", 100, "date", "date", true, true, true, true, false),
		];

		let row = Common.copy(this.state.result);
		let dateJour = new Date();
		
		// R??sup??ration des cat??gories de livre dans un tableau
		let tab_categorie = this.recupColumnFromDict(row,'name_categorie');

		// Garde les valeurs uniques
		tab_categorie = Array.from(new Set(tab_categorie)).sort();
		// Initialisation du dictionnaire de comptage des livres par cat??gorie
		let nb_livre:any = {};
		for(var c in tab_categorie){
			nb_livre[tab_categorie[c]] = 0;
		}

		var tabBorrower = [];
		// D??finition des styles
		for(var ligne in row)
		{
			let datePret = row[ligne]['borrowing_date'];
			let datePretFormate = null;
			if(datePret != "")
			{
				datePretFormate = DateUtils.parseDateDatabase(datePret);
				
				let dateAlerte = datePretFormate;
				dateAlerte.setDate(datePretFormate.getDate()+180);

				if(dateJour > dateAlerte){
					row[ligne]['borrowing_date'] =(<div style={{backgroundColor:"#FF0000", color:"#FFFFFF", fontWeight:'bold'}}>{row[ligne]['borrowing_date']}</div>);
				}

				tabBorrower.push(row[ligne]['id']);
			}

			// Comptage des livres (sauf les 'A acheter')
			if(row[ligne]['name_owner'] != "A acheter"){
				nb_livre[row[ligne]['name_categorie']]+=1;
			}
		}
		let bandeau_recap = (this.renderBandeauRecap(nb_livre));

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

		let buttonAffFormAddAuthor: React.ReactNode = (null);

		// Si diff de -1 alors on a s??lectionn?? une ligne du tableau
		if(this.state.selectedRow!=-1 && this.props.user && this.props.user.hasAuthorization('BOOK_DASHBOARD:EDIT')){

			if(tabBorrower.indexOf(this.state.selectedRow) != -1){

				if(!this.state.popupReturnBookShown){
				
					buttonAffFormAddAuthor = (
						<Button icon={EIcon.ASSIGNMENT_RETURN} secondary onClick={this.handleAffPopupReturnBook}>&nbsp;Livre rendu</Button>
					);
					
				}else{
					buttonAffFormAddAuthor = (<Popup onBlanketClick={(e) => {}} height="180px">
									<PopupTitle>
										<h2>Validation retour livre pr??t??</h2>
									</PopupTitle>
									<PopupBody style={{display: "block"}}>
											<p style={{padding:"0px 5px 10px 5px", fontSize:"1.2em"}}><strong>Etes-vous s??r que le livre vous a bien ??t?? rendu ? <br/>
											Attention car ceci est une action d??finitive !!!</strong>
											</p>
											<Button secondary icon={EIcon.DONE} onClick={this.handleReturnBook}><strong>Livre rendu</strong></Button>
											<Button secondary icon={EIcon.BLOCK} onClick={this.handleCancelReturnBook} ><strong>Annuler</strong></Button>
									</PopupBody>
								</Popup>);
				}
			}
		}

		// Barre de boutons cat??gorie
		let listeBoutonCategorie = [];
		for(var c in tab_categorie){
			listeBoutonCategorie.push(this.makeFilterButton(tab_categorie[c], this.filter_categorie, (this.state.boutonActiveCategorie==Number(c)), Number(c), tab_categorie[c]));
		}

		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
				<div style={{padding: '0 20px 0 20px', fontWeight:'bold', alignItems:'center'}}>
						<div>
							{bandeau_recap}
							<div style={{marginRight:'0px', textAlign:'right', float:'right'}}>
							{buttonAffFormAddAuthor}
							</div>
						</div>
						<div>
							<ButtonBar>
								<Button tooltip='RAZ filtres' onClick={this.handleResetFilter} icon={EIcon.DELETE} secondary></Button>
							</ButtonBar>
							<ButtonBar>
								{listeBoutonCategorie}
							</ButtonBar>
							<ButtonBar>
								<Button tooltip='Livre en pr??t' primary={this.state.filtreActifLivrePret} secondary={!this.state.filtreActifLivrePret} onClick={this.affLivrePret.bind(this)} icon={EIcon.UPDATE}></Button>
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
								sortable_default = {["name_categorie", "name_saga", "number"]}
								add={add}
								delete={del}
								edit={edit}
							/>
					</BoxBody>
					<BoxFooter>
						?? {dateJour.getFullYear()} - SAGA Application
					</BoxFooter>
				</Box>
			</Row>
		);
	}
	/*
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
	*/
	renderBandeauRecap (nb_livre:any): React.ReactNode {
		var tabAffNbLivre:any = [];
		var total:number = 0;
		for(var c in nb_livre){
			tabAffNbLivre.push(<div key={c} style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>{c}</strong> <span style={{color:'#000000', paddingRight:'20px'}}>{nb_livre[c]}</span></div>)
			total+=nb_livre[c];
		}
		tabAffNbLivre.push(<div key={-1} style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}><strong>{"Total"}</strong> <span style={{color:'#000000', paddingRight:'20px'}}>{total}</span></div>)
		return (<div style={{fontSize:'1.2em', marginBottom:'15px', marginTop:'10px'}}>
					{tabAffNbLivre}
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
