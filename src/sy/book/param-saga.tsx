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
	addRow: number;
}

export class ParamComp extends React.PureComponent<ParamProps,ParamState> {

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
        let url_ = new Common.Url(['api', 'bibliotheque', 'param', 'saga', 'add']);
		Common.postAsJson(url_, {authorization:"BOOK_SAGA:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

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
			new SpreadsheetColumn('name_saga', 'Nom de la SAGA', 500, "text", "text", true, true, true, true, true),
		];

		let title="Bibliothèque - Paramétrage des SAGA";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = (this.renderRefreshing());
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert error={this.state.resultAdd}/>);
		} else if (this.props.user && this.props.user.hasAuthorization("BOOK:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("BOOK_SAGA:ADD")){
				add = true;
			}
			pageBody = (
					<ParamProcess 
						url={['api', 'bibliotheque', 'param', 'saga']} 
						urlEdit={['api', 'bibliotheque', 'param', 'saga', 'edit']} 
						urlDel={['api', 'bibliotheque', 'param', 'saga', 'del']} 
						authorization={"BOOK:DISPLAY"}
						authorizationEdit={"BOOK_SAGA:EDIT"}
						authorizationDel={"BOOK_SAGA:DEL"}
						process={"Bibliothèque"}
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
							<ProcessTabsBook activeTab={BookTabs.SAGA} />
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

export const ParamSaga = Store.withStore(ParamComp);
