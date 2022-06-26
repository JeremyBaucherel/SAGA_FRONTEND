import * as React from 'react';
import {ToolbarTabs, ToolbarTab} from './toolbar';
import * as Store from '../sy/store';

interface BookTabsProps {
	user?: Store.User;
    activeTab: BookTabs;
}

export interface TabUrlBook {
    dashboardUrl: string;
    paramPfeUrl: string;
    paramGtiUrl: string;
    paramOthersUrl: string;
}

export enum BookTabs {
	DASHBOARD = "dashboard",
	BOOKPUBLISHING = "bookpublishing",
	AUTEUR = "auteur",
	SAGA = "SAGA",
	CATEGORIE = "categorie",
	OWNER = 'owner',
	LOCATION = 'location',
}

export enum BookTabsTitle {
	DASHBOARD = "Dashboard",
	BOOKPUBLISHING = "Maison d'édition",
	AUTEUR = "Auteur",
	SAGA = "SAGA",
	CATEGORIE = "Catégorie",
	OWNER = "Propriétaire",
	LOCATION = "Emplacement",
}

export class ProcessTabsBookComp extends React.PureComponent<BookTabsProps, {}> {

	render (): React.ReactNode {
		return (
			<ToolbarTabs>
				{this.renderTab(BookTabs.DASHBOARD, BookTabsTitle.DASHBOARD, './'+BookTabs.DASHBOARD, 'BOOK:DISPLAY')}
				{this.renderTab(BookTabs.BOOKPUBLISHING, BookTabsTitle.BOOKPUBLISHING, './'+BookTabs.BOOKPUBLISHING, 'BOOK:DISPLAY')}		
				{this.renderTab(BookTabs.AUTEUR, BookTabsTitle.AUTEUR, './'+BookTabs.AUTEUR, 'BOOK:DISPLAY')}
				{this.renderTab(BookTabs.SAGA, BookTabsTitle.SAGA, './'+BookTabs.SAGA, 'BOOK:DISPLAY')}
				{this.renderTab(BookTabs.CATEGORIE, BookTabsTitle.CATEGORIE, './'+BookTabs.CATEGORIE, 'BOOK:DISPLAY')}
				{this.renderTab(BookTabs.OWNER, BookTabsTitle.OWNER, './'+BookTabs.OWNER, 'BOOK:DISPLAY')}
				{this.renderTab(BookTabs.LOCATION, BookTabsTitle.LOCATION, './'+BookTabs.LOCATION, 'BOOK:DISPLAY')}
			</ToolbarTabs>
		);
	}

	renderTab (id: BookTabs, label: string, url: string, authorization:string): React.ReactNode {
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
export const ProcessTabsBook = Store.withStore(ProcessTabsBookComp);

