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
		KxModalModule.forRoot(
			// optionally set global styling here, e.g.:
			// {
			// 	defaultSettings: {
			// 		modalContainerClasses: 'my-custom-container-class-that-can-be-overridden-on-individual-basis',
			// 		modalDialogClasses: 'my-custom-dialog-class-that-can-be-overridden-on-individual-basis',

			// 		dismissByClick: true,
			// 		dismissByEscape: true,
			// 		dismissCausesError: false
			// 	},

			// 	globalStyleSettings: {
			// 		backdropClasses: 'my-custom-backdrop-class',
			// 		containerClasses: 'my-custom-container-class',
			// 		dialogClasses: 'my-custom-dialog-class'
			// 	}
			// }
		)
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
