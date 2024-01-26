import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { CoreService, HttpService, MongoService } from 'wacom';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { FormComponentInterface } from 'src/app/modules/form/interfaces/component.interface';
import {
	Operator,
	OperatorService
} from 'src/app/modules/operator/services/operator.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/modules/theme/services/theme.service';
import { Operatorpage, OperatorpageService } from '../../services/operatorpage.service';

@Component({
	templateUrl: './variables.component.html',
	styleUrls: ['./variables.component.scss']
})
export class VariablesComponent {
	operator = this._router.url.split('/')[3];
	page =
		this._router.url.split('/').length === 6
			? this._router.url.split('/')[5]
			: null;
	variables: FormComponentInterface[] = [];
	form: FormInterface = this._form.getForm('variables', {
		formId: 'variables',
		title: 'Variables',
		components: this.variables
	});

	submition: Record<string, unknown>;
	loading = false;
	setVariables() {
		this.loading = true;
		this.submition = {};
		this.variables.splice(0, this.variables.length);
		const operator: Operator = this._os.doc(this.operator);
		const page: Operatorpage = this._ps.doc(this.page as string);
		const folder = this._ts.doc(operator.theme as string).folder;

		this._http.get(
			`/api/theme/${this.page ? 'page' : 'template'}/variables/${folder}${
				this.page ? '/' + page.page : ''
			}`,
			(resp) => {
				let focused = true;
				for (const variable in resp.variables) {
					this.variables.push({
						key: variable,
						name: 'Text',
						root: true,
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

					this.submition[variable] =
						typeof operator.variables[variable] === 'undefined'
							? resp.variables[variable]
							: operator.variables[variable];
				}
				this.loading = false;
			}
		);
	}

	update(variables: any) {
		this._mongo.afterWhile(this, () => {
			const operator: Operator = this._os.doc(this.operator);
			if (this.page) {
				if (!operator.variables[this.page]) {
					operator.variables[this.page] = {};
				}
				this._core.copy(variables, operator.variables[this.page]);
			} else {
				this._core.copy(variables, operator.variables);
			}
			this._mongo.update(
				'operator',
				{
					_id: this.operator,
					variables: operator.variables
				},
				{
					name: 'operator'
				}
			);
		});
	}

	constructor(
		private _ps: OperatorpageService,
		private _mongo: MongoService,
		private _os: OperatorService,
		private _http: HttpService,
		private _core: CoreService,
		private _form: FormService,
		private _ts: ThemeService,
		private _router: Router
	) {
		this._mongo.on('operator theme', () => {
			this.setVariables();
		});
	}
}
