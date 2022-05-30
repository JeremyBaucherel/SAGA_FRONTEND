/**
 * Edit users.
 */

 import * as React from 'react';
 import * as ReactRouterDOM from 'react-router-dom';
 import {AlertBox, Box, BoxBody, BoxFooter, BoxHeading,EIcon, Col, Row, Page, PageBody, PageBodyLoading, Tooltip, Button} from 'stk';
 import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
 import * as Api from '../api';
 import * as Store from '../store';
 import * as Common from '../api/common';
 
 
 interface IUserDisplayAllMatchProps {
	logon: string;
}


interface IUserDisplayAllProps extends ReactRouterDOM.RouteComponentProps<IUserDisplayAllMatchProps> {
	user: Store.User;
}

interface IUserDisplayAllState {
	userRequest: Api.ECallStatus;
    displayUser: any;
}

export class UserDisplayAllPage extends React.Component<IUserDisplayAllProps, IUserDisplayAllState> {

	constructor (props: IUserDisplayAllProps) {
         super(props);

         this.state = {
			userRequest: Api.ECallStatus.NOT_STARTED,
            displayUser: null,
		}
     }
 
     componentDidMount (): void {
         if (this.isUserAllowed() === true){
             this.requestUserData();
         }
     }

    isUserAllowed (): boolean {
        return this.props.user.hasAuthorization('UTILISATEUR_ALL:DISPLAY');
    }

    requestUserData (): void {
        this.setState({userRequest: Api.ECallStatus.RUNNING});

        let url_ = new Common.Url(['api', 'utilisateurs']);
		Common.getJson(url_, this.receiveUserData.bind(this), this.receiveUserDataError.bind(this));
    }

    receiveUserData (resp: Common.IResponse<any>): void {
        this.setState({
            userRequest: Api.ECallStatus.OK,
            displayUser: resp.body
        });
        console.log(resp.body);
    }

    receiveUserDataError (_: Api.IUserResponse): void {
        this.setState({
            userRequest: Api.ECallStatus.NOK
        });
    }

    render (): React.ReactNode {
        if (this.isUserAllowed() === true){
            if (this.state.userRequest == Api.ECallStatus.RUNNING || this.state.userRequest == Api.ECallStatus.NOT_STARTED) {
                return this.renderLoading();
            }else{
            return this.renderForm();
            }
        } else {
            return this.renderNotAuthorized();
        }
    }

    renderForm(): React.ReactNode {
        let listUser = [];
        if(this.state.displayUser)
        {
            for (let i = 0; i < this.state.displayUser.length; ++i) {
                let user = this.state.displayUser[i];
            
                let auth = [];
                if(user.autorisations.length>0)
                { 
                    for(let a = 0 ; a < user.autorisations.length ; a++){
                        auth.push(<div>{user.autorisations[a]}</div>);
                    }
                }
                let role = [];
                if(user.roles.length>0)
                { 
                    for(let a = 0 ; a < user.roles.length ; a++){
                        role.push(<div>{user.roles[a]}</div>);
                    }
                }
                let gamme = [];
                if(user.gammes.length>0)
                {    
                    let gamold = '';     
                    let cptgr = '';
                    let tab_g = []
                    for(let a = 0 ; a < user.gammes.length ; a++){
                        tab_g = user.gammes[a].split('|');
                        if(tab_g[1] != gamold && gamold != '')
                        {
                            gamme.push(<div>{gamold + " (" + cptgr + ")"}</div>);
                            cptgr = ''
                        }
                        if(cptgr == ''){
                            cptgr = tab_g[0];
                        }else{
                            cptgr = cptgr + ', ' + tab_g[0];
                        }
                        gamold = tab_g[1];
                    }
                    gamme.push(<div>{gamold + " (" + cptgr + ")"}</div>);
                }
                var userEdit;
                if(this.props.user.hasAuthorization('UTILISATEUR:EDIT')){
                    userEdit = (<Tooltip text="Modifier le compte"><Button secondary to={'/utilisateurs/' + user.logon + '/modifier'} icon={EIcon.EDIT} /></Tooltip>);
                }

                listUser.push(<Row>
                                <Col size={2}><span style={{fontSize:'1.2em', textAlign:'left'}}>{user.logon}</span></Col>
                                <Col size={2}><span style={{fontSize:'1.2em', textAlign:'left'}}>{user.name}</span></Col>
                                <Col size={2}><span style={{fontSize:'1.2em', textAlign:'left'}}>{user.familyName}</span></Col>
                                <Col size={4}><span style={{fontSize:'1.2em', textAlign:'left'}}>{role}</span></Col>
                                <Col size={4}><span style={{fontSize:'1.2em', textAlign:'left'}}>{auth}</span></Col>
                                <Col><span style={{fontSize:'1.2em', textAlign:'left'}}>{gamme}</span></Col>
                                <Col size={1}>{userEdit}</Col>
                            </Row>,
                            <Row><Col>&nbsp;</Col></Row>,
                            <Row><Col style={{borderTop:'1px solid black'}}>&nbsp;</Col></Row>
                );
            }
        }
        let dateJour = new Date();
        return (
            <Page title="Liste des utilisateurs">
                <Toolbar>
                    <ToolbarTitle>
                        <h1>Liste des utilisateurs</h1>
                    </ToolbarTitle>
                    { this.props.user.hasAuthorization('UTILISATEUR:ADD')
                        ? (<ToolbarButtons>
                            <Tooltip text="Créer un nouvel utilisateur"><Button secondary to="/utilisateurs/creer" icon={EIcon.PERSON_ADD} /></Tooltip>
                            </ToolbarButtons>)
                        : ''
                    }
                </Toolbar>
                <PageBody>
                <Row fullHeight>
                        <Col>
                            <Box fullHeight>
                                <BoxHeading>
                                    <h2>Liste des utilisateurs</h2>
                                </BoxHeading>
                                <BoxBody style={{overflow:'auto'}}>
                                    <Row>
                                        <Col size={2}><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Logon</span></Col>
                                        <Col size={2}><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Prénom</span></Col>
                                        <Col size={2}><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Nom</span></Col>
                                        <Col size={4}><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Roles</span></Col>
                                        <Col size={3}><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Autorisations</span></Col>
                                        <Col><span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Gammes (CptGr)</span></Col>
                                        <Col size={1}>&nbsp;</Col>
                                    </Row>
                                    <Row><Col style={{borderTop:'1px solid black'}}>&nbsp;</Col></Row>
                                    {listUser}
                                </BoxBody>
                                <BoxFooter>
										© {dateJour.getFullYear()} - SAGA Application
								</BoxFooter>
                            </Box>
                        </Col>
                    </Row>
                </PageBody>
            </Page>
        );
    }

    renderLoading(): React.ReactNode {
        return (
            <Page title="Liste des utilisateurs...">
                <Toolbar title="Liste des utilisateurs..." />
                <PageBody><PageBodyLoading /></PageBody>
            </Page>
        );
    }

    renderNotAuthorized(): React.ReactNode {
        return (
            <Page title="Liste des utilisateurs">
                <Toolbar title="Liste des utilisateurs" />
                <PageBody>
                    <Row fullHeight>
                        <Col>
                            <Box fullHeight>
                                <BoxHeading><h2>Liste des utilisateurs</h2></BoxHeading>
                                <BoxBody>
                                    <AlertBox title="Autorisations insuffisantes">
                                        <p>Vous n'avez pas l'autorisation d'afficher la liste des utilisateurs.</p>
                                    </AlertBox>
                                </BoxBody>
                            </Box>
                        </Col>
                    </Row>
                </PageBody>
            </Page>
        );
    }
 }