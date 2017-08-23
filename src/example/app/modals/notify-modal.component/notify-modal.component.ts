import { Component } from '@angular/core';

import { KxModalComponent } from '../../../../lib';

@Component({
	selector: 'kx-notify-modal',
	templateUrl: './notify-modal.component.html'
})
export class NotifyModalComponent extends KxModalComponent<any> implements NotifyModalConfiguration {
	public title = '';
	public body = '';

	public okLabel = 'OK';

	public onClose() {
		this.closeSuccess();
	}
}

export class NotifyModalConfiguration {
	title: string;
	body?: string;

	okLabel?: string;
}
