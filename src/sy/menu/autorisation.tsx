import * as React from 'react';
import {Page, PageBody, SpreadsheetColumn} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
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
        let url_ = new Common.Url(['api', 'param', 'Autorisation', 'add']);
		Common.postAsJson(url_, {authorization:"AUTORISATION:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

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
			new SpreadsheetColumn('nom', 'Nom', 100, "text", "text", true, true, undefined, undefined, true, true, true),
			new SpreadsheetColumn('description', 'Description', 100, "text", "text", true, true, undefined, undefined, false, true, false),
		];

		let title="Paramétrage des Autorisations";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = (this.renderRefreshing());
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert error={this.state.resultAdd}/>);
		} else if (this.props.user && this.props.user.hasAuthorization("AUTORISATION:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("AUTORISATION:ADD")){
				add = true;
			}
			pageBody = (
					<ParamProcess 
						url={['api', 'param', 'Autorisation']} 
						urlEdit={['api', 'param', 'Autorisation', 'edit']} 
						urlDel={['api', 'param', 'Autorisation', 'del']} 
						authorization={"AUTORISATION:DISPLAY"}
						authorizationEdit={"AUTORISATION:EDIT"}
						authorizationDel={"AUTORISATION:DEL"}
						process={"AUTORISATION"}
						pageTitle={title} 
						col={col}
						rowIndex={["id"]} 
						style={{textAlign:"center"}}
						add={add}
						onAddCell={this.handleAddCell}
                        urlRetour={"./RoleAutorisation"}
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

export const Autorisation = Store.withStore(ParamComp);
