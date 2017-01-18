import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { KxModalModule } from "../../src";

import { DemoModalHomeComponent } from "./demo-modal-home.component";

// modals
import { ConfirmModalComponent } from "./confirm-modal.component";

@NgModule({
	imports: [
		CommonModule,

		KxModalModule.forChild({
			modalComponents: [
				{ modalComponent: ConfirmModalComponent }
			]
		})
	],

	declarations: [
		ConfirmModalComponent,

		DemoModalHomeComponent
	],

	entryComponents: [
		ConfirmModalComponent
	],

	exports: [
		DemoModalHomeComponent
	]
})
export class DemoModalModule { }
