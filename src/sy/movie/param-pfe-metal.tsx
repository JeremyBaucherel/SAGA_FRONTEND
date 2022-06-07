import * as React from 'react';
import {Page, PageBody, SpreadsheetColumn} from 'stk';
import {Toolbar, ToolbarTitle, ToolbarButtons} from '../../ui/toolbar';
import * as Store from '../store';
import {ProcessTabsMetal, MetalTabs} from '../../ui/process-tabs-metal';
import {ParamProcess} from '../shared/param-process';

interface ParamProps {
	user?: Store.User;
}

export class ParamComp extends React.PureComponent<ParamProps> {

	constructor (props: ParamProps) {
		super(props);
	}

	render (): React.ReactNode {
		let col = [
			new SpreadsheetColumn('pgm', 'Pgm', 50, "menu", "text", true, false, undefined, undefined, true, false, true),
			new SpreadsheetColumn('gamme', 'Gamme', 120, "menu", "text", true, false, undefined, undefined, false, false, true),
			new SpreadsheetColumn('cptGrGam', 'CptGrGam', 85, "menu", "int", true, false, undefined, undefined, false, false, true),
			new SpreadsheetColumn('stations', 'Stations', 120, "text", "text", true, false, undefined, undefined, false, true, true),
			new SpreadsheetColumn("deltaJour", 'Prépa coquille vide (jour en avance)', 150, "text", "int", true, false, undefined, undefined, false, true, true),
			new SpreadsheetColumn("alerteDatePrepa", 'Alerte date prépa PV (jour en avance)', 150, "text", "int", true, false, undefined, undefined, false, true, true),
		];

		let title="Paramétrage PFE - Process Métallisation";

		return (
			<Page title={title}>
				<Toolbar>
					<ToolbarTitle>
						<h1>{title}</h1>
                    </ToolbarTitle>
                    <ToolbarButtons></ToolbarButtons>
					<ProcessTabsMetal activeTab={MetalTabs.PARAMPFE} />
				</Toolbar>
				
				<PageBody fullWidth>
					<ParamProcess 
						url={['api', 'param', 'pfe']} 
						urlEdit={['api', 'param', 'ParamPFE', 'edit']} 
						authorization={"METAL:DISPLAY"}
						authorizationEdit={"METAL_PARAM:EDIT"}
						process={"METALLISATION"}
						pageTitle={title} 
						col={col}
						rowIndex={["id"]} 
						style={{textAlign:"center"}}
					/>
				</PageBody>
			</Page>
		);
	}
}

export const ParamPfeMetal = Store.withStore(ParamComp);
