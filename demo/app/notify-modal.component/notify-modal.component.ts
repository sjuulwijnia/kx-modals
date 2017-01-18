import { Component } from "@angular/core";
import { KxModalBaseComponent } from "../../../src";

@Component({
	selector: 'notify-modal',
	templateUrl: './notify-modal.component.html'
})
export class NotifyModalComponent extends KxModalBaseComponent<void> {
	onClose() {
		this.closeSilent();
	}
}
