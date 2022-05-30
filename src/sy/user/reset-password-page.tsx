/**
 * The actual page for a user to reset his password. He should have received
 * a link to this page by mail, after having requested it.
 */

import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {AlertBox, Box, BoxBody, BoxHeading, Page, PageBody, Col, Row} from 'stk';
import {Toolbar, ToolbarTitle} from '../../ui/toolbar';
import * as Api from '../api';


interface IUserResetPasswordMatchProps {
	logon: string;
	passwordToken: string;
}

interface IUserResetPasswordPageProps extends ReactRouterDOM.RouteComponentProps<IUserResetPasswordMatchProps> {

}

interface IUserResetPasswordPageState {
	error: string | null;
	resetUrl: string | null;
}

export class UserResetPasswordPage extends React.Component<IUserResetPasswordPageProps, IUserResetPasswordPageState> {

	constructor (props: IUserResetPasswordPageProps) {
		super(props);
		
		this.state = {
			error: null,
			resetUrl: null,
		}
	}
	
	componentDidMount (): void {
		this.requestUser();
	}
	
	requestUser (): void {
		Api.resetUserPassword(this.props.match.params.logon,
			this.props.match.params.passwordToken,
			this.receiveUser.bind(this),
			this.receiveUserError.bind(this));
	}
	
	receiveUser (resp: Api.IResponse): void {
		this.setState({
			error: null,
			resetUrl: resp.body.url
		});		
	}

	receiveUserError (): void {
		this.setState({
			error: 'des erreurs',
			resetUrl: null,
		});	
	}
	
	render (): React.ReactNode {
		if (this.state.error || this.state.resetUrl) {
			if (this.state.error !== null) {
				return (
					<Page title="Réinitialiser votre mot de passe">
                        <Toolbar>
                            <ToolbarTitle>
                                <h1><strong>Réinitialiser votre mot de passe</strong></h1>
                            </ToolbarTitle>
                        </Toolbar>
						<PageBody>
                            <Row fullHeight>
                                <Col style={{display:'flex', alignItems:'center'}}>
                                    <Box withBorder style={{width:'40em'}}>
                                        <BoxBody center>											
											<AlertBox>
												<h2><strong>Ce lien n'est pas/plus valide</strong></h2>
												<p>Le lien que vous utilisez a peut-être expiré si vous avez fait une autre demande. Vérifiez que vous utilisez bien le dernier message.</p>
											</AlertBox>
										</BoxBody>					
									</Box>
								</Col>
							</Row>
						</PageBody>
					</Page>
				);
			} else {
				return (<ReactRouterDOM.Redirect to={this.state.resetUrl ? this.state.resetUrl : '/'} />);
			}
		} else {
			return null;
		}
	}
}