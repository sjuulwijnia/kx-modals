import { Component } from "@angular/core";
import { ModalService } from "../modals";

import { Observable } from "rxjs/Observable";

@Component({
	selector: 'app',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor(
		private modalService: ModalService
	) { }

	onConfirm() {
		this.modalService
			.confirm({
				title: `Are you sure?`,
				body: `Because this might have some grave consequences if you're not.`,
				errorOnDecline: true
			})
			.subscribe({
				next: () => {
					console.log(`Yay! You're sure!`);
				},
				error: () => {
					console.log(`Aww. Well, maybe next time.`);
				}
			});
	}

	onNotify() {
		this.modalService
			.notify({
				title: `Heads up!`,
				body: `For this is a notification!`
			})
			.subscribe({
				complete: () => {
					console.log(`You closed the notification.`);
				}
			});
	}

	onWait() {
		const subscription = Observable.timer(5000)
			.subscribe();

		this.modalService
			.wait({
				title: `Wait up!`,
				body: `This task that, miraculously, takes exactly 5 seconds needs to finish up first!`,
				subscription
			})
			.subscribe({
				complete: () => {
					console.log(`You've waited for the waiting modal to close.`);
				}
			});
	}
}
