import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal-external";
import { KxModalComponent, KxModalContainerComponent, KxModalInstanceService } from "./modal-internal";
import { KxRootModalModuleDeclaration } from "./modal-internal";

import { DEFAULT_MODAL_SETTINGS_PROVIDER } from "./modal-internal";
import { GLOBAL_MODAL_STYLE_PROVIDER } from "./modal-internal";
import { MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER } from "./modal-internal";

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
