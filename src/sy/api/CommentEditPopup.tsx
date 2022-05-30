import * as React from 'react';
import {Button, EIcon, FormSmartText, Popup, PopupBody, PopupFooter} from 'stk';

import * as Common from '../api/common';

export interface ICommentEditPopupProps {
    obj_requete:any;
    fermeture_ok:any;
    fermeture_ko:any;
    url: string[];
    placeholder?: string;
    comment?:string;
    onClose: {(): void};
    onCancelled: {(): void};
}

export interface ICommentEditPopupState {
    comment: string;
    commentError?: string;
    requestStatus: Common.ECallStatus;
    placeholder: string;
}

export class CommentEditPopup extends React.Component<ICommentEditPopupProps, ICommentEditPopupState> {
    constructor (props: ICommentEditPopupProps) {
        super(props);

        let placeholder = this.props.placeholder;
        if(placeholder==undefined){placeholder="Commentaire";}

        let comment = this.props.comment;
        if(comment==undefined){comment="";}

        this.state = {
            placeholder: placeholder,
            comment: comment,
            commentError: undefined,
            requestStatus: Common.ECallStatus.NOT_STARTED,
        };
    }

    // On a cliqué sur le bouton "Ajouter"
    onOkClick (): void {
        this.setState({requestStatus: Common.ECallStatus.RUNNING});         

        // Lancement de la requète d'insertion dans la BDD d'une nouvelle relance CFM
        let url_ = new Common.Url(this.props.url);
        let obj_post = this.props.obj_requete;
        if(this.state.comment != ""){obj_post.commentaire=this.state.comment;}
        Common.postAsJson(url_, obj_post, this.receive_comment.bind(this), this.receive_comment_error.bind(this));       
    }

    receive_comment(): void
    {
        this.setState({requestStatus: Common.ECallStatus.OK});
        this.props.onClose();
        this.props.fermeture_ok();
    }

    receive_comment_error(): void
    {
        this.setState({requestStatus: Common.ECallStatus.NOK});
        this.props.onClose();
        this.props.fermeture_ko();
    }


    /**
     * When the comment is edited in the form.
     * @param newComment The current new comment.
     */
    handleChangeComment(newComment: string): void {
        this.setState({comment: newComment})
    }
    render (): React.ReactNode {
        let texte_bouton;
        if(this.props.comment == undefined){texte_bouton="Ajouter";}else{texte_bouton="Modifier";}
        return (
            <Popup onBlanketClick={this.props.onCancelled}>
                <PopupBody>
                    <FormSmartText
                        placeholder={this.state.placeholder}
                        value={this.state.comment}
                        onChange={this.handleChangeComment.bind(this)}
                        icon={EIcon.EDIT}
                        error={this.state.commentError} />
                </PopupBody>
                <PopupFooter>
                    <Button
                    secondary onClick={this.props.onCancelled} enabled={this.state.requestStatus !== Common.ECallStatus.RUNNING}>Annuler</Button>
                    <Button
                        primary
                        onClick={this.onOkClick.bind(this)}
                        loading={this.state.requestStatus === Common.ECallStatus.RUNNING}>
                        <strong>{texte_bouton}</strong>
                    </Button>
                </PopupFooter>
            </Popup>
        );
    }
}

