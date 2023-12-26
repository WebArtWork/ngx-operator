import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { OperatorsComponent } from './operators.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: OperatorsComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		OperatorsComponent
	],
	providers: []

})

export class OperatorsModule { }
