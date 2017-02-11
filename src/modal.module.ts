import { ComponentFactoryResolver, Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal-external";
import { KxModalComponent, KxModalContainerComponent, KxModalInstanceService } from "./modal-internal";
import { KxModalComponentContainer, KxModalDeclaration, KxChildModalModuleDeclaration, KxRootModalModuleDeclaration } from "./modal-internal";

import { DEFAULT_MODAL_SETTINGS, DEFAULT_MODAL_SETTINGS_PROVIDER } from "./modal-internal";

import "rxjs/add/observable/throw";
import "rxjs/add/operator/debounceTime";

export class KxModalModule {
	private static kxModalComponentDeclarationContainer = new KxModalComponentContainer();

	static forRoot(modalModuleConfiguration?: KxRootModalModuleDeclaration) {
		const configuration = modalModuleConfiguration || {};
		const components = configuration.modalComponents || [];
		const modules = configuration.modalModules || [];
		const defaultSettings = Object.assign({}, DEFAULT_MODAL_SETTINGS, (configuration.defaultSettings || {}));

		this.enrichModalComponentContainer(components);

		@NgModule({
			imports: [
				CommonModule,
				...modules
			],

			providers: [
				KxModalService,

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
				}
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
		class ModalForRootModule { }

		return ModalForRootModule;
	}

	static forChild(modalModuleConfiguration?: KxChildModalModuleDeclaration) {
		const configuration = modalModuleConfiguration || {};
		const components = configuration.modalComponents || [];
		const modules = configuration.modalModules || [];

		this.enrichModalComponentContainer(components);

		@NgModule({
			imports: [
				CommonModule,
				...modules
			]
		})
		class ModalForChildModule { }

		return ModalForChildModule;
	}

	private static enrichModalComponentContainer(modalComponents: KxModalDeclaration[]) {
		this.kxModalComponentDeclarationContainer.addDeclarations(modalComponents);
	}
}
