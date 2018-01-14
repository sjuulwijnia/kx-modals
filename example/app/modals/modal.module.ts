import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KxModalModule } from 'kx-modals';

import { ConfirmModalComponent } from './confirm-modal.component';
import { NotifyModalComponent } from './notify-modal.component';
import { StackingModalComponent } from './stacking-modal.component';
import { WaitModalComponent } from './wait-modal.component';

import { ModalService } from './modal.service';

@NgModule({
	imports: [
		CommonModule,
		KxModalModule
	],

	declarations: [
		ConfirmModalComponent,
		NotifyModalComponent,
		StackingModalComponent,
		WaitModalComponent
	],

	entryComponents: [
		ConfirmModalComponent,
		NotifyModalComponent,
		StackingModalComponent,
		WaitModalComponent
	],

	providers: [
		ModalService
	]
})
export class ModalModule { }
