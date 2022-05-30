import * as React from 'react';
import {Spinner} from 'stk';
import * as Common from '../api/common';
import * as Store from '../store';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';
import * as DateUtils from '../../date-utils';

interface TablogExeProps {
    user?: Store.User;
	process:string;
	authorization:string;
}

interface TablogExeState {
    result: any;
    requestStatus: Common.ECallStatus;
}

export class logExeComp extends React.PureComponent<TablogExeProps, TablogExeState> {

	constructor (props: TablogExeProps) {
		super(props);

		this.state = {
			result: {},
            requestStatus: Common.ECallStatus.RUNNING,
        }

	}

	componentDidMount (): void {
		this.requestData ()
	}

	receiveData (resp: Common.IResponse<any>): void {
		let myresult = resp.body;
		this.setState({
			requestStatus: Common.ECallStatus.OK,
			result: myresult
		});
	}

	receiveDataError (): void {
		this.setState({
			requestStatus: Common.ECallStatus.NOK,
			result:[]
		});
	}

    requestData (): void 
    {
		this.setState({requestStatus: Common.ECallStatus.RUNNING});
        let url_ = new Common.Url(['api', 'param', 'logexecution']);
        Common.postAsJson(url_, {process: this.props.process, authorization:this.props.authorization}, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	render (): React.ReactNode {

		let logExe: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			logExe = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
			logExe = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization(this.props.authorization)) {
			logExe = this.renderlogExe();
		} else {
			logExe = (<NotAuthorizedAlert />);
		}

		return (<div style={{display:'inline', borderBottom:'2px solid #f0f0f0', paddingBottom: '5px'}}>{logExe}</div>);
	}

    renderlogExe (): React.ReactNode {
        var result = this.state.result;

        let dateExecution = result["dateExecution"];
		dateExecution = DateUtils.parseDateDMY(dateExecution, "/");
		dateExecution = DateUtils.formatDate(dateExecution);

		let dateJour = DateUtils.formatDate(new Date());

        let statut = result["statut"];
		let color = '#000000'
		if(statut=="Fin Script" && dateJour==dateExecution){
			color = '#007800'; 
		}else{
			color = '#FF0000'
		}

        return(<span><strong>Dernière mise à jour le: </strong> <span style={{color:color, paddingRight:'20px'}}>{dateExecution}</span></span>);
    }

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}
}


export const LogExe = Store.withStore(logExeComp);