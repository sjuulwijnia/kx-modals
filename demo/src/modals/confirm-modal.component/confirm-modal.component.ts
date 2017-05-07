import { Component } from "@angular/core";
import { KxModalBaseComponent } from "../../../../src";

@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent extends KxModalBaseComponent<void> implements IConfirmModalConfiguration {
	public title: string = null;
	public body: string = null;
	public errorOnDecline: boolean = false;

	public acceptLabel: string = 'YES';
	public declineLabel: string = 'NO';

	public onConfirm() {
		this.closeSuccess();
	}

	public onDecline() {
		if (this.errorOnDecline) {
			this.closeError();
		} else {
			this.closeSilent();
		}
	}
}

export interface IConfirmModalConfiguration {
	title: string;
	body?: string;
	errorOnDecline?: boolean;

	acceptLabel?: string;
	declineLabel?: string;
}