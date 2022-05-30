/**
 * Page for the user profile.
 */

 import * as React from 'react';
 import {Link} from 'react-router-dom';
 import * as ReactRouterDOM from 'react-router-dom';
 import * as Store from '../store';
 import * as Api from '../api';
 import {AlertBox, Box, BoxBody, BoxFooter, BoxHeading, Button, EIcon, Page, PageBody, PageBodyLoading, Row, Spinner, Col, T, Tooltip, TreeNode} from 'stk';
 import * as Common from '../api/common';
 import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
 
interface IUserDisplayProps {
    logon: string;
}

interface IUserEditPageState {
    userRequest: Api.ECallStatus;
    User: Api.IUser | null;
    UserErrors: any | null;
}

class _UserDisplay extends React.Component<IUserDisplayProps, IUserEditPageState> {
 
    constructor (props: IUserDisplayProps) {
        super(props);

        this.state = {
            userRequest: Api.ECallStatus.NOT_STARTED,
            User: null,
            UserErrors: null,
        }
    }

    componentDidMount (): void {
        this.requestUserData();
    }
 
    receiveUserData (resp: Api.IResponse<Api.IUserResponse>): void {
        this.setState({
            userRequest: Api.ECallStatus.OK,
            User: resp.body
        });
    }

    receiveUserDataError (_: Api.IUserResponse): void {
        this.setState({
            userRequest: Api.ECallStatus.NOK
        });
    }
 
    requestUserData (): void {
        this.setState({userRequest: Api.ECallStatus.RUNNING});

        Api.getUser(this.props.logon,
            this.receiveUserData.bind(this),
            this.receiveUserDataError.bind(this));
    }

    render (): React.ReactNode {
        if (this.state.userRequest == Api.ECallStatus.RUNNING || this.state.userRequest == Api.ECallStatus.NOT_STARTED) {
            return this.renderLoading();
        }
        else {
            return this.renderOk();
        }
    }
 
    renderLoading(): React.ReactNode {
        return (
            <Row>
                 <Spinner />
            </Row>
        );
    }
 
    renderOk(): React.ReactNode {
        if(this.state.User)
        {
            return (
                    <Row>
                        <Col style={{paddingRight:"20px", paddingBottom:"20px"}}>
                            <span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Logon:&nbsp;</span>
                            <span style={{fontSize:'1.2em', textAlign:'left'}}>{this.state.User.logon}</span>
                        </Col>
                        <Col>
                            <span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Prénom:&nbsp;</span>
                            <span style={{fontSize:'1.2em', textAlign:'left'}}>{this.state.User.prenom}</span>
                        </Col>
                        <Col>
                            <span style={{fontSize:'1.2em', textAlign:'right', fontWeight:'bold', height:'30px'}}>Nom:&nbsp;</span>
                            <span style={{fontSize:'1.2em', textAlign:'left'}}>{this.state.User.nom}</span>
                        </Col>
                    </Row>
            );
        }else{
            return (
                <Box></Box>
            );      
        }
    }
}

interface _IUserAuthorisationsProps {
    logon: string;
}

interface _IUserAuthorisationsState {
    autorisations:  Api.IUserRole[];
}

class _UserAutorisations extends React.Component<_IUserAuthorisationsProps, _IUserAuthorisationsState> {

    request: Api.JsonCall<Api.IUserRolesResponse>;

    constructor (props: _IUserAuthorisationsProps) {
        super(props);

        this.request = new Api.JsonCall<Api.IUserRolesResponse>();
        this.request.okCallback = this.handleReceiveData.bind(this);
        this.request.nokCallback = this.handleReceiveDataError.bind(this);

        this.state = {autorisations: []};
    }

    componentDidMount (): void {
        this.requestData();
    }

    handleReceiveData (resp: Api.IUserRolesResponse): void {
        this.setState({autorisations: resp.body});
    }

    handleReceiveDataError (): void {
        this.setState({autorisations: []});
    }

    requestData (): void {
        this.request.get(['api', 'utilisateurs', this.props.logon, 'autorisations']);
    }

    render (): React.ReactNode {
        if (this.request.isOk()){
            return this.renderOk();
        } else {
            return this.renderLoading();
        }
    }

    renderLoading (): React.ReactNode {
        return (
            <Row>
                 <Spinner />
            </Row>
        );
    }

    renderOk (): React.ReactNode {
        var roles =  [];
        for (let i = 0; i < this.state.autorisations.length; ++i) {
            let authorizations = [];
            for (let j = 0 ; j < this.state.autorisations[i].autorisations.length; ++j) {
                let auth = this.state.autorisations[i].autorisations[j];
                authorizations.push((
                    <TreeNode key={auth.nom} label={auth.description} secondaryLabel={auth.nom} />
                ));
            }

            roles.push((
                <TreeNode key={this.state.autorisations[i].nom} label={(<strong>Rôle {this.state.autorisations[i].nom}</strong>)}>
                    {authorizations}
                </TreeNode>
            ));
        }

        return (
            <Row style={{paddingRight:"20px", paddingBottom:"20px", height: "90%"}}>
                { roles.length > 0
                ? (<BoxBody verticalScroll>{roles}</BoxBody>)
                : (<BoxBody center><strong className="subtle">Cet utilisateur ne dispose d'aucune autorisation.</strong></BoxBody>)
                }
            </Row>
        );
    }
}


interface _IUserAuthorisationsGammeProps {
    logon: string;
}

interface _IUserAuthorisationsGammeState {
    gammes:  Api.IUserGamme[];
}

class _UserAutorisationsGamme extends React.Component<_IUserAuthorisationsGammeProps, _IUserAuthorisationsGammeState> {

    request: Api.JsonCall<Api.IUserRolesResponse>;

    constructor (props: _IUserAuthorisationsGammeProps) {
        super(props);

        this.request = new Api.JsonCall<Api.IUserRolesResponse>();
        this.request.okCallback = this.handleReceiveData.bind(this);
        this.request.nokCallback = this.handleReceiveDataError.bind(this);

        this.state = {gammes: []};
    }

    componentDidMount (): void {
        this.requestData();
    }

    handleReceiveData (resp: Api.IUserGammesResponse): void {
        this.setState({gammes: resp.body});
        console.log("OK")
    }

    handleReceiveDataError (): void {
        this.setState({gammes: []});
    }

    requestData (): void {
        this.request.get(['api', 'utilisateurs', this.props.logon, 'autorisationsgammes']);
    }

    render (): React.ReactNode {
        if (this.request.isOk()){
            return this.renderOk();
        } else {
            return this.renderLoading();
        }
    }

    renderLoading (): React.ReactNode {
        return (
            <Row>
                 <Spinner />
            </Row>
        );
    }

    renderOk (): React.ReactNode {
        var gammes =  [];
        var gammeCpt = [];
        var gamme = "";

        for (let i = 0; i < this.state.gammes.length; i++) {
            if( (i+1)==this.state.gammes.length){
                gammeCpt.push(<TreeNode key={this.state.gammes[i].id} label={this.state.gammes[i].description} secondaryLabel={this.state.gammes[i].cptgrgamme} />)
            }
            if((gamme != this.state.gammes[i].gamme && gamme != "") || (i+1)==this.state.gammes.length){
                gammes.push((
                    <TreeNode key={i} label={(<strong>Gamme {gamme}</strong>)}>
                        {gammeCpt}
                    </TreeNode>
                ));
                gammeCpt = [];
            }
            gammeCpt.push(<TreeNode key={this.state.gammes[i].id} label={this.state.gammes[i].description} secondaryLabel={this.state.gammes[i].cptgrgamme} />)

            gamme = this.state.gammes[i].gamme;
        }

        return (
            <Row style={{paddingRight:"20px", paddingBottom:"20px", height: "100%"}}>
                { gammes.length > 0
                ? (<BoxBody verticalScroll>{gammes}</BoxBody>)
                : (<BoxBody center><strong className="subtle">Cet utilisateur ne dispose d'aucune autorisation.</strong></BoxBody>)
                }
            </Row>
        );
    }
}

interface IUserMatchProps {
    logon: string;
}

interface IUserPageProps extends ReactRouterDOM.RouteComponentProps<IUserMatchProps> {
    user?: Store.User;
}

interface IUserPageState {
    user: Api.IUser | null;
    error: any
    requestStatus: Common.ECallStatus;
}

export default class UserPageComponent extends React.Component<IUserPageProps, IUserPageState> {

    request: Api.JsonCall<Api.IUserResponse>;

    constructor (props: IUserPageProps) {
        super(props);

        this.request = new Api.JsonCall<Api.IUserResponse>();
        this.request.okCallback = this.receiveData.bind(this);
        this.request.nokCallback = this.receiveDataError.bind(this);

        this.state = {
            user: null,
            error: false,
            requestStatus: Common.ECallStatus.RUNNING,
        };
    }

    componentDidMount (): void {
        this.requestData(this.props);
    }

    componentWillReceiveProps (newProps: IUserPageProps): void {
        this.requestData(newProps);
    }

    receiveData (resp: Api.IUserResponse): void {
        this.setState({
            user: resp.body,
            error: false,
            requestStatus: Common.ECallStatus.OK,
        });
    }

    receiveDataError (resp: Api.IUserResponse): void {
        this.setState({
            user: null,
            error: resp.errorsSummary,
            requestStatus: Common.ECallStatus.NOK,
        });
    }

    requestData (props: IUserPageProps): void {
        this.request.get(['api', 'utilisateurs', props.match.params.logon]);
    }

    render (): React.ReactNode {
        if (this.state.requestStatus == Common.ECallStatus.RUNNING){
            return this.renderLoading();
        } else if (this.request.isOk()) {
            return this.renderOk();
        } else {
            return this.renderError();
        }
    }

    renderError(): React.ReactNode {
        return (
            <Page title="Utilisateur introuvable">
                <Toolbar>
                    <ToolbarTitle>
                        <h1>Utilisateur introuvable</h1>
                    </ToolbarTitle>
                </Toolbar>
                <PageBody>
                    <AlertBox>
                        <h2><strong><em>{this.state.error}</em></strong></h2>
                    </AlertBox>
                </PageBody>
            </Page>
        );
    }

    renderLoading(): React.ReactNode {
        return (
            <Page title="Utilisateur...">
                <Toolbar>
                    <ToolbarTitle>
                        <h1>Utilisateur...</h1>
                    </ToolbarTitle>
                </Toolbar>
                <PageBody>
                    <PageBodyLoading />
                    </PageBody>
            </Page>
        );
    }

    renderOk(): React.ReactNode {
        
    if(this.state.user){

        let affButtonBarUser:boolean = false;
        let createuser;
        if(this.props.user && this.props.user.hasAuthorization('UTILISATEUR:ADD')){
            createuser = (<Tooltip text="Créer un nouvel utilisateur"><Button secondary to="/utilisateurs/creer" icon={EIcon.PERSON_ADD} /></Tooltip>);
            affButtonBarUser = true;
        }
        let affAllUser;
        if(this.props.user && this.props.user.hasAuthorization('UTILISATEUR_ALL:DISPLAY')){
            affAllUser = (<Tooltip text="Liste des utilisateurs"><Button secondary to={'/utilisateurs/afficher'} icon={EIcon.PERSON} /></Tooltip>);
            affButtonBarUser = true;
        }
        let affEditUser;
        if(this.props.user && (this.props.user.hasAuthorization('UTILISATEUR:EDIT') || this.props.user.hasAuthorization('UTILISATEUR_GAMME:EDIT'))){
            affEditUser = (<Tooltip text="Modifier mon compte"><Button secondary to={'/utilisateurs/' + this.state.user.logon + '/modifier'} icon={EIcon.EDIT} /></Tooltip>);
            affButtonBarUser = true;
        }
        
        var dateJour = new Date();

        return (
            <Page title={this.state.user.nom + ' ' + this.state.user.prenom}>
                <Toolbar>
                    <ToolbarTitle>
                        <h1>
                            Information de l'utilisateur {this.state.user.prenom} {this.state.user.nom}
                        </h1>
                    </ToolbarTitle>
                {affButtonBarUser
                    ? (<ToolbarButtons>
                        {affEditUser}
                        {affAllUser}
                        {createuser}
                        </ToolbarButtons>)
                    : ''
                }
                </Toolbar>
                <PageBody>
                    <Row fullHeight>
                        <Box style={{width:"100%"}}>
                            <BoxBody style={{display:'flex'}}>
                                <Col>
                                    <Row style={{paddingBottom:"20px"}}><h2>Informations personnelles</h2></Row>
                                    <_UserDisplay logon={this.state.user.logon ? this.state.user.logon : ''} />
                                    <Row><h2>Rôles et autorisations</h2></Row>
                                    <_UserAutorisations logon={this.state.user.logon ? this.state.user.logon : ''} />
                                </Col>
                                <Col>
                                    <Row><h2>Liste des gammes</h2></Row>
                                    <_UserAutorisationsGamme logon={this.state.user.logon ? this.state.user.logon : ''} />
                                </Col>
                            </BoxBody>
                            <BoxFooter>
                                    © {dateJour.getFullYear()} - SAGA Application
                            </BoxFooter>
                        </Box>
                    </Row>
                </PageBody>
            </Page>
        );
    }
    else{
        return this.renderError();
    }
    }
}

 export const UserPage = Store.withStore(UserPageComponent);