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

export class InformationComp extends React.PureComponent<ParamProps, ParamState> {

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
        let url_ = new Common.Url(['api', 'param', 'Version', 'add']);
		Common.postAsJson(url_, {authorization:"APPLICATION_VERSION:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

		this.setState({addRow:this.state.addRow + 1})
	}
	
	receiveDataAdd (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatusAdd: Common.ECallStatus.OK,
			resultAdd: myresult,	
		});
	}

	receiveDataError (): void {
		this.setState({
			requestStatusAdd: Common.ECallStatus.NOK,
			resultAdd:[]
		});
	}


	render (): React.ReactNode {
		let col = [
			new SpreadsheetColumn('version', 'Version', 150, "menu", "text", true, false, false, true, true),
			new SpreadsheetColumn('target', 'Target', 150, "text", "text", true, false, false, true, true),
			new SpreadsheetColumn('date', 'Date', 200, "date", "date", true, false, false, true, true),
			new SpreadsheetColumn('description', 'Description', 1000, "text", "text", true, false, false, true, true),
		];

		let title="Information";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization("APPLICATION_VERSION:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("APPLICATION_VERSION:ADD")){
				add = true;
			}
			pageBody = (
			<Page title={title}>
				<Toolbar>
					<ToolbarTitle>
						<h1>{title}</h1>
                    </ToolbarTitle>
                    <ToolbarButtons></ToolbarButtons>
				</Toolbar>
				
				<PageBody fullWidth>
					<ParamProcess
						url={['api', 'param', 'version']} 
						urlEdit={['api', 'param', 'version', 'edit']} 
						urlDel={['api', 'param', 'version', 'del']}
						authorization={'APPLICATION_VERSION:DISPLAY'}
						authorizationEdit={'APPLICATION_VERSION:EDIT'}
						authorizationDel={"APPLICATION_VERSION:DEL"}
						process={"VERSION"}
						pageTitle={title} 
						col={col}
						rowIndex={["id"]} 
						style={{textAlign:"center"}}
						add={add}
						onAddCell={this.handleAddCell}
						/>
						</PageBody>
					</Page>);
				} else {
					pageBody = (<NotAuthorizedAlert />);
				}
		
				return (pageBody);
			}
		
			renderRefreshing (): React.ReactNode {
				return (
					<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Spinner />
					</div>
				);
			}
		}
		
export const Information = Store.withStore(InformationComp);
