import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KxAppComponent } from './app.component';
import { KxAppCodeComponent } from './app-code.component';
import { KxAppService } from './app.service';

import { KxModalModule, SEMANTIC2 } from 'kx-modals';
import { ModalModule } from './modals';

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		KxModalModule.forRoot(SEMANTIC2),
		ModalModule,

		HttpModule
	],
	declarations: [
		KxAppComponent,
		KxAppCodeComponent
	],
	bootstrap: [
		KxAppComponent
	],
	providers: [
		KxAppService
	]
})
export class AppModule { }
