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

	static forRoot(modalModuleConfiguration: KxRootModalModuleDeclaration) {
		const modules = modalModuleConfiguration.modalModules || [];
		const defaultSettings = Object.assign({}, DEFAULT_MODAL_SETTINGS, (modalModuleConfiguration.defaultSettings || {}));

		this.enrichModalComponentContainer(modalModuleConfiguration.modalComponents);

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
					useFactory: (cfr: ComponentFactoryResolver, i: Injector) => {
						return new KxModalInstanceService(this.kxModalComponentDeclarationContainer, cfr, i);
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

	static forChild(modalModuleConfiguration: KxChildModalModuleDeclaration) {
		const modules = modalModuleConfiguration.modalModules || [];
		this.enrichModalComponentContainer(modalModuleConfiguration.modalComponents);

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
