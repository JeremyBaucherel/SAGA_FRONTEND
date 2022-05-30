import * as React from 'react';
import {FormList} from 'stk';
import * as Common from '../api/common';
import * as Equals from 'stk/src/equals'

export interface IFormListProps {
	items?: IFormListItem[];
	label?: string;
	enableMultiSelection?: boolean;
	onSelectionChange?: {(newSelection :any): void};
	url?:string[];
	style?: any;
	value?: any[]; // A list of IDs for the items selected
	actualiser?:boolean;
	disabled?: boolean;
}

export interface IResponse<T> {
    status: EResponseStatus;
    body: T;
    errors: any;
    errorsSummary: string;
}

export enum EResponseStatus {
    OK = 'OK',
    NOK = 'NOK',
}

export interface IFormListItem {
	id: any; // ID could be of any type as long as it's unique
	text: string; // Text to be displayed for the item
}

interface IFormListState {
	selectedIds: any;
	items: any[];
	url: string[];
}

export class FormList_ extends React.Component<IFormListProps, IFormListState> 
{
	constructor (props: IFormListProps)
	{
		super(props);

		let selectedIds = [];
		if (this.props.value) {
			selectedIds = this.getInitialSelectedIds(this.props.value);
		}

		this.state = {
			selectedIds: selectedIds,
			items: [],
			url: this.props.url ? this.props.url : []
		};
	}
	
	componentWillReceiveProps(nextProps: IFormListProps): void 
	{
		if (!Equals.equals(this.props, nextProps))
		{
			this.setState({url: nextProps.url ? nextProps.url : []});
			this.requestData(nextProps.url);
		}
	}
	
	// Chargement des propriétés par défaut
	componentWillUpdate (newProps: IFormListProps): void 
	{
		if (!Equals.equals(newProps.value, this.props.value)) 
		{
			this.setState({selectedIds: this.getInitialSelectedIds(newProps.value)});
			this.requestData();
		}
	}
	
	componentDidUpdate(nextProps: IFormListProps)
	{
		// si pas de test, tourne tout le temps
		if (this.props.actualiser != nextProps.actualiser){
			this.requestData();
		}
	}

	getInitialSelectedIds (initialSelectedIds?: any[]): any[] {
		if (this.props.enableMultiSelection !== true) {
			if (initialSelectedIds) {
				return [initialSelectedIds[0]];
			} else {
				return [];
			}
		} else {
			if (initialSelectedIds) {
				return initialSelectedIds;
			} else {
				return [];
			}
		}
	}

	componentDidMount (): void 
	{
		this.requestData();
	}

	receiveData (resp: IResponse<any>): void 
	{
		let items = [];
		for (let i = 0; i < resp.body.length ; ++i) {
			items.push({
				text: resp.body[i].nom,
				id: resp.body[i].id
			});
		}
		this.setState({items: items});
	}

	receiveDataError (): void {
		// FIXME : should handle error
	}

    requestData (url?:string[]): void 
    {
		var tab_url:string[] = url ? url : this.state.url ? this.state.url : [];
		let url_ = new Common.Url(tab_url);
		Common.getJson(url_, this.receiveData.bind(this), this.receiveDataError.bind(this));
	}

	render (): React.ReactNode 
	{
		return (
			<FormList 
				items={this.state.items}
				label={this.props.label}
				enableMultiSelection={this.props.enableMultiSelection}
				onSelectionChange={this.props.onSelectionChange}
				style={this.props.style}
				value={this.state.selectedIds}
				disabled={this.props.disabled}
			>
			</FormList>
		);
	}
}

