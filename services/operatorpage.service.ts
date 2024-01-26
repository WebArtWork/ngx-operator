import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Operatorpage {
	_id: string;
	page: string;
	name: string;
	description: string;
	operator: string;
}

@Injectable({
	providedIn: 'root'
})
export class OperatorpageService {
	operatorpages: Operatorpage[] = [];

	_operatorpages: any = {};

	new(): Operatorpage {
		return {} as Operatorpage;
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.operatorpages = mongo.get('operatorpage', {}, (arr: any, obj: any) => {
			this._operatorpages = obj;
		});
	}

	create(
		operatorpage: Operatorpage = this.new(),
		callback = (created: Operatorpage) => {},
		text = 'operator page has been created.'
	) {
		if (operatorpage._id) {
			this.save(operatorpage);
		} else {
			this.mongo.create('operatorpage', operatorpage, (created: Operatorpage) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(operatorpageId: string): Operatorpage {
		if(!this._operatorpages[operatorpageId]){
			this._operatorpages[operatorpageId] = this.mongo.fetch('operatorpage', {
				query: {
					_id: operatorpageId
				}
			});
		}
		return this._operatorpages[operatorpageId];
	}

	update(
		operatorpage: Operatorpage,
		callback = (created: Operatorpage) => {},
		text = 'operator page has been updated.'
	): void {
		this.mongo.afterWhile(operatorpage, ()=> {
			this.save(operatorpage, callback, text);
		});
	}

	save(
		operatorpage: Operatorpage,
		callback = (created: Operatorpage) => {},
		text = 'operator page has been updated.'
	): void {
		this.mongo.update('operatorpage', operatorpage, () => {
			if(text) this.alert.show({ text, unique: operatorpage });
		});
	}

	delete(
		operatorpage: Operatorpage,
		callback = (created: Operatorpage) => {},
		text = 'operator page has been deleted.'
	): void {
		this.mongo.delete('operatorpage', operatorpage, () => {
			if(text) this.alert.show({ text });
		});
	}
}
