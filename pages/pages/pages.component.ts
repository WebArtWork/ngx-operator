import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	OperatorpageService,
	Operatorpage
} from '../../services/operatorpage.service';
import { AlertService, CoreService, HttpService, MongoService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { Router } from '@angular/router';
import { OperatorService } from '../../services/operator.service';

@Component({
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
	module = this._router.url.includes('/admin/') ? 'admin' : 'operator';
	operator = this._router.url
		.replace('/admin/operators/', '')
		.replace('/operator/operators/', '')
		.replace('/pages', '');

	columns = ['name', 'url', 'page', 'json'];

	pages: { _id: string; name: string }[] = [];

	form: FormInterface = this._form.getForm('operatorpage', {
		formId: 'operatorpage',
		title: 'Operator Page',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill page title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Select',
				key: 'page',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select page'
					},
					{
						name: 'Items',
						value: this.pages
					}
				]
			},
			{
				name: 'Tags',
				key: 'url',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill page url'
					},
					{
						name: 'Label',
						value: 'Urls'
					},
					{
						name: 'Button',
						value: 'Add'
					}
				]
			},
			{
				name: 'Tags',
				key: 'json',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill page json'
					},
					{
						name: 'Label',
						value: 'Jsons'
					},
					{
						name: 'Button',
						value: 'Add'
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form.modal<Operatorpage>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					(created as Operatorpage).operator = this.operator;
					this._so.create(created as Operatorpage);
					close();
				}
			});
		},
		update: (doc: Operatorpage) => {
			this._form
				.modal<Operatorpage>(this.form, [], doc)
				.then((updated: Operatorpage) => {
					this._core.copy(updated, doc);
					this._so.save(doc);
				});
		},
		delete: (doc: Operatorpage) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this cservice?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._so.delete(doc);
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'input',
				hrefFunc: (doc: Operatorpage) => {
					return `/${this.module}/operators/${doc.operator}/variables/${doc._id}`;
				}
			}
		]
	};

	get rows(): Operatorpage[] {
		return this._so.operatorpages;
	}

	constructor(
		private _translate: TranslateService,
		private _so: OperatorpageService,
		private _os: OperatorService,
		private _mongo: MongoService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService,
		private _http: HttpService,
		private _router: Router
	) {
		this._mongo.on('operator theme', () => {
			const theme = this._os.doc(this.operator)?.theme;

			if (theme) {
				this._http.get('/api/theme/pages/' + theme, (pages) => {
					for (const page of pages || []) {
						this.pages.push(page);
					}
				});
			}
		});
	}
}
