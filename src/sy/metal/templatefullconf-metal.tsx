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
			new SpreadsheetColumn("NumPoint", "Num Point", 100, "text", "text", true, true, undefined, undefined, true, false, false),
			new SpreadsheetColumn("Fin", "FIN", 110, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("NumExigGTR", "Num exig. GTR", 110, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("Designation_FR", "Designation (FR)", 600, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("Designation_EN", "Designation (EN)", 600, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("Location_FR", "Localisation (FR)", 600, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("Location_EN", "Location (EN)", 600, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("I", "I (A)", 50, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PtMesureA_FR", "Point de mesure A (FR)", 400, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PtMesureA_EN", "Point de mesure A (EN)", 400, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PtMesureB_FR", "Point de mesure B (FR)", 400, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PtMesureB_EN", "Point de mesure B (EN)", 400, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PriseEQT", "Prise EQT", 100, "menu", "text", true, true, undefined, undefined, true, false, false),
			new SpreadsheetColumn("ValMax", "Valeur maxi (mOhm)", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("ValMaxRel", "Valeur max relevee (mOhm)", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("DateMarqueOp", "Date & marque operateur", 200, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("Observations", "Observations", 110, "menu", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("FinPlus", "FIN (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("CaPlus", "CA (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("RfPlus", "RF (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("DsPlus", "DS (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("StdPlus", "STD (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("VersionPlus", "Version (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("FinMoins", "FIN (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("CaMoins", "CA (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("RfMoins", "RF (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("DsMoins", "DS (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("StdMoins", "STD (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("VersionMoins", "Version (-)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("ComposantPlus", "Composant (+)", 250, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("QuantitePlus", "Quantité (+)", 100, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("PvZone", "PV Zone", 300, "menu", "text", true, true, undefined, undefined, true, false, false),
			new SpreadsheetColumn("ClassementPoints", "Classement Points", 150, "text", "text", true, true, undefined, undefined, false, false, false),
			new SpreadsheetColumn("TypePoint", "Type de Point", 110, "menu", "text", true, true, undefined, undefined, false, false, false),
		];

		let title="Template Full Conf - Process Métallisation";

		return (
			<Page title={title}>
				<Toolbar>
					<ToolbarTitle>
						<h1>{title}</h1>
                    </ToolbarTitle>
                    <ToolbarButtons></ToolbarButtons>
					<ProcessTabsMetal activeTab={MetalTabs.TEMPLATEFULLCONF} />
				</Toolbar>
				
				<PageBody fullWidth>
					<ParamProcess 
						url={['api', 'param', 'fullconf']} 
						urlEdit={['api', 'param', 'ParamMetalFullConf_A320', 'edit']} 
						authorization={"METAL:DISPLAY"}
						authorizationEdit={"METAL_PARAM:EDIT"}
						process={"METALLISATION"}
						pageTitle={title} 
						col={col}
						rowIndex={["Fin"]} 
						style={{textAlign:"center"}}
					/>
				</PageBody>
			</Page>
		);
	}
}

export const TemplateFullConfMetal = Store.withStore(ParamComp);
