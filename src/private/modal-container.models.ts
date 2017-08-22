import { ComponentFactoryResolver, Injector } from '@angular/core';

import { KxModalComponent } from '../modal.component';
import { IKxModalConfiguration } from '../modal.models';

export interface IKxModalComponentCreationConfiguration extends IKxModalConfiguration {
	component: typeof KxModalComponent;
	componentFactoryResolver: ComponentFactoryResolver;
	injector: Injector;
}

export interface IKxModalContainerCreator {
	/**
	 * Creates a modal using the given *configuration*.
	 *
	 * @param configuration Configuration to use for creating the modal.
	 * @return The created modal.
	 */
	create<T>(configuration: IKxModalComponentCreationConfiguration): KxModalComponent<T>;
}
