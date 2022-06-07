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
	filter_default: any;
	requestStatus: Common.ECallStatus;
	selectedRow: number;
}

export class DashboardBookComp extends React.PureComponent<DashboardProps, IDashboardState> {

	constructor (props: DashboardProps) {
		super(props);

		this.state = {
			result: {},
			filter_default: {},
			requestStatus: Common.ECallStatus.NOT_STARTED,
			selectedRow:-1,
		};

		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleResetFilter = this.handleResetFilter.bind(this);
		this.handleDefineFilterDefault = this.handleDefineFilterDefault.bind(this);
	}
	
	componentDidMount (): void {
		this.requestData();
	}

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

	handleClickRow(rowIndex: any, ifSelectedRow:boolean){
		if(ifSelectedRow){
			this.setState({selectedRow: -1})
		}else{
			this.setState({selectedRow: rowIndex[0]})
		}
	}

	render (): React.ReactNode {
		let pageBody: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
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
		let dateFiltre = new Date();
		let deltaJourFiltre = 14;
		dateFiltre.setDate(dateFiltre.getDate()-deltaJourFiltre);
		this.setState({filter_default: {'Date entrée station': '>' + DateUtils.formatDate(dateFiltre)}});
	}

	renderDashboard (): React.ReactNode {
		let col = [
			new SpreadsheetColumn('name_type', "Catégorie", 50, "menu", "text", true, true, undefined, undefined, true),
			new SpreadsheetColumn('name_saga', "Saga", 120, "menu", "text", true, true, undefined, undefined),
			new SpreadsheetColumn('number', "Numéro", 85, "text", "text", true, true, undefined, undefined),
			new SpreadsheetColumn('name', "Nom", 120, "text", "text", true, true, undefined, undefined),
			new SpreadsheetColumn("name_book_publishing", "Maison d'édition", 150, "menu", "text", true, true, undefined, undefined),
			new SpreadsheetColumn('name_owner', "Propriétaire", 150, "menu", "text", true, true, undefined, undefined),
			new SpreadsheetColumn('name_location', "Localisation", 150, "menu", "text", true, true, undefined, undefined),
		];
		console.log(this.state.result)
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
								onClickRow={this.handleClickRow}
								infoSupp = {true}
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
