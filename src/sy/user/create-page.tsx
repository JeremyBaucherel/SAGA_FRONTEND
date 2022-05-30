/**
 * Create new users.
 */

 import * as React from 'react';
 import {AlertBox, Box, BoxBody, BoxHeading, BoxFooter, Button, EIcon, Icon, Col, Row, Page, PageBody} from 'stk';
 import {Toolbar} from '../../ui/toolbar';
 import * as Api from '../api';
 import * as Store from '../store';
 import {UserForm} from './user-form';
 
 
 interface IUserCreatePageProps {
     user: Store.User;
 }
 
 interface IUserCreatePageState {
     creating: boolean,
     newUser: Api.IUser | null;
     newUserErrors: any | null;
     userAdded: boolean;
     sessionId: string | null;
 }
 
 export class UserCreatePage extends React.Component<IUserCreatePageProps, IUserCreatePageState> {
 
     constructor (props: IUserCreatePageProps) {
         super(props);
 
         this.state = {
             creating: false,
             newUser: null,
             newUserErrors: null,
             userAdded: false,
             sessionId: null,
         }
     }
 
     handleUserChange (user: Api.IUser): void {
         this.setState({newUser: user});
     }
 
     handleUserCreate (): void {
         this.requestCreation();
     }
 
     isUserAllowed (): boolean {
         return this.props.user.hasAuthorization('UTILISATEUR:ADD');
     }
 
     requestCreation (): void {
         this.setState({creating: true});
         Api.postAsJson(new Api.Url(['api', 'utilisateurs', 'creer']),
             this.state.newUser,
             this.receiveCreation.bind(this),
             this.receiveCreationError.bind(this))
     }
 
     receiveCreation (resp: Api.IResponse<any>): void {
         this.setState({
             creating: false,
             userAdded: true,
             sessionId: resp.body.sessionId
         });
     }
     
     receiveCreationError (resp: Api.IResponse<any>): void {
         this.setState({
             creating: false,
             newUserErrors: resp.errors
         });
     }
 
     render (): React.ReactNode {
         if (this.isUserAllowed() === true) {
             let userIsCreated = this.state.userAdded === true && this.state.newUser !== null;
             if (userIsCreated) {
                 return this.renderUserIsCreated();
             } else {
                 return this.renderForm();
             }
         } else {
             return this.renderNotAuthorized();
         }
     }
 
     renderForm(): React.ReactNode {
         return (
             <Page title="Créer un utilisateur">
                 <Toolbar title="Créer un utilisateur" />
                 <PageBody>
                     <UserForm
                         admin={this.props.user}
                         errors={this.state.newUserErrors}
                         onChange={this.handleUserChange.bind(this)}
                         onSubmit={this.handleUserCreate.bind(this)}
                         creating={this.state.creating} />
                 </PageBody>
             </Page>
         );
     }
 
     renderNotAuthorized(): React.ReactNode {
         return (
             <Page title="Créer un utilisateur">
                 <Toolbar title="Créer un utilisateur" />
                 <PageBody>
                     <Row fullHeight>
                         <Col>
                             <Box fullHeight>
                                 <BoxHeading><h2>Création d'un compte utilisateur</h2></BoxHeading>
                                 <BoxBody>
                                     <AlertBox title="Autorisations insuffisantes">
                                         <p>Vous n'avez pas l'autorisation de créer un compte utilisateur.</p>
                                     </AlertBox>
                                 </BoxBody>
                             </Box>
                         </Col>
                     </Row>
                 </PageBody>
             </Page>
         );		
     }
 
     renderUserIsCreated(): React.ReactNode {
         let userLogon = '';
         if (this.state.newUser) {
             userLogon = this.state.newUser.logon;
         }
         let userUrl = '/utilisateurs/' + userLogon;
         let userInitUrl = window.location.protocol + '//' + window.location.host + '/utilisateurs/' + userLogon + '/initialiser/' + this.state.sessionId;
         return (
             <Page title="Créer un utilisateur">
                 <Toolbar title="Créer un utilisateur" />
                 <PageBody>
                     <Row fullHeight>
                         <Col size={12}>
                             <Box fullHeight>
                                 <BoxHeading>
                                     <h2>Utilisateur {userLogon} créé avec succès</h2>
                                     <Button secondary icon={EIcon.PERSON} to={userUrl} />
                                 </BoxHeading>
                                 <BoxBody center>
                                     <Icon style={{fontSize:'10em'}} icon={EIcon.CHECK} />
                                 </BoxBody>
                                 <BoxBody>
                                     <p>Envoyez-lui le lien suivant afin qu'il active son compte :</p>
                                     <p>{userInitUrl}</p>
                                 </BoxBody>
                                 <BoxFooter>
                                     <Button secondary icon={EIcon.PERSON_ADD} to="/utilisateurs/creer">Créer un autre utilisateur</Button>
                                 </BoxFooter>
                             </Box>
                         </Col>
                     </Row>
                 </PageBody>
             </Page>
         );
     }
 }