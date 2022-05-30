/**
 * 405 page.
 * 
 * @TODO Should be more helpful.
 */

import * as React from 'react';
import {AlertBox, EIcon, Page, PageBody} from 'stk';
import {Toolbar, ToolbarTitle} from '../ui/toolbar';

export class NotAuthorizedAlert extends React.PureComponent<{}, {}> {
	render() {
		return (<AlertBox icon={EIcon.LOCK} title="Autorisations manquantes" text="Vous n'avez pas les autorisations pour accéder à cette page" />);
	}
}

export class NotAuthorizedPage extends React.PureComponent<{}, {}> {
	render () {
		return (
			<Page title="Autorisations manquantes">
				<Toolbar>
						<ToolbarTitle><h1><strong>Autorisations manquantes</strong></h1></ToolbarTitle>
				</Toolbar>
				<PageBody>
					<NotAuthorizedAlert />
				</PageBody>
			</Page>
		);
	}
}