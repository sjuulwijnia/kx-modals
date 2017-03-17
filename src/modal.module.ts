import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal.service";
import { KxModalComponent } from "./private/modal.component";
import { KxModalContainerComponent } from "./private/modal-container.component";
import { KxModalInstanceService } from "./private/modal-instance.service";

import {
	DEFAULT_MODAL_SETTINGS_PROVIDER,
	GLOBAL_MODAL_STYLE_PROVIDER,
	MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER
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
	static forRoot(modalModuleConfiguration: KxRootModalModuleDeclaration): ModuleWithProviders {
		return {
			ngModule: KxModalModule,
			providers: [
				KxModalInstanceService,

				{
					provide: MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER,
					useValue: modalModuleConfiguration.modalComponents
				},

				{
					provide: DEFAULT_MODAL_SETTINGS_PROVIDER,
					useValue: modalModuleConfiguration.defaultSettings
				},

				{
					provide: GLOBAL_MODAL_STYLE_PROVIDER,
					useValue: modalModuleConfiguration.globalStyleSettings
				}
			]
		};
	}
}
