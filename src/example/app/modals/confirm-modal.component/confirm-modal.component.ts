import { Component } from '@angular/core';
import { KxModalComponent } from '../../../../lib';

@Component({
	selector: 'kx-confirm-modal',
	templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent extends KxModalComponent<any> implements ConfirmModalConfiguration {
	public title = '';
	public body = '';

	public okLabel = 'OK';
	public cancelLabel = 'Cancel';
	public cancelCausesError = false;

	public onCancel() {
		if (this.cancelCausesError) {
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

	okLabel?: string;
	cancelLabel?: string;
	cancelCausesError?: boolean;
}
