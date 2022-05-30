import './date.css';
import * as React from 'react';
import {Button} from './button';
import {Data, DataCell, DataRow} from './data';
import {EIcon, Icon} from './icon';
import {VFlex} from './flex';
import {EPosition, ETrigger, Popover} from './popover';
import {PopupBody, PopupFooter} from './popup';
import {T} from './text';

export function parseDateYMD (dateStr: string): Date {
	let y = parseInt(dateStr.substring(0, 4));
	let m = parseInt(dateStr.substring(4, 6)) - 1;
	let d = parseInt(dateStr.substring(6, 8));
	return new Date(y, m, d);
}

export function formatDBY (dat: Date): string {
	if (dat != null){
		let months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
		
		let year = dat.getFullYear();
		let month = months[dat.getMonth()];
		let day = dat.getDate();
		let dayStr = '' + day;
		if (day == 1) {
			dayStr = '1er';
		}
		return dayStr + ' ' + month + ' ' + year;
	} else {
		return '';
	}
}

export function formatYMD (dat: Date): string {
	if (dat != null){
		var year = dat.getFullYear();
		var month = (dat.getMonth() < 9 ? '0' + (dat.getMonth()+1) : dat.getMonth()+1);
		var day = (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate());
		return '' + year + '' + month + '' + day;
	} else {
		return '';
	}
}

export interface IDayRangePickerProps {
	dayStart?: Date;
	dayEnd?: Date;
	viewButton?: boolean;
	onChange?: (dateStart: Date, dateEnd: Date) => void;
	onClose?: () => void;
}

export interface IDayRangePickerState {
	popupShown: boolean;
	dayStart: Date;
	dayEnd: Date;
}

export class DayRangePicker extends React.Component<IDayRangePickerProps, IDayRangePickerState> {
	target?: React.ReactNode;

	constructor (props: IDayRangePickerProps) {
		super(props);
		
		this.state = {
			popupShown: false,
			dayStart: this.props.dayStart !== undefined ? this.props.dayStart : new Date(),
			dayEnd: this.props.dayEnd !== undefined ? this.props.dayEnd : new Date(),
		};
		this.handleOpenPopup = this.handleOpenPopup.bind(this);
		this.handleClosePopup = this.handleClosePopup.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.target = null;
	}
	
	handleDateChange (dayStart: Date, dayEnd: Date, modified: string): void {
		if (dayStart != null && dayEnd == null){
			dayEnd = new Date(dayStart.getTime());
		} else if (dayStart == null && dayEnd != null){
			dayStart = new Date(dayEnd.getTime());
		}
		
		if (modified == 'start' && dayStart.getTime() > dayEnd.getTime()){
			dayEnd = new Date(dayStart.getTime());
		}
		
		if (modified == 'end' && dayEnd.getTime() < dayStart.getTime()){
			dayStart = new Date(dayEnd.getTime());
		}
		
		this.setState({
			dayStart: dayStart,
			dayEnd: dayEnd,
		});

		if (this.props.onChange) {
			this.props.onChange(dayStart, dayEnd);
		}
	}
	
	handleOpenPopup (): void {
		this.setState({popupShown: true});
	}
	
	handleClosePopup (): void {
		this.setState({popupShown: false});
		if(this.props.onClose){
			this.props.onClose();
		}
	}
	
	render (): React.ReactNode {
		return (
			<Popover width="800px" trigger={ETrigger.CLICK} position={EPosition.BOTTOM_LEFT} allowReposition={true}>
				<Button secondary ref={(el) => {this.target=el}} onClick={this.handleOpenPopup} icon={EIcon.EVENT}>
					<strong>{formatDBY(this.state.dayStart)}</strong>
					<T subtle> &mdash; </T> 
					<strong>{formatDBY(this.state.dayEnd)}</strong>
					<Icon icon={EIcon.ARROW_DROP_DOWN} />
				</Button>
				<DayRangePickerPopup dayStart={this.state.dayStart} dayEnd={this.state.dayEnd} onChange={this.handleDateChange} onClose={this.handleClosePopup} viewButton={this.props.viewButton}/>
			</Popover>
		);
	}
}

interface IDayRangePickerCalendarProps {
	year?: number;
	month?: number;
	selectedDay?: Date;
	onSelectDay?: (dat: Date) => void;
	onSelectMonth?: (firstDayOfMonth: Date, lastDayOfMonth: Date) => void;
	onDoubleSelectDay?: (dat: Date) => void;
}

interface IDayRangePickerCalendarState {
	year?: number;
	month?: number;
	selectedDay?: Date;
}

class Calendar extends React.Component<IDayRangePickerCalendarProps, IDayRangePickerCalendarState> {

	constructor (props: IDayRangePickerCalendarProps) {
		super(props);
		this.state = {
			year: this.getDefaultYear(props),
			month: this.getDefaultMonth(props),
			selectedDay: this.props.selectedDay,
		}

		this.handleMoveNextMonth = this.handleMoveNextMonth.bind(this);
		this.handleMovePreviousMonth = this.handleMovePreviousMonth.bind(this);
		this.handleSelectDay = this.handleSelectDay.bind(this);
		this.handleSelectMonth = this.handleSelectMonth.bind(this);
		this.handleDoubleSelectDay = this.handleDoubleSelectDay.bind(this);
	}
	
	getDefaultYear (props: IDayRangePickerCalendarProps): number {
		if (props.selectedDay) {
			return props.selectedDay.getFullYear();
		} else if (props.year) {
			return props.year;
		} else {
			return new Date().getFullYear();
		}
	}

	getDefaultMonth (props: IDayRangePickerCalendarProps): number {
		if (props.selectedDay) {
			return props.selectedDay.getMonth() + 1;
		} else if (props.month) {
			return props.month;
		} else {
			return new Date().getMonth();
		}
	}

	componentWillReceiveProps (nextProps: IDayRangePickerCalendarProps): void {
		if (nextProps.selectedDay != undefined){
			this.setState({
				year: nextProps.selectedDay.getFullYear(),
				month: nextProps.selectedDay.getMonth() + 1,
				selectedDay: nextProps.selectedDay,
			});
		} else if (nextProps.year != undefined && nextProps.month != undefined) {
			this.setState({
				year: nextProps.year,
				month: nextProps.month,
				selectedDay: undefined,
			});
		} else {
			this.setState({
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				selectedDay: undefined,
			});
		}
	}
	
	getMonthName(month: number): string{
		return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][month];
	}
	
	handleMoveNextMonth (): void {
		if (this.state.year !== undefined && this.state.month !== undefined) {
			var firstDayOfNextMonth = new Date(this.state.year, this.state.month, 0);
			firstDayOfNextMonth.setTime(firstDayOfNextMonth.getTime() + 2 * 86400000);
			this.setState({
				year: firstDayOfNextMonth.getFullYear(),
				month: firstDayOfNextMonth.getMonth() + 1,
			});		
		}
	}
	
	handleMovePreviousMonth (): void {
		if (this.state.year !== undefined && this.state.month !== undefined) {
			var lastDayOfPreviousMonth = new Date(this.state.year, this.state.month - 1, 1);
			lastDayOfPreviousMonth.setTime(lastDayOfPreviousMonth.getTime() - 2 * 86400000);
			this.setState({
				year: lastDayOfPreviousMonth.getFullYear(),
				month: lastDayOfPreviousMonth.getMonth() + 1,
			});
		}
	}
	
	/**
	 * The user clicked on a day.
	 * @param day The day clicked.
	 */
	handleSelectDay (day: Date): void {
		if (this.props.onSelectDay) {
			this.props.onSelectDay(day);
		}
	}
	
	/**
	 * Select a full month.
	 * @param firstDayOfMonth A date representing the first day of the month to be selected.
	 */
	handleSelectMonth (firstDayOfMonth: Date): void {
		if (this.props.onSelectMonth) {
			let lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);

			this.props.onSelectMonth(firstDayOfMonth, lastDayOfMonth);
		}
	}

	/**
	 * User double-clicked on a specific day.
	 * @param day The day clicked.
	 */
	handleDoubleSelectDay (day: Date): void {
		if (this.props.onDoubleSelectDay) {
			this.props.onDoubleSelectDay(day);
		}
	}



	render (): React.ReactNode {		
		if (this.state.year !== undefined && this.state.month !== undefined) {

			var firstDayOfMonth = new Date(this.state.year, this.state.month - 1, 1);

			var weeks = [];
			var days = [];
			var firstDayOfWeek = firstDayOfMonth.getDay() - 1;
			if (firstDayOfWeek == -1){
				firstDayOfWeek = 6;
			}
			
			let dayMs = 86400000;
			var startDate = new Date(firstDayOfMonth.getTime() - (firstDayOfWeek * dayMs));
			var curDate = new Date(startDate.getTime());

			for (let week=0; week < 6; week++){
				days = [];
				for (let day=0; day < 7; day++){
					let isSelected = false;
					let isOutsideMonth = false;

					var cellClass = 'stk-data-cell stk-data-cell-1 stk-data-cell-center stk-data-cell-clickable stk-data-cell-selectable';
					if (this.state.selectedDay && this.state.selectedDay.toDateString() == curDate.toDateString()){
						cellClass += ' stk-data-cell-selected';
						isSelected = true;
					}
					if (curDate.getMonth() != firstDayOfMonth.getMonth()){
						cellClass += ' stk-subtle';
						isOutsideMonth = true;
					}
					let dayKey = curDate.getFullYear().toString() + '-' + curDate.getMonth().toString() + '-' + curDate.getDay();

					days.push((
						<CalendarDay
							isSelected={isSelected}
							isOutsideMonth={isOutsideMonth}
							key={dayKey}
							className={cellClass}
							date={curDate}
							onClick={this.handleSelectDay}
							onDoubleClick={this.handleDoubleSelectDay} />
					));
					// Don't add milliseconds or you will miss DST (Daylight Saving Time)
					curDate = new Date(curDate.getTime());
					curDate.setDate(curDate.getDate() + 1);
				}

				let rowKey = this.state.year.toString() + this.state.month.toString() + week.toString();

				weeks.push((
					<div className="stk-date-calendar-week" key={rowKey}>
						{days}
					</div>
				));
			}

			let monthLabel = <strong>{this.getMonthName(firstDayOfMonth.getMonth()) + ', ' + firstDayOfMonth.getFullYear()}</strong>;
			// If parent wants to be notified if the user clicks the month
			// label, then make it a button.
			if (this.props.onSelectMonth) {
				monthLabel = (<Button flat onClick={() => this.handleSelectMonth(firstDayOfMonth)}>{monthLabel}</Button>);
			}

			return (
				<div>
					<Data>
						<DataRow>
							<DataCell size={0}>
								<Button flat icon={EIcon.CHEVRON_LEFT} onClick={this.handleMovePreviousMonth} />
							</DataCell>
							<DataCell size={12} center>
								{monthLabel}
							</DataCell>
							<DataCell size={0}>
								<Button flat icon={EIcon.CHEVRON_RIGHT} onClick={this.handleMoveNextMonth} />
							</DataCell>
						</DataRow>
					</Data>
					<div className="stk-date-calendar-week">
						<div className="stk-date-calendar-day"><strong>L</strong></div>
						<div className="stk-date-calendar-day"><strong>M</strong></div>
						<div className="stk-date-calendar-day"><strong>M</strong></div>
						<div className="stk-date-calendar-day"><strong>J</strong></div>
						<div className="stk-date-calendar-day"><strong>V</strong></div>
						<div className="stk-date-calendar-day"><strong>S</strong></div>
						<div className="stk-date-calendar-day"><strong>D</strong></div>
					</div>
					{weeks}
				</div>
			);
		} else {
			return null;
		}
	}
}


export interface IDayRangePickerPopupProps {
	dayStart: Date;
	dayEnd: Date;
	onChange?: (dateStart: Date, dateEnd: Date, itemChanged: string) => void;
	onClose?: () => void;
	viewButton?: boolean;
}

export interface IDayRangePickerPopupState {
	dayStart: Date;
	dayEnd: Date;
}

export class DayRangePickerPopup extends React.Component<IDayRangePickerPopupProps, IDayRangePickerPopupState> {

	constructor (props: IDayRangePickerPopupProps){
		super(props);
		
		this.handleSelectDayStart = this.handleSelectDayStart.bind(this);
		this.handleDoubleSelectDayStart = this.handleDoubleSelectDayStart.bind(this);
		this.handleDoubleSelectDayEnd = this.handleDoubleSelectDayEnd.bind(this);
		this.handleSelectDayEnd = this.handleSelectDayEnd.bind(this);

		this.handleSelectThisWeek = this.handleSelectThisWeek.bind(this);
		this.handleSelectLastWeek = this.handleSelectLastWeek.bind(this);
		this.handleSelectLast7Days = this.handleSelectLast7Days.bind(this);
		this.handleSelectLast30Days = this.handleSelectLast30Days.bind(this);
		this.handleSelectMonth = this.handleSelectMonth.bind(this);
		this.handleSelectThisMonth = this.handleSelectThisMonth.bind(this);
		this.handleSelectLastMonth = this.handleSelectLastMonth.bind(this);
		this.handleSelectThisYear = this.handleSelectThisYear.bind(this);
		this.handleValidate = this.handleValidate.bind(this);
		this.handleClose = this.handleClose.bind(this);
		
		this.state = {
			dayStart : this.props.dayStart,
			dayEnd: this.props.dayEnd,
		}				
	}

	handleSelectDayEnd (day: Date): void {
		this.setState({dayEnd: day});
	}

	handleSelectDayStart (day: Date): void {	
		this.setState({dayStart: day});
	}
	
	handleDoubleSelectDayStart (day: Date): void {	

		this.setState({dayStart: day, dayEnd: day});
		if (this.props.onChange) {
			this.props.onChange(day, day, 'start');
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	handleDoubleSelectDayEnd (day: Date): void {	
		this.setState({dayStart: day, dayEnd: day});
		if (this.props.onChange) {
			this.props.onChange(day, day, 'end');
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	handleSelectMonth (firstDayOfMonth: Date, lastDayOfMonth: Date): void {
		this.setState({
			dayStart: firstDayOfMonth,
			dayEnd: lastDayOfMonth,
		});
	}

	handleSelectThisMonth (): void {
		let dayStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);		
		let dayEnd = new Date(dayStart.getFullYear(), dayStart.getMonth() + 1, 0);
		
		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleSelectLastMonth (): void {
		let dayEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
		let dayStart = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), 1);			
		
		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleSelectThisWeek (): void {
		let dayStart = new Date();
		dayStart.setDate(dayStart.getDate() + 1 - dayStart.getDay());
		
		let dayEnd = new Date();
		dayEnd.setDate(dayStart.getDate() + 6);
		
		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleSelectThisYear(): void {
		let dayStart = new Date(new Date().getFullYear(), 0, 1);		
		let dayEnd = new Date();
		
		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleSelectLastWeek (): void {
		let dayStart = new Date();
		dayStart.setDate(dayStart.getDate() + 1 - 7 - dayStart.getDay());
		
		let dayEnd = new Date();
		dayEnd.setDate(dayStart.getDate() + 6);
		
		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
		
	handleSelectLast7Days (): void {
		let dayStart = new Date();
		dayStart.setDate(dayStart.getDate() - 7);
		
		let dayEnd = new Date();

		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleSelectLast30Days (): void {
		let dayStart = new Date();
		dayStart.setDate(dayStart.getDate() - 30);
		
		let dayEnd = new Date();

		this.setState({dayStart: dayStart, dayEnd: dayEnd});
	}
	
	handleClose (): void {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	handleValidate (): void {
		if (this.props.onChange) {
			this.props.onChange(this.state.dayStart, this.state.dayEnd, 'start');
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	render (): React.ReactNode {
		var buttonfiltre: React.ReactNode;
		var displayButtonFiltre = true;
		if(this.props.viewButton !== undefined){
			displayButtonFiltre = this.props.viewButton;
		}

		if(displayButtonFiltre){
			buttonfiltre = (<DataCell size={2}>
				<VFlex>	
					<Button flat onClick={this.handleSelectThisWeek}>Cette semaine</Button>
					<Button flat onClick={this.handleSelectLastWeek}>Semaine dernière</Button>
					<Button flat onClick={this.handleSelectLast7Days}>7 derniers jours</Button>
					<p />
					<Button flat onClick={this.handleSelectThisMonth}>Ce mois-ci</Button>
					<Button flat onClick={this.handleSelectLastMonth}>Mois dernier</Button>
					<Button flat onClick={this.handleSelectLast30Days}>30 derniers jours</Button>
					<p/>
					<Button flat onClick={this.handleSelectThisYear}>{new Date().getFullYear()}</Button>
				</VFlex>
			</DataCell>);
		}

		return (
			<div>
				<PopupBody>
					<Data>
						<DataRow>
							{buttonfiltre}
							<DataCell size={5}>
								<Calendar
									selectedDay={this.state.dayStart}
									onSelectDay={this.handleSelectDayStart}
									onSelectMonth={this.handleSelectMonth}
									onDoubleSelectDay={this.handleDoubleSelectDayStart} />
							</DataCell>
							<DataCell size={5}>
								<Calendar
									selectedDay={this.state.dayEnd} 
									onSelectDay={this.handleSelectDayEnd}
									onSelectMonth={this.handleSelectMonth}
									onDoubleSelectDay={this.handleDoubleSelectDayEnd} />
							</DataCell>							
						</DataRow>
					</Data>
				</PopupBody>
				<PopupFooter>
					<Button flat onClick={this.handleClose}>Annuler</Button>
					<Button primary icon={EIcon.CHECK} onClick={this.handleValidate}><strong>OK</strong></Button>
				</PopupFooter>
			</div>
		);
	}
}

export interface IDayPickerPopupProps {
	selectedDay?: Date;
	onClose?: () => void;
	onSelectDay?: (dat: Date) => void;
}

export interface IDayPickerPopupState {
	date?: Date;
}


export class DayPickerPopup extends React.Component<IDayPickerPopupProps, IDayPickerPopupState> {

	constructor (props: IDayPickerPopupProps) {
		super(props);
		
		this.state = {
			date: this.props.selectedDay ? this.props.selectedDay : new Date
		};
		
		this.handleClose = this.handleClose.bind(this);
		this.handleSelectDay = this.handleSelectDay.bind(this);
		this.handleValidate = this.handleValidate.bind(this);
		this.handleDoubleSelectDay = this.handleDoubleSelectDay.bind(this);
	}
	
	handleClose (): void {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	handleValidate (): void {
		if (this.props.onSelectDay && this.state.date !== undefined) {
			this.props.onSelectDay(this.state.date);
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	handleSelectDay (day: Date): void {
		let datesAreDifferent = this.state.date == undefined || day.getFullYear() != this.state.date.getFullYear() || day.getMonth() != this.state.date.getMonth() || day.getDate() != this.state.date.getDate();
		if (datesAreDifferent) {
			this.setState({date: day});
		} else {
			this.setState({date: undefined});
		}
	}
	
	handleDoubleSelectDay (day: Date): void {
		this.setState({date: day});
		if (this.props.onSelectDay) {
			this.props.onSelectDay(day);
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
	}
	
	render () {
		return (
			<div>
				<PopupBody>
					<Calendar
						selectedDay={this.state.date}
						onSelectDay={this.handleSelectDay}
						onDoubleSelectDay={this.handleDoubleSelectDay} />
				</PopupBody>
				<PopupFooter>
					<Button flat onClick={this.handleClose}>Annuler</Button>
					<Button primary icon={EIcon.CHECK} onClick={this.handleValidate}><strong>OK</strong></Button>
				</PopupFooter>				
			</div>			
		);
	}
}

export interface IDayPickerProps {
	onChange?: (dat: Date) => void;
	onClose?: () => void;
	value?: Date;
}

export interface IDayPickerState {
	value?: Date;
	popupShown: boolean;
}

export class DayPicker extends React.Component<IDayPickerProps, IDayPickerState> {

	constructor (props: IDayPickerProps) {
		super(props);
		
		this.state = {
			value: this.props.value,
			popupShown: false,
		}
		this.handleNextDay = this.handleNextDay.bind(this);
		this.handlePreviousDay = this.handlePreviousDay.bind(this);
		
		this.handleOpenPopup = this.handleOpenPopup.bind(this);
		this.handleClosePopup = this.handleClosePopup.bind(this);
		
		this.handleSelectDay = this.handleSelectDay.bind(this);
	}
	
	handleNextDay (): void {
		if(this.state.value){
			var dat = this.state.value;
			dat.setTime(this.state.value.getTime() + 86400000);
			this.setState({
				value: dat
			});
			if (this.props.onChange) {
				this.props.onChange(dat);
			}
		}
	}
	
	handleClosePopup (): void {
		this.setState({popupShown: false});
		if(this.props.onClose){
			this.props.onClose();
		}
	}
	
	handleOpenPopup (): void {
		this.setState({popupShown: true});
	}
	
	handlePreviousDay (): void {
		if(this.state.value){
			var dat = this.state.value;
			dat.setTime(this.state.value.getTime() - 86400000);

			this.setState({
				value: dat
			});
	
			if (this.props.onChange) {
				this.props.onChange(dat);
			}
		}
	}
	
	handleSelectDay (dat: Date): void {
		this.setState({value: dat, popupShown: false});
		if(this.state.value){
			if (this.props.onChange && dat.getTime() != this.state.value.getTime()){
				this.props.onChange(dat);
			}
		}
	}
	
	formatValue (): string {
		if (this.state.value !== undefined) {
			var dat = this.state.value;
			var year = dat.getFullYear();
			var month = (dat.getMonth() < 9 ? '0' + (dat.getMonth()+1) : dat.getMonth()+1);
			var day = (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate());
			return day + '/' + month + '/' + year;
		} else {
			return '__/__/____';
		}
	}
	
	render (): React.ReactNode {
		return (
			<Popover trigger={ETrigger.CLICK} position={EPosition.BOTTOM_LEFT} width="300px" allowReposition={true}>
				<Button secondary icon={EIcon.EVENT}>
					<strong>{this.formatValue()}</strong>
					<Icon icon={EIcon.ARROW_DROP_DOWN} />
				</Button>
				<DayPickerPopup onClose={this.handleClosePopup} selectedDay={this.state.value} onSelectDay={this.handleSelectDay} />
			</Popover>
		);
	}
}

export interface IDayRangePickerCalendarDayProps {
		className?: string;
		date: Date;
		onClick?: {(dat: Date): void};
		onDoubleClick?: {(dat: Date): void};
		isOutsideMonth: boolean;
		isSelected: boolean;
}

export class CalendarDay extends React.PureComponent<IDayRangePickerCalendarDayProps, {}> {

	constructor (props: IDayRangePickerCalendarDayProps) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
	}
	
	handleClick (): void {
		if (this.props.onClick){
			this.props.onClick(this.props.date);	
		}
	}

	handleDoubleClick (): void {
		if (this.props.onDoubleClick) {
			this.props.onDoubleClick(this.props.date);
		}
	}
	
	render (): React.ReactNode {
		let button = null;
		if (this.props.isSelected === true) {
			button = (<Button primary onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>{this.props.date.getDate()}</Button>);
		} else if (this.props.isOutsideMonth === true) {
			button = (<Button flat onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}><T subtle>{this.props.date.getDate()}</T></Button>);
		} else {
			button = (<Button flat onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>{this.props.date.getDate()}</Button>);
		}

		
		return (
			<div className="stk-date-calendar-day">{button}</div>
		);
	}
}

export interface IRelativeDateProps {
	date: Date;
}

export class RelativeDate extends React.PureComponent<IRelativeDateProps, {}> {
	render () {
		var dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
		var monthNames = ['Jan.', 'Fév.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.'];
		
		var year = this.props.date.getFullYear();
		var month = this.props.date.getMonth();
		var day = this.props.date.getDate();
		
		var date = new Date(year, month, day);
		date.setHours(0, 0, 0, 0);

		var today = new Date();
		today.setDate(today.getDate());
		today.setHours(0, 0, 0, 0);
		
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		yesterday.setHours(0, 0, 0, 0);
		
		var lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 6);
		lastWeek.setHours(0, 0, 0, 0);

		var formatedDate = '';
		if (date.getTime() == today.getTime()){
			formatedDate = 'Aujourd\'hui';
		} else if (date.getTime() == yesterday.getTime()){
			formatedDate = 'Hier';
		} else if (date.getTime() >= lastWeek.getTime()) {
			formatedDate = dayNames[date.getDay()];
		} else {
			var formatedDate = dayNames[date.getDay()];
			formatedDate += ' ';
			formatedDate += date.getDate();
			formatedDate += ' ';
			formatedDate += monthNames[date.getMonth()]
			if (new Date().getFullYear() != date.getFullYear()){
				formatedDate += ' ' + date.getFullYear();
			}
		}
		return (<span>{formatedDate}</span>);
	}
}