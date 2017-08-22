import { Component } from '@angular/core';

import { ModalService } from './modals/modal.service';

@Component({
	selector: 'kx-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	constructor(
		private modalService: ModalService
	) { }

	public onConfirm() {
		const modal = this.modalService
			.confirm({
				title: 'Hello!',
				body: 'How are you?',

				okLabel: 'Good!',
				cancelLabel: 'Bad',
				cancelCausesError: true
			});

		modal
			.subscribe({
				next: () => {
					console.log('Next!');
				},

				error: error => {
					console.error('Error!', error);
				},

				complete: () => {
					console.log('Complete!');
				}
			});
	}

	public onNotify() {
		this.modalService
			.notify({
				title: 'PSA!',
				body: 'This is a Public Service Announcement.',

				okLabel: 'Uh.. OK?',
			})
			.subscribe();
	}
}
