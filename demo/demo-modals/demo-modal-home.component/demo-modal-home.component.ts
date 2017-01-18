import { Component } from "@angular/core";

import { KxModalService } from "../../../src";

@Component({
	selector: 'demo-modal-home',
	templateUrl: './demo-modal-home.component.html'
})
export class DemoModalHomeComponent {
	constructor(
		private modalService: KxModalService
	) { }

	onShowConfirm() {
		this.modalService.create("ConfirmModalComponent")
			.subscribe(() => {
				console.log('Accepted!');
			});
	}

	onShowNotify() {
		this.modalService.create("NotifyModalComponent")
			.subscribe();
	}
}
