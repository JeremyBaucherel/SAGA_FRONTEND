import * as React from 'react';
import {ToolbarTabs, ToolbarTab} from './toolbar';
import * as Store from '../sy/store';

interface BlurayTabsProps {
	user?: Store.User;
    activeTab: BlurayTabs;
}

export interface TabUrlBluray {
    dashboardUrl: string;
    paramPfeUrl: string;
    paramGtiUrl: string;
    paramOthersUrl: string;
}

export enum BlurayTabs {
	DASHBOARD = "dashboard",
	COFFRET = "coffret",
	SAGA = "SAGA",
	CATEGORIE = "categorie",
	OWNER = 'owner',
	LOCATION = 'location',
}

export enum BlurayTabsTitle {
	DASHBOARD = "Dashboard",
	COFFRET = "Coffret",
	SAGA = "SAGA",
	CATEGORIE = "Catégorie",
	OWNER = "Propriétaire",
	LOCATION = "Emplacement",
}

export class ProcessTabsBlurayComp extends React.PureComponent<BlurayTabsProps, {}> {

	render (): React.ReactNode {
		return (
			<ToolbarTabs>
				{this.renderTab(BlurayTabs.DASHBOARD, BlurayTabsTitle.DASHBOARD, './'+BlurayTabs.DASHBOARD, 'BLURAY_DASHBOARD:DISPLAY')}
				{this.renderTab(BlurayTabs.COFFRET, BlurayTabsTitle.COFFRET, './'+BlurayTabs.COFFRET, 'BLURAY_DASHBOARD:DISPLAY')}
				{this.renderTab(BlurayTabs.SAGA, BlurayTabsTitle.SAGA, './'+BlurayTabs.SAGA, 'BLURAY_DASHBOARD:DISPLAY')}
				{this.renderTab(BlurayTabs.CATEGORIE, BlurayTabsTitle.CATEGORIE, './'+BlurayTabs.CATEGORIE, 'BLURAY_DASHBOARD:DISPLAY')}
				{this.renderTab(BlurayTabs.OWNER, BlurayTabsTitle.OWNER, './'+BlurayTabs.OWNER, 'BLURAY_DASHBOARD:DISPLAY')}
				{this.renderTab(BlurayTabs.LOCATION, BlurayTabsTitle.LOCATION, './'+BlurayTabs.LOCATION, 'BLURAY_DASHBOARD:DISPLAY')}
			</ToolbarTabs>
		);
	}

	renderTab (id: BlurayTabs, label: string, url: string, authorization:string): React.ReactNode {
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
export const ProcessTabsBluray = Store.withStore(ProcessTabsBlurayComp);

