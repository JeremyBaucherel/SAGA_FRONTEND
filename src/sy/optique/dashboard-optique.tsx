import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {EIcon, EPosition, Page, ETrigger, PageBody, Row, Button, ButtonBar, Spreadsheet, SpreadsheetColumn, Box, Padding, BoxBody, BoxFooter, Spinner, Popover, Tooltip} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import {TabPfe} from '../shared/tab-pfe';
import {LogExe} from '../shared/logExe';
import * as Common from '../api/common';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';
import * as Store from '../store';
import {ProcessTabsOptique, OptiqueTabs} from '../../ui/process-tabs-optique';
import * as DateUtils from '../../date-utils';

interface DashboardProps {
	user?: Store.User;
}

interface IDashboardState {
	result: any;
	resultPfe: any;
	filter_default: any;
	requestStatus: Common.ECallStatus;
	requestStatusPfe: Common.ECallStatus;
	selectedRow: number;
	boutonActiveGamme: number;
	boutonActiveCptGrGam: number;
	date: [Date, Date];
}

export class DashboardOptiqueComp extends React.PureComponent<DashboardProps, IDashboardState> {

	constructor (props: DashboardProps) {
		super(props);

		this.state = {
			result: {},
			resultPfe: {},
			filter_default: {},
			requestStatus: Common.ECallStatus.RUNNING,
			requestStatusPfe: Common.ECallStatus.RUNNING,
			selectedRow:-1,
			boutonActiveGamme:-1,
			boutonActiveCptGrGam:-1,
			date:this.getDasboardDate(),
		};

		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleResetFilter = this.handleResetFilter.bind(this);
		this.handleDefineFilterDefault = this.handleDefineFilterDefault.bind(this);
	}
	
	getDasboardDate (): [Date, Date] {
		// date range.
		let lastDay = new Date();			

		let firstDay = new Date();
		firstDay.setDate(firstDay.getDate()-90);

		return [firstDay, lastDay];
	}

	componentDidMount (): void {
		this.requestData();
		this.requestDataPfe();
	}

    requestData (): void {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'optique', 'dashboard']);
        Common.getJson(url_, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	receiveData (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatus: Common.ECallStatus.OK,
			result: myresult,
		});

		// Recherche de la date max de la colonne 'Date entrée station'
		/*
		var dateMax = new Date()
		for(var line in myresult){
			let dateLine = DateUtils.parseDateDatabase(myresult[line]['Date entrée station']);
			if(dateLine>dateMax){
				dateMax = dateLine;
			}
		}
		*/
		this.handleDefineFilterDefault();
	}

	receiveDataError (): void {
		this.setState({
			requestStatus: Common.ECallStatus.NOK,
			result:[]
		});
	}

	receiveDataPfe (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusPfe: Common.ECallStatus.OK,
			resultPfe: myresult
		});
	}

	receiveDataErrorPfe (): void {
		this.setState({
			requestStatusPfe: Common.ECallStatus.NOK,
			resultPfe:[]
		});
	}

    requestDataPfe (): void {
		this.setState({requestStatusPfe: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'pfe']);
        Common.postAsJson(url_, {process: "FIBREOPTIQUE", authorization:"OPTIQUE:DISPLAY"}, this.receiveDataPfe.bind(this), this.receiveDataErrorPfe.bind(this));
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

		if (this.state.requestStatus == Common.ECallStatus.RUNNING || this.state.requestStatusPfe == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK || this.state.requestStatusPfe == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization('OPTIQUE:DISPLAY')) {
			pageBody = this.renderDashboard();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (
			<Page title="Dashboard Fibre Optique">
				<Toolbar>
					<ToolbarTitle>
						<h1>Process Fibre Optique - Dashboard</h1>
                    </ToolbarTitle>
					<ToolbarButtons></ToolbarButtons>
					<ProcessTabsOptique activeTab={OptiqueTabs.DASHBOARD} />
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

	buttonGamme(gamme:string, boutonActiveGamme:number): void{
		var myFilter_default = this.state.filter_default;
		if(this.state.boutonActiveGamme == boutonActiveGamme){
			delete myFilter_default.Gamme;
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveGamme:-1});
		}else{
			myFilter_default["Gamme"] = [gamme];
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveGamme:boutonActiveGamme});
		}
	}

	buttonCptGrGam(cptgrgamme:string, boutonActiveCptGrGam:number): void{
		var myFilter_default = this.state.filter_default;

		if(this.state.boutonActiveCptGrGam == boutonActiveCptGrGam){
			delete myFilter_default.CptGrGam;
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveCptGrGam:-1});
		}else{
			myFilter_default["CptGrGam"] = [cptgrgamme];
			this.setState({filter_default:myFilter_default});
			this.setState({boutonActiveCptGrGam:boutonActiveCptGrGam});
		}
	}

	handleResetFilter(){
		this.handleDefineFilterDefault();

		this.setState({boutonActiveGamme:-1});
		this.setState({boutonActiveCptGrGam:-1});
	}

	handleDefineFilterDefault(){
		let dateFiltre = new Date();
		let deltaJourFiltre = 14;
		dateFiltre.setDate(dateFiltre.getDate()-deltaJourFiltre);
		this.setState({filter_default: {'Date entrée station': '>' + DateUtils.formatDate(dateFiltre)}});
	}

	renderDashboard (): React.ReactNode {
		let col = [
			new SpreadsheetColumn('MSN', undefined, 50, "text", "text", true, true, undefined, undefined, true),
			new SpreadsheetColumn('Gamme', undefined, 120, "menu", "text", true, true, undefined, undefined),
			new SpreadsheetColumn('CptGrGam', undefined, 85, "menu", "integer", true, true, undefined, undefined),
			new SpreadsheetColumn('Ordre de Fab', undefined, 120, "text", "text", true, true, undefined, undefined),
			new SpreadsheetColumn("Date Prépa SAP", undefined, 150, "date", "datetime", true, true, undefined, undefined),
			new SpreadsheetColumn('Date Ajout OF', undefined, 150, "date", "datetime", true, true, undefined, undefined),
			new SpreadsheetColumn('Date Maj PV', undefined, 150, "date", "datetime", true, true, undefined, undefined),
			new SpreadsheetColumn('Date entrée station', undefined, 150, "date", "datetime", true, true, undefined, undefined),
			new SpreadsheetColumn('Statut', undefined, 200, "menu", "text", true, true, undefined, undefined),
		];

		let row = Common.copy(this.state.result);
		let dateJour = new Date();

		let deltaJourAlerte = 0;
		let tab_gamme = [];
		let tab_cptGrGam = [];
		let nb_MSN_Calcules = 0;
		let nb_MSN_OK = 0;
		let nb_MSN_KO = 0;
		let nb_MSN_Retard = 0;

		// Conversion du résultat de resultPfe en dictionnaire facilement exploitable
		let DictGammeAlerte:any = {};
		for(let g in this.state.resultPfe){
			DictGammeAlerte[this.state.resultPfe[g]["gamme"]+"-"+this.state.resultPfe[g]["cptGrGam"]] = this.state.resultPfe[g]["alerteDatePrepa"];
		}

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

			// Alerte préparation
			let dateAlerte = new Date();
			deltaJourAlerte = DictGammeAlerte[row[ligne]['Gamme']+"-"+row[ligne]['CptGrGam']];
			dateAlerte.setDate(dateJour.getDate()+deltaJourAlerte);

			// Colonne Statut
			if(row[ligne]['Statut'] != "OK" && row[ligne]['Statut'] != "" && row[ligne]['Statut'] != null){
				row[ligne]['Statut'] =(<div style={{backgroundColor:"#FF0000", color:"#FFFFFF", fontWeight:'bold'}}>{row[ligne]['Statut']}</div>);
				nb_MSN_KO = nb_MSN_KO + 1;
			}else if(dateEntreeStationFormate < dateAlerte && row[ligne]['Statut'] != "OK"){
				row[ligne]['Statut'] =(<div style={{backgroundColor:"#FF0000", color:"#FFFFFF", fontWeight:'bold'}}>Calcul en retard !!!</div>);
				nb_MSN_Retard = nb_MSN_Retard + 1;
			}else if(row[ligne]['Statut'] == "OK"){
				row[ligne]['Statut'] =(<div style={{backgroundColor:"#008000", color:"#FFFFFF", fontWeight:'bold'}}>OK</div>);
				nb_MSN_OK = nb_MSN_OK + 1;
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

		// Barre de boutons
		let listeBoutonGamme = [];
		for(var g in tab_gamme){
			listeBoutonGamme.push(this.makeFilterButton(tab_gamme[g], this.buttonGamme, (this.state.boutonActiveGamme==Number(g)), Number(g), tab_gamme[g]));
		}
		let listeBoutonCptGrGam = [];
		let label = "";
		if(tab_cptGrGam.length > 1){
			for(var g in tab_cptGrGam){
				if(tab_cptGrGam[g]==90){
					label = "CHINA";
				}else{
					label = "NZ";
				}
				listeBoutonCptGrGam.push(this.makeFilterButton(label, this.buttonCptGrGam, (this.state.boutonActiveCptGrGam==Number(g)), Number(g), tab_cptGrGam[g]));
			}
		}

		let bandeau_recap = (this.renderBandeauRecap(nb_MSN_Calcules,nb_MSN_OK,nb_MSN_KO,nb_MSN_Retard));

		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
				<div style={{padding: '0 20px 0 20px', fontWeight:'bold', alignItems:'center'}}>
						<div>
							{bandeau_recap}
							<div style={{marginRight:'0px', textAlign:'right', float:'right'}}>
							<Button icon={EIcon.LIBRARY_BOOKS} to='./dashboard-bdo-optique' secondary>&nbsp;Suivi des demandes Bdo</Button>
								<Popover position={EPosition.BOTTOM_RIGHT} trigger={ETrigger.CLICK}>
									<Button icon={EIcon.SCHEDULE} secondary>&nbsp;Param PFE</Button>
									<TabPfe process='FIBREOPTIQUE'></TabPfe>
								</Popover>
							</div>
						</div>
						<div>
							<ButtonBar>
								<Tooltip text="RAZ filtres"><Button onClick={this.handleResetFilter} icon={EIcon.DELETE} secondary>&nbsp;</Button></Tooltip>
							</ButtonBar>
							<ButtonBar>
								{listeBoutonGamme}
							</ButtonBar>
							<ButtonBar>
								{listeBoutonCptGrGam}
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
						© {dateJour.getFullYear()} - ASGARD Application
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
					<LogExe process='FIBREOPTIQUE' authorization='OPTIQUE:DISPLAY'></LogExe>
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

export const DashboardOptique = Store.withStore(DashboardOptiqueComp);