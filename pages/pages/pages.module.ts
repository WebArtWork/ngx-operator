import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { PagesComponent } from './pages.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: PagesComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		PagesComponent
	],
	providers: []

})

export class PagesModule { }
