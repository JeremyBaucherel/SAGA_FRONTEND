import * as React from 'react';
import {Page, PageBody, SpreadsheetColumn} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import {ProcessTabsBook, BookTabs} from '../../ui/process-tabs-book';
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
	resultListeJob: any;
	requestStatusListeJob: Common.ECallStatus;
	addRow: number;
}

export class ParamComp extends React.PureComponent<ParamProps,ParamState> {

	constructor (props: ParamProps) {
		super(props);

		this.state = {
			resultAdd: {},
			requestStatusAdd: Common.ECallStatus.NOT_STARTED,
			addRow:0,
			resultListeJob: {},
			requestStatusListeJob: Common.ECallStatus.NOT_STARTED,
		}

		this.handleAddCell = this.handleAddCell.bind(this);
	}

	componentDidMount (): void {
		this.requestListeJob();
	}

    requestListeJob (): void {
		this.setState({requestStatusListeJob: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'liste', 'job']);
        Common.postAsJson(url_, {authorization:"BOOK_DASHBOARD:DISPLAY"}, this.receiveDataListeJob.bind(this), this.receiveDataListeJobError.bind(this));
	}

	receiveDataListeJob (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusListeJob: Common.ECallStatus.OK,
			resultListeJob: myresult,
		});
	}

	receiveDataListeJobError (): void {
		this.setState({
			requestStatusListeJob: Common.ECallStatus.NOK,
			resultListeJob:[]
		});
	}

	handleAddCell(addRow:any){
		/* Lance enregistrement dans la database */
		this.setState({requestStatusAdd: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'bibliotheque', 'param', 'auteur', 'add']);
		Common.postAsJson(url_, {authorization:"BOOK_AUTEUR:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

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
			new SpreadsheetColumn('name_author', 'Nom de l\'auteur', 500, "text", "text", true, true, true, true, true),
			new SpreadsheetColumn('name_job', 'Nom du m??tier', 500, "menu", "liste", true, true, true, true, true, this.state.resultListeJob, true),
		];

		let title="Biblioth??que - Param??trage des Auteurs";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = (this.renderRefreshing());
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert error={this.state.resultAdd}/>);
		} else if (this.props.user && this.props.user.hasAuthorization("BOOK_DASHBOARD:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("BOOK_AUTEUR:ADD")){
				add = true;
			}
			pageBody = (
					<ParamProcess 
						url={['api', 'bibliotheque', 'param', 'auteur']} 
						urlEdit={['api', 'bibliotheque', 'param', 'auteur', 'edit']} 
						urlDel={['api', 'bibliotheque', 'param', 'auteur', 'del']} 
						authorization={"BOOK_DASHBOARD:DISPLAY"}
						authorizationEdit={"BOOK_AUTEUR:EDIT"}
						authorizationDel={"BOOK_AUTEUR:DEL"}
						process={"Biblioth??que"}
						pageTitle={title} 
						col={col}
						rowIndex={["id"]} 
						style={{textAlign:"center"}}
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
							<ProcessTabsBook activeTab={BookTabs.AUTEUR} />
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

export const ParamAuthor = Store.withStore(ParamComp);
