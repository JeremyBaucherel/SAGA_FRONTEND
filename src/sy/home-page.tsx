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

        let isOptique = Common.hasAuthorization(this.props.user, 'OPTIQUE:DISPLAY');
        let isMetal = Common.hasAuthorization(this.props.user, 'METAL:DISPLAY');
        let isComsE = Common.hasAuthorization(this.props.user, 'COMS-E:DISPLAY');
        let isComsM = Common.hasAuthorization(this.props.user, 'COMS-M:DISPLAY');

        let isOnlyOptique = (isOptique && !isMetal && !isComsE && !isComsM);
        let isOnlyMetal = (isMetal && !isOptique && !isComsE && !isComsM);
        let isOnlyComsE = (isComsE && !isOptique && !isMetal && !isComsM);
        let isOnlyComsM = (isComsM && !isOptique && !isMetal && !isComsE);

        let affOptique;
        if(isOptique){affOptique = (this.renderOptique())};
        let affMetal;
        if(isMetal){affMetal = (this.renderMetal())};
        let affComsE;
        if(isComsE){affComsE = (this.renderComsE())};
        let affComsM;
        if(isComsM){affComsM = (this.renderComsM())};

        if (isOnlyOptique) {
            return (<ReactRouterDOM.Redirect to="/optique/dashboard" />);
        } else if (isOnlyMetal) {
            return (<ReactRouterDOM.Redirect to="/metal/dashboard" />);
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
                                        {affOptique}
                                        {affMetal}
                                        {affComsE}
                                        {affComsM}
                                    </Col>        
                                </BoxBody>
                                <BoxFooter>
                                    © {dateJour.getFullYear()} - ASGARD Application
                                </BoxFooter>
                            </Box>
                        </Row>
                    </PageBody>
                </Page>
            );
        }
    }
    
    renderOptique(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'OPTIQUE:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.SETTINGS_INPUT_COMPONENT} secondary to="/optique/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/optique/dashboard"><strong>Process Fibre Optique</strong></ReactRouterDOM.Link>
                                <p>Dashboard du process Fibre Optique</p>
                            </VFlex>
                        </HFlex>
                    </BoxBody>    
                </Box>               
            );
        }
        return null;
    }

    renderMetal(): React.ReactNode {
        if (Common.hasAuthorization(this.props.user, 'METAL:DISPLAY')) {
            return (
                <Box withBorder style={{width:'500px', marginTop:'10px'}}>
                    <BoxBody>
                        <HFlex>
                            <Button icon={EIcon.SHOW_CHART} secondary to="/metal/dashboard" />
                            <VFlex>
                                <ReactRouterDOM.Link to="/metal/dashboard"><strong>Process Métal</strong></ReactRouterDOM.Link>
                                <p>Dashboard du process Metal</p>
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
                            <Button icon={EIcon.SHARE} secondary to="/coms/dashboard" />
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