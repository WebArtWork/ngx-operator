import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { HttpService, MongoService } from 'wacom';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { FormComponentInterface } from 'src/app/modules/form/interfaces/component.interface';
import { Operator, OperatorService } from 'src/app/modules/operator/services/operator.service';

@Component({
	templateUrl: './variables.component.html',
	styleUrls: ['./variables.component.scss']
})
export class VariablesComponent {
	operators: Operator[];
	operator: string;
	variables: FormComponentInterface[] = [];
	form: FormInterface = this._form.getForm('variables', {
		formId: 'variables',
		title: 'Variables',
		components: this.variables
	});

	submition: Record<string, unknown>;
	setVariables(operator_id: string) {
		this.operator = '';
		this.submition = {};
		this.variables.splice(0, this.variables.length);

		const operator: Operator = this.operators.find(o => o._id === operator_id) as Operator;
		let focused = true;
		for (const variable in operator.variables) {
			this.variables.push({
				key: variable,
				name: 'Text',
				focused,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill ' + variable
					},
					{
						name: 'Label',
						value: variable
					}
				]
			});
			focused = false;

			this.submition[variable] = operator.variables[variable];
		}
		console.log(this.variables);

		setTimeout(() => {
			this.operator = operator_id;
		});
	}

	update(variables: any) {
		this._mongo.afterWhile(this, () => {
			console.log('called', {
				_id: this.operator,
				variables: variables.data
			});

			this._mongo.update('operator', {
				_id: this.operator,
				variables: variables.data
			}, {
				name: 'operator'
			});
		});
	}

	constructor(
		private _mongo: MongoService,
		private _form: FormService,
		private _http: HttpService,
		private _os: OperatorService
	) {
		this._http.get('/api/operator/getoperator', (operators) => {
			this.operators = operators;

			if (operators.length) {
				this.setVariables(operators[0]._id);
			}
		});
	}
}
