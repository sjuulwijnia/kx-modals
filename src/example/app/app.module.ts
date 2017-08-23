import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { ModalModule } from './modals';
import { KxModalModule, BOOTSTRAP3 } from '../../lib';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		ModalModule,
		KxModalModule.forRoot(BOOTSTRAP3)
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
