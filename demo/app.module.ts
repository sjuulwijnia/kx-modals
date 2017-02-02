import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";

// modals
import {
	ConfirmModalComponent,
	NotifyModalComponent,
	WaitModalComponent
} from "./modals/components";
import { ModalService } from "./modals";
import { KxModalModule } from "../src";

@NgModule({
	imports: [
		BrowserModule,

		// modals
		KxModalModule.forRoot({
			modalComponents: [
				{ modalComponent: ConfirmModalComponent },
				{ modalComponent: NotifyModalComponent },
				{ modalComponent: WaitModalComponent }
			]
		})
	],

	declarations: [
		AppComponent,

		ConfirmModalComponent,
		NotifyModalComponent,
		WaitModalComponent
	],

	entryComponents: [
		ConfirmModalComponent,
		NotifyModalComponent,
		WaitModalComponent
	],

	providers: [
		ModalService
	],

	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
