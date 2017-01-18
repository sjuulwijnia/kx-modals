import { ComponentFactoryResolver, Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalService } from "./modal-external";
import { KxModalComponent, KxModalContainerComponent, KxModalInstanceService } from "./modal-internal";
import { KxModalComponentContainer, KxModalModuleDeclaration, KxModalDeclaration } from "./modal-internal";

import { DEFAULT_MODAL_SETTINGS, DEFAULT_MODAL_SETTINGS_PROVIDER } from "./modal-internal";

import "rxjs/add/observable/throw";
import "rxjs/add/operator/debounceTime";

export class KxModalModule {
	private static kxModalComponentDeclarationContainer = new KxModalComponentContainer();

	static forRoot(modalModuleConfiguration: KxModalModuleDeclaration) {
		const modules = modalModuleConfiguration.modalModules || [];
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
					useValue: DEFAULT_MODAL_SETTINGS
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

	static forChild(modalModuleConfiguration: KxModalModuleDeclaration) {
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
