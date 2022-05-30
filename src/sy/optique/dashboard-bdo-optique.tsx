import * as React from 'react';
import {EIcon, EPosition, Page, ETrigger, PageBody, Row, Button, ButtonBar, Spreadsheet, SpreadsheetColumn, Box, Padding, BoxBody, BoxFooter, Spinner, BoxHeading, Tooltip} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import * as Common from '../api/common';
import * as DateUtils from '../../date-utils';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';

interface DashboardProps {
	user?: Store.User;
}

interface IDashboardState {
    result: any;
	filter_default: any;
	requestStatus: Common.ECallStatus;
    selectedRow: number;
}

export class ParamComp extends React.PureComponent<DashboardProps,IDashboardState> {

	constructor (props: DashboardProps) {
		super(props);

		this.state = {
			result: {},
			filter_default: {},
			requestStatus: Common.ECallStatus.RUNNING,
            selectedRow:-1,
        }
		this.handleClickRow = this.handleClickRow.bind(this);
		this.handleResetFilter = this.handleResetFilter.bind(this);
		this.handleDefineFilterDefault = this.handleDefineFilterDefault.bind(this);
	}

	componentDidMount (): void {
		this.requestData();
	}

    requestData (): void {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'optique', 'dashboard-bdo']);
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
		} else if (this.props.user && this.props.user.hasAuthorization('OPTIQUE:DISPLAY')) {
			pageBody = this.renderDashboard();
		} else {
			pageBody = (<NotAuthorizedAlert />);
		}

		return (
			<Page title="Dashboard de suivi des demandes de Bdo">
				<Toolbar>
					<ToolbarTitle>
                        <h1>Dashboard de suivi des demandes de Bdo</h1>
                    </ToolbarTitle>
					<ToolbarButtons></ToolbarButtons>
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
		let deltaJourFiltre = 30;
		dateFiltre.setDate(dateFiltre.getDate()-deltaJourFiltre);
		this.setState({filter_default: {'dateRequestCirce': '>' + DateUtils.formatDate(dateFiltre)}});
	}

	renderDashboard (): React.ReactNode {
		let col = [
			new SpreadsheetColumn("pgm", "PGM", 50, "menu", "text", true, true, undefined, undefined, true, false, false),
			new SpreadsheetColumn("msn", "MSN", 50, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("numRequestCirce", "N° demande Bdo Circe", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("dateRequestCirce", "Date demande de Bdo", 150, "date", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("loginCirceRequestor", "Login Circe demandeur", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("loginWindowsRequestor", "Login Windows demandeur", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("numCirceTreatment", "N° de traitement", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("dateCirceTreatment", "Date dépose fichier Bdo", 150, "date", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("dateRecupCirceTreatment", "Date récupération fichier Bdo", 150, "date", "text", true, true, undefined, undefined, false, false, false),
            new SpreadsheetColumn("statut", "Statut", 250, "menu", "text", true, true, undefined, undefined, false, false, false),
		];

        let row = Common.copy(this.state.result);
        let dateJour = new Date();

		// Définition des styles
		for(var ligne in row)
		{
            // Ajout colonne Statut
            if(row[ligne]['dateRequestCirce'] != null && row[ligne]['dateCirceTreatment'] == null && row[ligne]['dateRecupCirceTreatment'] == null){
                row[ligne]['statut'] = (<div style={{backgroundColor:"#ff6600", color:"#FFFFFF", fontWeight:'bold'}}>Demande Bdo effectuée</div>);
            }
            else if(row[ligne]['dateRequestCirce'] != null && row[ligne]['dateCirceTreatment'] != null && row[ligne]['dateRecupCirceTreatment'] == null){
                row[ligne]['statut'] = (<div style={{backgroundColor:"#ff6600", color:"#FFFFFF", fontWeight:'bold'}}>Fichier(s) Bdo déposé(s)</div>);
            }
            else if(row[ligne]['dateRequestCirce'] != null && row[ligne]['dateCirceTreatment'] != null && row[ligne]['dateRecupCirceTreatment'] != null){
                row[ligne]['statut'] = (<div style={{backgroundColor:"#008000", color:"#FFFFFF", fontWeight:'bold'}}>OK</div>);
            }else{
                row[ligne]['statut'] = (<div style={{backgroundColor:"#FF0000", color:"#FFFFFF", fontWeight:'bold'}}>Erreur détectée</div>);
            }
			// Colonne Date
			let dateJourCompare = dateJour.getFullYear() + "-" + String(dateJour.getMonth() + 1).padStart(2, '0') + "-" + String(dateJour.getDate()).padStart(2, '0');
			row[ligne]['dateRequestCirce'] = this.renderDateColor(row[ligne]['dateRequestCirce'], dateJourCompare);
			row[ligne]['dateCirceTreatment'] = this.renderDateColor(row[ligne]['dateCirceTreatment'], dateJourCompare);
			row[ligne]['dateRecupCirceTreatment'] = this.renderDateColor(row[ligne]['dateRecupCirceTreatment'], dateJourCompare);
        }

		return (
			<Row fullHeight>
				<Box style={{width:"100%"}}>
				    <BoxHeading>
							<ButtonBar>
								<Tooltip text="RAZ filtres"><Button onClick={this.handleResetFilter} icon={EIcon.DELETE} secondary>&nbsp;</Button></Tooltip>
							</ButtonBar>
                            <div style={{textAlign:"right", flex: "auto"}}><Button to={'./dashboard'} tooltip="Retour" icon={EIcon.ARROW_BACK} secondary></Button></div>
                    </BoxHeading>
					<BoxBody style={{textAlign:"center"}}>
						<Spreadsheet 
								filter_default={this.state.filter_default}
								columns={col} 
								rows={row} 
								rowIndex={['MSN']}
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




}

export const DashboardBdoOptique = Store.withStore(ParamComp);
