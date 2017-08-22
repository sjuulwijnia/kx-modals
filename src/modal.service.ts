import {
	ComponentFactoryResolver,
	Injectable,
	Injector
} from '@angular/core';

import { KxModalContainerService } from './private/index';
import { KxModalComponent } from './modal.component';
import {
	IKxModalConfiguration,
	IKxModalConfigurationSettings,
	IKxModalConfigurationValues
} from './modal.models';

import { Observable } from 'rxjs/Observable';

export interface IKxModalService {
	create<T>(modalComponent: typeof KxModalComponent, modalConfiguration?: IKxModalConfiguration): KxModalComponent<T>;
}

@Injectable()
export class KxModalService implements IKxModalService {
	constructor(
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly injector: Injector,
		private readonly kxModalContainerService: KxModalContainerService
	) { }

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
