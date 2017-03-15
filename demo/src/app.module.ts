import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { ModalModule } from './modals/modal.module';

@NgModule({
	imports: [
		BrowserModule,

		// modals
		ModalModule
	],

	declarations: [
		AppComponent
	],

	bootstrap: [
		AppComponent
	]
})
export class AppModule { }