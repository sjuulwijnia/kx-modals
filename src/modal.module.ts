import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal.service";
import { KxModalComponent } from "./private/modal.component";
import { KxModalContainerComponent } from "./private/modal-container.component";
import { KxModalInstanceService } from "./private/modal-instance.service";

import {
	ROOT_MODAL_MODULE_CONFIGURATION_PROVIDER
} from "./private/modal.models-private";

import {
	KxRootModalModuleDeclaration
} from "./modal.models";

import "rxjs/add/observable/throw";
import "rxjs/add/operator/debounceTime";

@NgModule({
	imports: [
		CommonModule
	],

	providers: [
		KxModalService
	],

	declarations: [
		KxModalComponent,
		KxModalContainerComponent
	],

	entryComponents: [
		KxModalComponent
	],

	exports: [
		KxModalContainerComponent
	]
})
export class KxModalModule {
	static forRoot(modalModuleConfiguration?: KxRootModalModuleDeclaration): ModuleWithProviders {
		return {
			ngModule: KxModalModule,
			providers: [
				KxModalInstanceService,

				{
					provide: ROOT_MODAL_MODULE_CONFIGURATION_PROVIDER,
					useValue: modalModuleConfiguration
				}
			]
		};
	}
}
