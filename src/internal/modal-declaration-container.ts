import { KxModalDeclaration } from "../modal.models";

import {
	KxModalBaseComponent,
	MODAL_COUNT_PROPERTY,
	MODAL_INDEX_PROPERTY,
	MODAL_OBSERVER_PROPERTY,
	MODAL_SETTINGS_PROPERTY
} from "../modal-base.component";

export class KxModalComponentContainer {
	private container: { [componentName: string]: any } = {};

	constructor(modalComponents: KxModalDeclaration[]) {
		modalComponents = modalComponents || [];

		for (let modalDeclaration of modalComponents) {
			let componentName = modalDeclaration.modalComponentName || modalDeclaration.modalComponent.prototype.constructor.name;
			this.container[componentName] = modalDeclaration.modalComponent;
		}
	}

	getDeclaration(modalComponent: string | KxModalBaseComponent<any>): KxModalBaseComponent<any> {
		if (typeof modalComponent === "string") {
			return this.container[modalComponent];
		}

		if (this.isModalComponent(modalComponent)) {
			return modalComponent;
		}

		return null;
	}

	private isModalComponent(component: KxModalBaseComponent<any>) {
		return (
			this.componentHasPropertyGetter(component, MODAL_COUNT_PROPERTY) &&
			this.componentHasPropertyGetter(component, MODAL_INDEX_PROPERTY) &&
			this.componentHasPropertyGetter(component, MODAL_OBSERVER_PROPERTY) &&
			this.componentHasPropertyGetter(component, MODAL_SETTINGS_PROPERTY)
		);
	}

	private componentHasPropertyGetter(component: KxModalBaseComponent<any>, propertyName: string) {
		return !!component.prototype.__lookupGetter__(propertyName.substr(2));
	}
}