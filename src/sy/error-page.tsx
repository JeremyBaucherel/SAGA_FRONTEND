/**
 * 500 page.
 * 
 * @TODO Should be more helpful.
 */

import * as React from 'react';
import {AlertBox, EIcon} from 'stk';
import {Toolbar, ToolbarTitle} from '../ui/toolbar';

interface UnexpectedErrorAlertProps {
	error?: any;
}
export class UnexpectedErrorAlert extends React.PureComponent<UnexpectedErrorAlertProps, {}> {
	constructor (props: UnexpectedErrorAlertProps) {
		super(props);
	}
	render() {
		var tabText = [];
		if(this.props.error){
			for(let el in this.props.error){
				tabText.push(el + ": " + this.props.error[el].toString());
			}
		}
		tabText.push("Vous pouvez essayer de rafraîchir la page.");

		return (<AlertBox icon={EIcon.ERROR_OUTLINE} title="Une erreur inattendue s'est produite" tabText={tabText} />);
	}
}
