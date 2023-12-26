import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { VariablesComponent } from './variables.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: VariablesComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		VariablesComponent
	],
	providers: []

})

export class VariablesModule { }
