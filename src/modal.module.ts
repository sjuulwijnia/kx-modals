import { ComponentFactoryResolver, Injector, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal-external";
import { KxModalComponent, KxModalContainerComponent, KxModalInstanceService } from "./modal-internal";
import { KxModalComponentContainer, KxModalDeclaration, KxChildModalModuleDeclaration, KxRootModalModuleDeclaration } from "./modal-internal";

import { DEFAULT_MODAL_SETTINGS, DEFAULT_MODAL_SETTINGS_PROVIDER } from "./modal-internal";
import { GLOBAL_MODAL_STYLE, GLOBAL_MODAL_STYLE_PROVIDER } from "./modal-internal";

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
	private static kxModalComponentDeclarationContainer = new KxModalComponentContainer();

	static forRoot(modalModuleConfiguration?: KxRootModalModuleDeclaration): ModuleWithProviders {
		const configuration = modalModuleConfiguration || {};
		const components = configuration.modalComponents || [];

		const defaultSettings = Object.assign({}, DEFAULT_MODAL_SETTINGS, (configuration.defaultSettings || {}));
		const globalStyleSettings = Object.assign({}, GLOBAL_MODAL_STYLE, (configuration.globalStyleSettings || {}));

		this.enrichModalComponentContainer(components);

		return {
			ngModule: KxModalModule,
			providers: [
				{
					provide: KxModalInstanceService,
					deps: [ComponentFactoryResolver, Injector],
					useFactory: (componentFactoryResolver: ComponentFactoryResolver, injector: Injector) => {
						return new KxModalInstanceService(this.kxModalComponentDeclarationContainer, componentFactoryResolver, injector);
					}
				},

				{
					provide: DEFAULT_MODAL_SETTINGS_PROVIDER,
					useValue: defaultSettings
				},

				{
					provide: GLOBAL_MODAL_STYLE_PROVIDER,
					useValue: globalStyleSettings
				}
			]
		};
	}

	static forChild(modalModuleConfiguration?: KxChildModalModuleDeclaration): ModuleWithProviders {
		const configuration = modalModuleConfiguration || {};
		const components = configuration.modalComponents || [];

		this.enrichModalComponentContainer(components);

		return {
			ngModule: KxModalModule
		};
	}

	private static enrichModalComponentContainer(modalComponents: KxModalDeclaration[]) {
		this.kxModalComponentDeclarationContainer.addDeclarations(modalComponents);
	}
}
