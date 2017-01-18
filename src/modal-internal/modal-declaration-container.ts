import { KxModalBaseComponent } from "../modal-external";
import { KxModalDeclaration } from "./modal.models-internal";

export class KxModalComponentContainer {
	private container: { [componentName: string]: any } = {};

	addDeclarations(modalComponents: KxModalDeclaration[]) {
		for (let modalDeclaration of modalComponents) {
			let componentName = modalDeclaration.modalComponentName || modalDeclaration.modalComponent.prototype.constructor.name;
			this.container[componentName] = modalDeclaration.modalComponent;
		}
	}

	getDeclaration(modalComponent: string | KxModalBaseComponent<any>): KxModalBaseComponent<any> {
		if (typeof modalComponent === "string") {
			return this.container[modalComponent];
		}

		return this.container[modalComponent.prototype.constructor.name];
	}
}