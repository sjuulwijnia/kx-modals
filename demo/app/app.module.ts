import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { AppHomeComponent } from "./app-home.component";

// modals
import { NotifyModalComponent } from "./notify-modal.component";
import { DemoModalModule } from "../demo-modals";
import { KxModalModule } from "../../src";

@NgModule({
	imports: [
		BrowserModule,

		// modals
		DemoModalModule,
		KxModalModule.forRoot({
			modalComponents: [
				{ modalComponent: NotifyModalComponent }
			]
		})
	],

	declarations: [
		AppComponent,
		AppHomeComponent,

		NotifyModalComponent
	],

	entryComponents: [
		NotifyModalComponent
	],

	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
