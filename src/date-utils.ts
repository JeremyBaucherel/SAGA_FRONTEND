export function isSameDay (date1: Date, date2: Date): Boolean {
	return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()
}

export function	formatDate (dat: Date): string {
    return '' + dat.getFullYear() + "-" + (dat.getMonth() < 9 ? '0' + (dat.getMonth()+1) : dat.getMonth()+1) + "-" + (dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate());
}

export function parseDateDatabase(date: string, sephour:string="-", septime:string=":"): Date{
    let tabMyDate = date.split(" ");

    if(tabMyDate.length > 1){
        let MyDate = tabMyDate[0].split(sephour);
        let MyTime = tabMyDate[1].split(septime);

        // Attention le mois est écrit en index donc commence à 0, on enlève 1 pour la conversion
        // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
        return new Date(Number(MyDate[0]), Number(MyDate[1])-1, Number(MyDate[2]), Number(MyTime[0]), Number(MyTime[1]));
    }else{
        let MyDate = tabMyDate[0].split(sephour);
        return new Date(Number(MyDate[0]), Number(MyDate[1])-1, Number(MyDate[2]));
    }
}
export function parseDateYMD (dateStr: string): Date {
		let y = parseInt(dateStr.substring(0, 4));
		let m = parseInt(dateStr.substring(4, 6)) - 1;
		let d = parseInt(dateStr.substring(6, 8));
		return new Date(y, m, d);
}

export function parseDateDMY (dateStr: string, separator: string): Date | null {
	let parts = dateStr.split(separator);
	if (parts.length == 3) {
		return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
	}
	return null;
}

export function formatDBY (dat: Date): string {
		if (dat != null){
		let months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
		
		var year = dat.getFullYear();
		var month = months[dat.getMonth()];
		var day = dat.getDate();
		let dayStr = day.toString();
		if (dayStr == '1') {
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