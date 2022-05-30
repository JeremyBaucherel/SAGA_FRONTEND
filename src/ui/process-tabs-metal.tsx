import * as React from 'react';
import {ToolbarTabs, ToolbarTab} from './toolbar';
import * as Store from '../sy/store';

interface MetalTabsProps {
	user?: Store.User;
    activeTab: MetalTabs;
}

export interface TabUrlMetal {
    dashboardUrl: string;
    paramPfeUrl: string;
    paramGtiUrl: string;
	paramFullConf: string;
    paramOthersUrl: string;
}

export enum MetalTabs {
	DASHBOARD = "dashboard",
	PARAMPFE = "parampfe",
	PARAMGTI = "paramgti",
	TEMPLATEFULLCONF = "templatefullconf",
	PARAMOTHERS = "paramautres",
	ROUTINGGTI = "routingGTI",
}

export enum MetalTabsTitle {
	DASHBOARD = "Dashboard",
	PARAMPFE = "Param PFE",
	PARAMGTI = "Param GTI",
	TEMPLATEFULLCONF = "Template Full Conf",
	PARAMOTHERS = "Param Autres",
	ROUTINGGTI = "Routing GTI",
}

export class ProcessTabsMetalComp extends React.PureComponent<MetalTabsProps, {}> {

	render (): React.ReactNode {
		return (
			<ToolbarTabs>
				{this.renderTab(MetalTabs.DASHBOARD, MetalTabsTitle.DASHBOARD, './'+MetalTabs.DASHBOARD, 'METAL:DISPLAY')}
				{this.renderTab(MetalTabs.PARAMPFE, MetalTabsTitle.PARAMPFE, './'+MetalTabs.PARAMPFE, 'METAL:DISPLAY')}
				{this.renderTab(MetalTabs.PARAMGTI, MetalTabsTitle.PARAMGTI, './'+MetalTabs.PARAMGTI, 'METAL:DISPLAY')}
				{this.renderTab(MetalTabs.TEMPLATEFULLCONF, MetalTabsTitle.TEMPLATEFULLCONF, './'+MetalTabs.TEMPLATEFULLCONF, 'METAL:DISPLAY')}
				{this.renderTab(MetalTabs.PARAMOTHERS, MetalTabsTitle.PARAMOTHERS, './'+MetalTabs.PARAMOTHERS, 'METAL:DISPLAY')}		
				{this.renderTab(MetalTabs.ROUTINGGTI, MetalTabsTitle.ROUTINGGTI, './'+MetalTabs.ROUTINGGTI, 'RoutingGTI:DISPLAY')}
			</ToolbarTabs>
		);
	}

	renderTab (id: MetalTabs, label: string, url: string, authorization:string): React.ReactNode {
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
export const ProcessTabsMetal = Store.withStore(ProcessTabsMetalComp);

