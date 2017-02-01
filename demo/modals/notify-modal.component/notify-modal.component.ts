import { Component } from "@angular/core";
import { KxModalBaseComponent } from "../../../src";

@Component({
	selector: 'notify-modal',
	templateUrl: './notify-modal.component.html'
})
export class NotifyModalComponent extends KxModalBaseComponent<void> implements INotifyModalConfiguration {
	public title: string = null;
	public body: string = null;

	onClose() {
		this.closeSilent();
	}
}

export interface INotifyModalConfiguration {
	title: string;
	body?: string;
}
