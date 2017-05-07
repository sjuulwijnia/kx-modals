import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { KxModalModule } from '../../../src';
import { ModalService } from './modal.service';

import { ConfirmModalComponent } from './confirm-modal.component/confirm-modal.component';
import { NotifyModalComponent } from './notify-modal.component/notify-modal.component';
import { WaitModalComponent } from './wait-modal.component/wait-modal.component';

@NgModule({
	imports: [
		CommonModule,
		BrowserAnimationsModule,

		KxModalModule.forRoot()
	],

	declarations: [
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

	exports: [
		KxModalModule
	]
})
export class ModalModule {

}
