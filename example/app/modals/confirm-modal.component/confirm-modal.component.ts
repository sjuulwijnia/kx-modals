import { Component } from '@angular/core';
import { KxModalComponent } from 'kx-modals';

@Component({
	selector: 'kx-confirm-modal',
	templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent extends KxModalComponent implements ConfirmModalConfiguration {
	public title = '';
	public body = '';

	public confirmLabel = 'OK';
	public declineLabel = 'Cancel';
	public declineCausesError = false;

	constructor() {
		super();
	}

	public onDecline() {
		if (this.declineCausesError) {
			this.closeError('Confirm modal has canceled');
			return;
		}

		this.closeSilent();
	}

	public onConfirm() {
		this.closeSuccess();
	}
}

export class ConfirmModalConfiguration {
	title: string;
	body?: string;

	confirmLabel?: string;
	declineLabel?: string;
	declineCausesError?: boolean;
}
