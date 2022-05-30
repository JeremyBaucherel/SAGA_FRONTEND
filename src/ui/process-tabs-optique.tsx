import * as React from 'react';
import {ToolbarTabs, ToolbarTab} from './toolbar';
import * as Store from '../sy/store';

interface OptiqueTabsProps {
	user?: Store.User;
    activeTab: OptiqueTabs;
}

export interface TabUrlOptique {
    dashboardUrl: string;
    paramPfeUrl: string;
    paramGtiUrl: string;
    paramOthersUrl: string;
}

export enum OptiqueTabs {
	DASHBOARD = "dashboard",
	PARAMPFE = "parampfe",
	PARAMGTI = "paramgti",
	PARAMOTHERS = "paramautres",
	TYPECABLE = "typecable",
	TYPEPIN = "typepin",
	ROUTINGGTI = "routingGTI",
}

export enum OptiqueTabsTitle {
	DASHBOARD = "Dashboard",
	PARAMPFE = "Param PFE",
	PARAMGTI = "Param GTI",
	PARAMOTHERS = "Param Autres",
	TYPECABLE = "Type de câble",
	TYPEPIN = "Type de Pin",
	ROUTINGGTI = "Routing GTI",
}

export class ProcessTabsOptiqueComp extends React.PureComponent<OptiqueTabsProps, {}> {

	render (): React.ReactNode {
		return (
			<ToolbarTabs>
				{this.renderTab(OptiqueTabs.DASHBOARD, OptiqueTabsTitle.DASHBOARD, './'+OptiqueTabs.DASHBOARD, 'OPTIQUE:DISPLAY')}
				{this.renderTab(OptiqueTabs.PARAMPFE, OptiqueTabsTitle.PARAMPFE, './'+OptiqueTabs.PARAMPFE, 'OPTIQUE:DISPLAY')}
				{this.renderTab(OptiqueTabs.PARAMGTI, OptiqueTabsTitle.PARAMGTI, './'+OptiqueTabs.PARAMGTI, 'OPTIQUE:DISPLAY')}
				{this.renderTab(OptiqueTabs.PARAMOTHERS, OptiqueTabsTitle.PARAMOTHERS, './'+OptiqueTabs.PARAMOTHERS, 'OPTIQUE:DISPLAY')}		
				{this.renderTab(OptiqueTabs.TYPECABLE, OptiqueTabsTitle.TYPECABLE, './'+OptiqueTabs.TYPECABLE, 'OPTIQUE:DISPLAY')}
				{this.renderTab(OptiqueTabs.TYPEPIN, OptiqueTabsTitle.TYPEPIN, './'+OptiqueTabs.TYPEPIN, 'OPTIQUE:DISPLAY')}
				{this.renderTab(OptiqueTabs.ROUTINGGTI, OptiqueTabsTitle.ROUTINGGTI, './'+OptiqueTabs.ROUTINGGTI, 'RoutingGTI:DISPLAY')}
			</ToolbarTabs>
		);
	}

	renderTab (id: OptiqueTabs, label: string, url: string, authorization:string): React.ReactNode {
		if(this.props.user){
			if(this.props.user.hasAuthorization(authorization)){
				return (
					<ToolbarTab label={label} to={url} active={this.props.activeTab === id} />
				);
			}
		}
		return(null);
	}
}
export const ProcessTabsOptique = Store.withStore(ProcessTabsOptiqueComp);

