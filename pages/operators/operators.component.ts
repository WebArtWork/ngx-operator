import { Component } from "@angular/core";
import { FormService } from "src/app/modules/form/form.service";
import {
	OperatorService,
	Operator,
} from "../../services/operator.service";
import { AlertService, CoreService, MongoService } from "wacom";
import { TranslateService } from "src/app/modules/translate/translate.service";
import { FormInterface } from "src/app/modules/form/interfaces/form.interface";
import { User, UserService } from "src/app/core";
import { Theme, ThemeService } from "src/app/modules/theme/services/theme.service";
import { Router } from "@angular/router";

@Component({
	templateUrl: "./operators.component.html",
	styleUrls: ["./operators.component.scss"],
})
export class OperatorsComponent {
	module = this._router.url.includes('/admin/') ? 'admin' : 'operator';
	columns = ["name", "domain"];
	themes: Theme[] = [];
	users: User[] = [];

	form: FormInterface = this._form.getForm("operator", {
		formId: "operator",
		title: "Operator",
		components: [
			{
				name: "Text",
				key: "name",
				focused: true,
				fields: [
					{
						name: "Placeholder",
						value: "fill operators title",
					},
					{
						name: "Label",
						value: "Title",
					},
				],
			},
			{
				name: "Text",
				key: "description",
				fields: [
					{
						name: "Placeholder",
						value: "fill operators description",
					},
					{
						name: "Label",
						value: "Description",
					},
				],
			},
			{
				name: "Text",
				key: "domain",
				fields: [
					{
						name: "Placeholder",
						value: "fill domain",
					},
					{
						name: "Label",
						value: "Domain",
					},
				],
			},
			{
				name: 'Select',
				key: 'author',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select author'
					},
					{
						name: 'Items',
						value: this.users
					}
				]
			},
			{
				name: 'Select',
				key: 'theme',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select theme'
					},
					{
						name: 'Items',
						value: this.themes
					}
				]
			},
		],
	});

	config = {
		create: this._us.role('admin') ? () => {
			this._form.modal<Operator>(this.form, {
				label: "Create",
				click: (created: unknown, close: () => void) => {
				this._so.create(created as Operator);
					close();
				},
			});
		} : null,
		update: this._us.role('admin') ? (doc: Operator) => {
			this._form
				.modal<Operator>(this.form, [], doc)
				.then((updated: Operator) => {
					this._core.copy(updated, doc);
					this._so.save(doc);
				});
		} : null,
		delete: this._us.role('admin') ? (doc: Operator) => {
			this._alert.question({
				text: this._translate.translate(
					"Common.Are you sure you want to delete this cservice?"
				),
				buttons: [
					{
						text: this._translate.translate("Common.No"),
					},
					{
						text: this._translate.translate("Common.Yes"),
						callback: () => {
							this._so.delete(doc);
						},
					},
				],
			});
		} : null,
		buttons: [
			{
				icon: 'input',
				hrefFunc: (doc: Operator) => {
					return `/${this.module}/operators/${doc._id}/variables`
				}
			},
			{
				icon: 'web',
				hrefFunc: (doc: Operator) => {
					return `/${this.module}/operators/${doc._id}/pages`
				}
			}
		]
	};

	get rows(): Operator[] {
		return this._so.operators;
	}

	constructor(
		private _so: OperatorService,
		private _translate: TranslateService,
		private _mongo: MongoService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService,
		private _ts: ThemeService,
		private _us: UserService,
		private _router: Router
	) {
		this._mongo.on('theme', ()=>{
			this._ts.byModule['operator'] = this._ts.byModule['operator'] || [];
			console.log(this._ts.byModule['operator']);

			for (const theme of this._ts.byModule['operator']) {
				this.themes.push(theme);
			}
			console.log(this.themes);

		});

		this._mongo.on('user', ()=>{
			for (const user of this._us.users) {
				this.users.push(user);
			}
		});
	}
}
