import { Component } from "@angular/core";
import { KxModalBaseComponent } from "../../../src";

@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent extends KxModalBaseComponent<void> {
	public title: string;
	public body: string;

	public onConfirm() {
		this.closeSuccess();
	}

	public onDecline() {
		this.closeSilent();
	}
}
