import {
	ComponentFactoryResolver,
	Injectable,
	Injector
} from '@angular/core';

import { KxModalContainerService } from './private/modal-container.service';
import {
	KxModalComponent,
	KxModalComponentType
} from './modal.component';
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

	/**
	 * Whether there are *any* modals open or not (includes hidden modals).
	 */
	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	/**
	 * The amount of modals currently open (includes hidden modals).
	 */
	public get modalCount(): number {
		return this.kxModalContainerService.modalCount;
	}

	/**
	 * Creates a modal of type *modalComponent* using *modalConfiguration*.
	 *
	 * @param modalComponent The KxModalComponent to be created.
	 * @param modalConfiguration The configuration used for the *modalComponent*.
	 *
	 * *Default: empty (undefined)*
	 */
	public create<MC extends KxModalComponent<RT>, RT>(
		modalComponent: KxModalComponentType<MC, RT>,
		modalConfiguration?: IKxModalConfiguration
	): MC {
		modalConfiguration = modalConfiguration || {};

		modalConfiguration.settings = {
			animate: true,
			animateBackdrop: true,

			closeOnBackdropClick: true,
			closeOnEscape: true,
			closeCausesError: false,

			...(modalConfiguration.settings || {})
		};

		modalConfiguration.styling = modalConfiguration.styling || {
			classes: '',

			...(modalConfiguration.styling || {})
		};

		modalConfiguration.values = modalConfiguration.values || {};

		return this.kxModalContainerService.create({
			component: modalComponent,
			componentFactoryResolver: this.componentFactoryResolver,
			injector: this.injector,

			...modalConfiguration
		});
	}
}
