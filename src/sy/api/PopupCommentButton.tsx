import * as React from 'react';
import {Button, Popover, EPosition, ETrigger} from 'stk';
import * as Common from '../api/common';
import {CommentEditPopup} from '../api/CommentEditPopup';


export interface IPopupCommentButtonProps {
	obj_requete: any;
    aff: boolean;
    fermeture_ok:any;
	fermeture_ko:any;
	url: string[];
	texte?: string;
	placeholder?:string;
	onCancelled:any;
}

export interface IPopupCommentButtonState {
	additionRequestStatus: Common.ECallStatus;
	addCommentPopupShown: boolean;
}

export class PopupCommentButton extends React.Component<IPopupCommentButtonProps, IPopupCommentButtonState> {
	constructor (props: IPopupCommentButtonProps) {
		super(props);

		this.state = {
			additionRequestStatus: Common.ECallStatus.NOT_STARTED,
			addCommentPopupShown: false,
		};

		this.handleShowAddCommentPopup = this.handleShowAddCommentPopup.bind(this);
		this.handleHideAddCommentPopup = this.handleHideAddCommentPopup.bind(this);
		this.handleCancelledCommentPopup = this.handleCancelledCommentPopup.bind(this);
    }   

    componentWillReceiveProps(nextProps: IPopupCommentButtonProps): void {
        // On relance la requête seulement lorsque la propriété qui est ici le numéro de l'équipement change.
        if (nextProps.aff == true)
        {
            this.setState({addCommentPopupShown: nextProps.aff});
		}
    }
    
	handleHideAddCommentPopup (): void {
        this.setState({addCommentPopupShown: false});
		this.props.fermeture_ok();
	}
	handleCancelledCommentPopup (): void {
        this.setState({addCommentPopupShown: false});
		this.props.onCancelled();
	}



	handleShowAddCommentPopup (): void {
		this.setState({addCommentPopupShown: true});
	}

	render (): React.ReactNode {
		let comps = [(
			<Popover key="button" position={EPosition.BOTTOM_RIGHT} trigger={ETrigger.CLICK} width="200px">
				<Button secondary loading={this.state.additionRequestStatus == Common.ECallStatus.RUNNING}/>
			</Popover>
		)];
        if (this.state.addCommentPopupShown === true)
        {
			comps.push((<CommentEditPopup 
							obj_requete={this.props.obj_requete}

							comment={this.props.texte} 

							placeholder={this.props.placeholder} 
							url={this.props.url} 
							fermeture_ok={this.props.fermeture_ok} 
							fermeture_ko={this.props.fermeture_ko} 
							key="popup" 
							onClose={this.handleHideAddCommentPopup} 
							onCancelled = {this.handleCancelledCommentPopup}
							/>));
        }
		return comps;
    }
}
