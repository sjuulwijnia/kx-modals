import {
	ComponentFactoryResolver,
	Injectable,
	Injector
} from '@angular/core';

import { KxModalContainerService } from './private/index';
import { KxModalComponent } from './modal.component';
import {
	IKxModalService,

	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues
} from './modal.models';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class KxModalService implements IKxModalService {
	constructor(
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly injector: Injector,
		private readonly kxModalContainerService: KxModalContainerService
	) { }

	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	public get modalCount(): number {
		return this.kxModalContainerService.modalCount;
	}

	/**
	 * Creates a modal.
	 *
	 * @param modalComponent The KxModalComponent to be created.
	 * @param modalConfiguration The configuration used for the modalComponent.
	 *
	 * *Default: empty (undefined)*
	 */
	public create<T>(
		modalComponent: typeof KxModalComponent,
		modalConfiguration?: IKxModalConfiguration
	): KxModalComponent<T> {
		modalConfiguration = modalConfiguration || {};

		modalConfiguration.settings = {
			animate: true,
			animateBackdrop: true,

			closeOnBackdropClick: true,
			closeOnEscape: true,
			closeCausesError: false,

			...(modalConfiguration.settings || {})
		};

		modalConfiguration.styling = {
			class: '',

			...(modalConfiguration.styling || {})
		};
		modalConfiguration.values = modalConfiguration.values || {};

		return this.kxModalContainerService.create<T>({
			component: modalComponent,
			componentFactoryResolver: this.componentFactoryResolver,
			injector: this.injector,

			...modalConfiguration
		});
	}
}
