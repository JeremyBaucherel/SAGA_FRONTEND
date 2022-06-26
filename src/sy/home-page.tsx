/**
 * Home page
 */

import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import {Box, BoxHeading, BoxFooter, BoxBody, Button, Col, EIcon, Padding, Page, PageBody, Row, HFlex, VFlex} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../ui/toolbar';
import * as Store from './store';
import * as Common from './api/common';

interface HomePageCompProps {
    user?: Store.User;
}

export class HomePageComp extends React.PureComponent<HomePageCompProps, {}> {



	render (): React.ReactNode {

        let dateJour = new Date();

        let isBook = Common.hasAuthorization(this.props.user, 'BOOK:DISPLAY');
        let isfilmotheque = Common.hasAuthorization(this.props.user, 'FILMOTHEQUE:DISPLAY');
        let isBluray = Common.hasAuthorization(this.props.user, 'BLURAY:DISPLAY');
        let isComptabilite = Common.hasAuthorization(this.props.user, 'COMPTABILITE:DISPLAY');

        let isOnlyBook = (isBook && !isfilmotheque && !isBluray && !isComptabilite);
        let isOnlyfilmotheque = (isfilmotheque && !isBook && !isBluray && !isComptabilite);
        let isOnlyBluray = (isBluray && !isBook && !isfilmotheque && !isComptabilite);
        let isOnlyComptabilite = (isComptabilite && !isBook && !isfilmotheque && !isBluray);

        let affBook;
        if(isBook){affBook = (this.renderBook())};
        let afffilmotheque;
        if(isfilmotheque){afffilmotheque = (this.renderfilmotheque())};
        let affBluray;
        if(isBluray){affBluray = (this.renderBluray())};
        let affComptabilite;
        if(isComptabilite){affComptabilite = (this.renderComptabilite())};

        if (isOnlyBook) {
            return (<ReactRouterDOM.Redirect to="/book/dashboard" />);
        } else if (isOnlyfilmotheque) {
            return (<ReactRouterDOM.Redirect to="/filmotheque/dashboard" />);
        } else if (isOnlyBluray) {
            return (<ReactRouterDOM.Redirect to="/coms/dashboard" />);
        } else if (isOnlyComptabilite) {
            return (<ReactRouterDOM.Redirect to="/coms/dashboard" />);
        } else {
            return (
                <Page>
                    <Toolbar>
                            <ToolbarTitle><h1>Accueil, choix du Process</h1></ToolbarTitle>
                            <ToolbarButtons></ToolbarButtons>
                    </Toolbar>
                    <PageBody>
                        <Row>
                            <Box style={{width:"100%"}}>
                                <BoxBody style={{display:'flex', alignItems:'center'}}>
                                    <Col style={{display:'flex', flexDirection:'column'}}>                           
                                        {affBook}
                                        {afffilmotheque}
                                        {affBluray}
                                        {affComptabilite}
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
    }
    
    renderBook(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'BOOK:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.MENU_BOOK} secondary to="/book/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/book/dashboard"><strong>Bibliothèque personelle</strong></ReactRouterDOM.Link>
                                <p>Liste des Romans, BD, Encyclopédie etc</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody>    
                </Box>               
            );
        }
        return null;
    }

    renderfilmotheque(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'FILMOTHEQUE:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.MOVIE} secondary to="/filmotheque/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/filmotheque/dashboard"><strong>Filmothèque personelle virtuelle</strong></ReactRouterDOM.Link>
                                <p>Liste des Films disponible dans le NAS</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody> 
                </Box>                  
            );
        }
        return null;
    }

    renderBluray(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'BLURAY:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.MOVIE_FILTER} secondary to="/bluray/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/bluray/dashboard"><strong>Process COMS Elec</strong></ReactRouterDOM.Link>
                                <p>Dashboard du process COMS Elec</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody> 
                </Box>                  
            );
        }
        return null;
    }

    renderComptabilite(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'COMPTABILITE:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody padding={Padding.Large}>
                        <HFlex>
                            <Button icon={EIcon.ACCOUNT_BALANCE} secondary to="/comptabilite/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/comptabilite/dashboard"><strong>Gestion des comptes</strong></ReactRouterDOM.Link>
                                <p>...</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody> 
                </Box>                  
            );
        }
        return null;
    }
}

export const HomePage = Store.withStore(HomePageComp);