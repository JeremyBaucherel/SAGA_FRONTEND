/**
 * 404 page.
 * 
 * @TODO Should be more helpful.
 */

import * as React from 'react';
import {AlertBox, EIcon, Page, PageBody} from 'stk';
import {Toolbar, ToolbarTitle} from '../ui/toolbar';



export class NotFoundPage extends React.PureComponent<{}, {}> {
	render () {
		return (
			<Page title="Page introuvable">
				<Toolbar>
						<ToolbarTitle><h1><strong>Perdu ?</strong></h1></ToolbarTitle>
				</Toolbar>
				<PageBody>
					<AlertBox icon={EIcon.PLACE} title="Vous êtes ici." text="Mais ce n'est probablement pas là où vous voudriez être." />
				</PageBody>
			</Page>
		);
	}
}