import { Component } from "@angular/core";
import { ModalService } from "../modals";

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
}
