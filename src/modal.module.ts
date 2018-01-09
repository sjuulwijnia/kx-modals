import { ModuleWithProviders, NgModule } from '@angular/core';

import { KxModalContainerItemComponent } from './private/modal-container-item.component';
import { KxModalContainerComponent } from './private/modal-container.component';
import { KxModalContainerService } from './private/modal-container.service';

import { KxModalService } from './modal.service';
import { IKxModalStyling } from './modal.models';

import { KX_MODAL_STYLING_TOKEN } from './modal.configuration';

import 'rxjs/add/observable/fromEvent';

@NgModule({
	declarations: [
		KxModalContainerItemComponent,
		KxModalContainerComponent
	],

	providers: [
		KxModalContainerService,
		KxModalService
	],

	entryComponents: [
		KxModalContainerItemComponent
	],

	exports: [
		KxModalContainerComponent
	]
})
export class KxModalRootModule {
	constructor() { }
}

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
					provide: KX_MODAL_STYLING_TOKEN,
					useValue: modalStyling
				}
			]
		};
	}
}
