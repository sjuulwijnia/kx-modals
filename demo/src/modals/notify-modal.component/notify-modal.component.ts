import { Component } from "@angular/core";
import { KxModalBaseComponent } from "../../../../src";

@Component({
	selector: 'notify-modal',
	templateUrl: './notify-modal.component.html',
	styleUrls: ['./notify-modal.component.css']
})
export class NotifyModalComponent extends KxModalBaseComponent<void> implements INotifyModalConfiguration {
	public title: string = null;
	public body: string = null;
	public type: NotifyModalType = 'info';

	onClose() {
		this.closeSilent();
	}
}

export interface INotifyModalConfiguration {
	title: string;
	body?: string;
	type?: NotifyModalType;
}

export type NotifyModalType =
	'info' |
	'success' |
	'warning' |
	'danger';