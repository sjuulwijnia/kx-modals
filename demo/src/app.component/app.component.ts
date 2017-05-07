import { Component } from "@angular/core";
import { ModalService } from "../modals";

import { Observable } from "rxjs/Observable";

@Component({
	selector: 'app',
	templateUrl: './app.component.html'
})
export class AppComponent {
	public CODE_CONFIRM_MODAL_TS = require('../modals/confirm-modal.component/confirm-modal.component.ts?raw');
	public CODE_CONFIRM_MODAL_HTML = require('../modals/confirm-modal.component/confirm-modal.component.html?raw');

	public CODE_NOTIFY_MODAL_TS = require('../modals/notify-modal.component/notify-modal.component.ts?raw');
	public CODE_NOTIFY_MODAL_HTML = require('../modals/notify-modal.component/notify-modal.component.html?raw');

	public CODE_WAIT_MODAL_TS = require('../modals/wait-modal.component/wait-modal.component.ts?raw');
	public CODE_WAIT_MODAL_HTML = require('../modals/wait-modal.component/wait-modal.component.html?raw');

	constructor(
		private modalService: ModalService
	) {
		this.modalService
			.onAnyModalOpened
			.subscribe(() => {
				console.log('* A modal has been opened');
			});

		this.modalService
			.onAllModalsClosed
			.subscribe(() => {
				console.log('* All modals have been closed');
			})
	}

	onConfirm() {
		this.modalService
			.confirm({
				title: `Are you sure?`,
				body: `Deleting this item means you won't be able to use it anymore.`,
				errorOnDecline: false
			})
			.subscribe({
				next: () => {
					console.log(`And away it goes...`);
				}
			});
	}

	onDramaticConfirm() {
		this.modalService
			.confirm({
				title: `Are you sure?`,
				body: `Because this might have some grave consequences if you're not.`,
				acceptLabel: 'I can handle this!',
				declineLabel: 'Never mind.',
				errorOnDecline: true
			})
			.subscribe({
				next: () => {
					console.log(`Commencing dramatic sequence...`);
				},
				error: () => {
					console.log(`Better be safe than sorry.`);
				}
			});
	}

	onNotify(type: 'info' | 'success' | 'warning' | 'danger' = 'info') {
		this.modalService
			.notify({
				title: `Check the source code!`,
				body: `Want to see the source of this library? Visit the <a href="https://github.com/sjuulwijnia/kx-modals" target="_blank">GitHub page</a>!`,
				type: type
			})
			.subscribe({
				complete: () => {
					console.log(`You closed the notification.`);
				}
			});
	}

	onWait(time: number) {
		const subscription = Observable.timer(time)
			.subscribe();

		this.modalService
			.wait({
				title: `Wait up!`,
				body: `This task that, miraculously, takes exactly ${time / 1000} second(s) needs to finish up first!`,
				subscription
			})
			.subscribe({
				complete: () => {
					console.log(`You've waited for the waiting modal to close.`);
				}
			});
	}
}
