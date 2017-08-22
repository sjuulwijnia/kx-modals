import { Injectable } from '@angular/core';

import { KxModalComponent } from '../modal.component';
import {
	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator
} from './modal-container.models';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class KxModalContainerService implements IKxModalContainerCreator {
	private containerComponent: IKxModalContainerCreator = null;

	/**
	 * Creates a modal using the given *configuration*. Delegates this to the KxModalContainerComponent if registered, errors otherwise.
	 *
	 * @param configuration Configuration to use for creating the modal.
	 * @return The created modal.
	 */
	public create<T>(configuration: IKxModalComponentCreationConfiguration): KxModalComponent<T> {
		if (!this.containerComponent) {
			// tslint:disable-next-line:max-line-length
			throw new Error(`There's no registered KxModalContainerComponent - there must be ONE KxModalContainerComponent (kx-modal-container).`);
		}

		return this.containerComponent.create<T>(configuration);
	}

	/**
	 * Register the given *containerComponent* to this KxModalService to delegate all created components to.
	 *
	 * @param containerComponent The containerComponent to be registered as the container to delegate all created components to.
	 */
	public registerContainerComponent(containerComponent: IKxModalContainerCreator): void {
		if (!!this.containerComponent) {
			// tslint:disable-next-line:max-line-length
			throw new Error(` There's already a registered KxModalContainerComponent - there can only be ONE KxModalContainerComponent (kx-modal-container).`);
		}

		this.containerComponent = containerComponent;
	}
}
