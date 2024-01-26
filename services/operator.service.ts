import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Operator {
	_id: string;
	name: string;
	description: string;
	theme: string;
	variables: Record<string, unknown>;
}

@Injectable({
	providedIn: 'root'
})
export class OperatorService {
	_operators: any = {};
	operators: Operator[] = [];

	new(): Operator {
		return {} as Operator;
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.operators = mongo.get('operator', {}, (arr: any, obj: any) => {
			this._operators = obj;
		});
	}

	create(
		operator: Operator = this.new(),
		callback = (created: Operator) => {},
		text = 'operator has been created.'
	) {
		if (operator._id) {
			this.save(operator);
		} else {
			this.mongo.create('operator', operator, (created: Operator) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(operatorId: string): Operator {
		if(!this._operators[operatorId]){
			this._operators[operatorId] = this.mongo.fetch('operator', {
				query: {
					_id: operatorId
				}
			});
		}
		return this._operators[operatorId];
	}

	update(
		operator: Operator,
		callback = (created: Operator) => {},
		text = 'operator has been updated.'
	): void {
		this.mongo.afterWhile(operator, ()=> {
			this.save(operator, callback, text);
		});
	}

	save(
		operator: Operator,
		callback = (created: Operator) => {},
		text = 'operator has been updated.'
	): void {
		this.mongo.update('operator', operator, () => {
			if(text) this.alert.show({ text, unique: operator });
		});
	}

	delete(
		operator: Operator,
		callback = (created: Operator) => {},
		text = 'operator has been deleted.'
	): void {
		this.mongo.delete('operator', operator, () => {
			if(text) this.alert.show({ text });
		});
	}
}
