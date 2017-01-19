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
		this.modalService.create("ConfirmModalComponent",
			{
				modalSettings: {
					modalSize: 'sm'
				},
				modalValues: {
					title: 'Are you sure?',
					body: `Because this might have some grave consequences if you're not.`
				}
			})
			.subscribe(() => {
				console.log('Accepted!');
			});
	}

	onShowNotify() {
		this.modalService.create("NotifyModalComponent",
			{
				modalValues: {
					title: 'Heads up!',
					body: `For this is a notification. Hello!`
				}
			})
			.subscribe();
	}
}
