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
        let isMovie = Common.hasAuthorization(this.props.user, 'MOVIE:DISPLAY');
        let isComsE = Common.hasAuthorization(this.props.user, 'COMS-E:DISPLAY');
        let isComsM = Common.hasAuthorization(this.props.user, 'COMS-M:DISPLAY');

        let isOnlyBook = (isBook && !isMovie && !isComsE && !isComsM);
        let isOnlyMovie = (isMovie && !isBook && !isComsE && !isComsM);
        let isOnlyComsE = (isComsE && !isBook && !isMovie && !isComsM);
        let isOnlyComsM = (isComsM && !isBook && !isMovie && !isComsE);

        let affBook;
        if(isBook){affBook = (this.renderBook())};
        let affMovie;
        if(isMovie){affMovie = (this.renderMovie())};
        let affComsE;
        if(isComsE){affComsE = (this.renderComsE())};
        let affComsM;
        if(isComsM){affComsM = (this.renderComsM())};

        if (isOnlyBook) {
            return (<ReactRouterDOM.Redirect to="/book/dashboard" />);
        } else if (isOnlyMovie) {
            return (<ReactRouterDOM.Redirect to="/movie/dashboard" />);
        } else if (isOnlyComsE) {
            return (<ReactRouterDOM.Redirect to="/coms/dashboard" />);
        } else if (isOnlyComsM) {
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
                                        {affMovie}
                                        {affComsE}
                                        {affComsM}
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

    renderMovie(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'MOVIE:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.LOCAL_MOVIES} secondary to="/movie/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/movie/dashboard"><strong>Filmothèque personelle virtuelle</strong></ReactRouterDOM.Link>
                                <p>Liste des Films disponible dans le NAS</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody> 
                </Box>                  
            );
        }
        return null;
    }

    renderComsE(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'COMS-E:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.MOVIE} secondary to="/coms/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/coms/dashboard"><strong>Process COMS Elec</strong></ReactRouterDOM.Link>
                                <p>Dashboard du process COMS Elec</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody> 
                </Box>                  
            );
        }
        return null;
    }

    renderComsM(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'COMS-M:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody padding={Padding.Large}>
                        <HFlex>
                            <Button icon={EIcon.BUILD} secondary to="/coms/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/coms/dashboard"><strong>Process COMS Méca</strong></ReactRouterDOM.Link>
                                <p>Dashboard du process COMS Méca</p>
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