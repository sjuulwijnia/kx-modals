import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KxModalModule } from '../../../lib';

import { ConfirmModalComponent } from './confirm-modal.component';
import { NotifyModalComponent } from './notify-modal.component';

import { ModalService } from './modal.service';

@NgModule({
	imports: [
		CommonModule,
		KxModalModule
	],

	declarations: [
		ConfirmModalComponent,
		NotifyModalComponent
	],

	entryComponents: [
		ConfirmModalComponent,
		NotifyModalComponent
	],

	providers: [
		ModalService
	]
})
export class ModalModule { }
