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

export class ParamComp extends React.PureComponent<ParamProps, ParamState> {

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
        let url_ = new Common.Url(['api', 'param', 'ParamOther', 'add']);
		Common.postAsJson(url_, {process: "Bibliothèque", authorization:"OPTIQUE_PARAM:ADD", addRow:addRow}, this.receiveDataAdd.bind(this), this.receiveDataError.bind(this));

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
			new SpreadsheetColumn('categorie', 'Catégorie', 150, "menu", "text", true, false, undefined, undefined, true, true, false),
			new SpreadsheetColumn('nom', 'Nom', 170, "text", "text", true, false, undefined, undefined, false, false, true),
			new SpreadsheetColumn('valeur', 'Valeur', 600, "text", "text", true, false, undefined, undefined, false, true, false),
			new SpreadsheetColumn('description', 'Description', 600, "text", "text", true, false, undefined, undefined, false, true, false),
			new SpreadsheetColumn('actif', 'Actif', 80, "menu", "boolean", true, false, undefined, undefined, true, true, false),
		];

		let title="Paramétrage Autres - Process Fibre Optique";

		let pageBody: React.ReactNode = '';

		if (this.state.requestStatusAdd == Common.ECallStatus.RUNNING) {
			pageBody = this.renderRefreshing();
		} else if (this.state.requestStatusAdd == Common.ECallStatus.NOK) {
			pageBody = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization("OPTIQUE:DISPLAY")) {
			let add:boolean = false;
			if(this.props.user.hasAuthorization("OPTIQUE_PARAM:ADD")){
				add = true;
			}
			pageBody = (
			<Page title={title}>
				<Toolbar>
					<ToolbarTitle>
						<h1>{title}</h1>
                    </ToolbarTitle>
                    <ToolbarButtons></ToolbarButtons>
					<ProcessTabsBook activeTab={BookTabs.PARAMOTHERS} />
				</Toolbar>
				
				<PageBody fullWidth>
					<ParamProcess
						url={['api', 'param', 'others']} 
						urlEdit={['api', 'param', 'ParamOther', 'edit']}
						urlDel={['api', 'param', 'ParamOther', 'del']} 
						authorization={"OPTIQUE:DISPLAY"}
						authorizationEdit={"OPTIQUE_PARAM:EDIT"}
						authorizationDel={"OPTIQUE_PARAM:DEL"}
						process={"Bibliothèque"}
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

export const ParamOthersOptique = Store.withStore(ParamComp);
