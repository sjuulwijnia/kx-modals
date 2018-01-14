import { Injectable } from '@angular/core';

import { KxModalComponent } from '../modal.component';
import {
	IKxModalComponentCreationConfiguration,
	IKxModalContainerCreator
} from '../modal.models';

@Injectable()
export class KxModalContainerService implements IKxModalContainerCreator {
	private containerComponent: IKxModalContainerCreator = null;

	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	public get modalCount(): number {
		if (!this.containerComponent) {
			return 0;
		}

		return this.containerComponent.modalCount;
	}

	/**
	 * Creates a modal using the given *configuration*. Delegates this to the KxModalContainerComponent if registered, errors otherwise.
	 *
	 * @param configuration Configuration to use for creating the modal.
	 * @return The created modal.
	 */
	public create<T extends KxModalComponent<D>, D>(configuration: IKxModalComponentCreationConfiguration<T, D>): T {
		if (!this.containerComponent) {
			throw new Error(`There's no registered KxModalContainerComponent - there must be ONE KxModalContainerComponent (kx-modal-container).`);
		}

		return this.containerComponent.create<T, D>(configuration);
	}

	/**
	 * Register the given *containerComponent* to this KxModalService to delegate all created components to.
	 *
	 * @param containerComponent The containerComponent to be registered as the container to delegate all created components to.
	 */
	public registerContainerComponent(containerComponent: IKxModalContainerCreator): void {
		if (!!this.containerComponent) {
			throw new Error(` There's already a registered KxModalContainerComponent - there can only be ONE KxModalContainerComponent (kx-modal-container).`);
		}

		this.containerComponent = containerComponent;
	}

	/**
	 * Unregisters the current *containerComponent*.
	 */
	public unregisterContainerComponent(): void {
		this.containerComponent = null;
	}
}
