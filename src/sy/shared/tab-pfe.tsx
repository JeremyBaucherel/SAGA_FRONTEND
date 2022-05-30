import * as React from 'react';
import {Spinner} from 'stk';
import * as Common from '../api/common';
import * as Store from '../store';
import {NotAuthorizedAlert} from '../not-authorized-page';
import {UnexpectedErrorAlert} from '../error-page';

interface TabPfeProps {
    user?: Store.User;
	process:String;
}

interface TabPfeState {
    result: any;
    requestStatus: Common.ECallStatus;
}

export class TabPfeComp extends React.PureComponent<TabPfeProps, TabPfeState> {

	authorization: string;

	constructor (props: TabPfeProps) {
		super(props);

		this.authorization = '';
		if(this.props.process == "METALLISATION"){
			this.authorization = 'METAL:DISPLAY';
		}else if(this.props.process == "FIBREOPTIQUE"){
			this.authorization = 'OPTIQUE:DISPLAY';
		}

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
        let url_ = new Common.Url(['api', 'param', 'pfe']);
        Common.postAsJson(url_, {process: this.props.process, authorization:this.authorization}, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	render (): React.ReactNode {

		let pfe: React.ReactNode = '';

		if (this.state.requestStatus == Common.ECallStatus.RUNNING) {
			pfe = this.renderRefreshing();
		} else if (this.state.requestStatus == Common.ECallStatus.NOK) {
			pfe = (<UnexpectedErrorAlert />);
		} else if (this.props.user && this.props.user.hasAuthorization(this.authorization)) {
			pfe = this.renderPfe();
		} else {
			return (<NotAuthorizedAlert />);
		}

		return (
            <table style={{color: '#00205e', border: "5px #00205e", borderStyle: "double"}}>
                <thead>
                    <tr style={{backgroundColor:'#00205e', color:'#FFFFFF', padding:'5px'}}>
                        <th>Programme avion</th>
                        <th>Gamme</th>
                        <th>Cpt Gr de Gamme</th>
                        <th>Stations</th>
                        <th>Delta jour (Prépa des coquilles vide)</th>
                        <th>Ecart Date de calcul</th>
						<th>Alerte si retard Prépa</th>
                    </tr>
                </thead>
                {pfe}
            </table>
		);
	}

    renderPfe (): React.ReactNode {
        var result = this.state.result;
        var tabResultPfe = [];
        for(let line in result){

            tabResultPfe.push(
            <tr key={line} style={{textAlign:'center'}}>
                <td style={{padding:'5px'}}>{result[line]["pgm"]}</td>
                <td style={{padding:'5px'}}>{result[line]["gamme"]}</td>
                <td style={{padding:'5px'}}>{result[line]["cptGrGam"]}</td>
                <td style={{padding:'5px'}}>{result[line]["stations"]}</td>
                <td style={{padding:'5px'}}>{result[line]["deltaJour"]}</td>
                <td style={{padding:'5px'}}>{result[line]["ecartDateCalcul"]}</td>
				<td style={{padding:'5px'}}>{result[line]["alerteDatePrepa"]}</td>
            </tr>
            );
        }

        return(<tbody>{tabResultPfe}</tbody>);
    }

	renderRefreshing (): React.ReactNode {
		return (<tbody>
					<tr key={"0"} style={{textAlign:'center'}}>
						<td style={{padding:'5px'}}><Spinner /></td>
					</tr>
				</tbody>
		);
	}
}


export const TabPfe = Store.withStore(TabPfeComp);