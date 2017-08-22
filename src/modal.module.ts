import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
	KxModalContainerComponent,
	KxModalContainerService
} from './private';

import { KxModalService } from './modal.service';
import { IKxModalStyling, MODAL_STYLING_TOKEN } from './modal.configuration';

@NgModule({
	imports: [
		CommonModule
	],

	declarations: [
		KxModalContainerComponent
	],

	providers: [
		KxModalContainerService,
		KxModalService
	],

	exports: [
		KxModalContainerComponent
	]
})
export class KxModalRootModule { }

@NgModule({
	providers: [
		KxModalService
	]
})
export class KxModalModule {
	constructor() { }

	public static forRoot(modalStyling: IKxModalStyling = {}): ModuleWithProviders {
		return {
			ngModule: KxModalRootModule,
			providers: [
				{
					provide: MODAL_STYLING_TOKEN,
					useValue: modalStyling
				}
			]
		};
	}
}
