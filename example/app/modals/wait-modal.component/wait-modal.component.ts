import { Component, OnInit } from '@angular/core';

import { KxModalComponent } from 'kx-modals';

import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'kx-wait-modal',
	templateUrl: './wait-modal.component.html'
})
export class WaitModalComponent extends KxModalComponent<any> implements WaitModalConfiguration, OnInit {
	public title = '';
	public body = '';
	public basic = false;

	public subscription: Subscription = null;

	constructor() {
		super();
	}

	ngOnInit() {
		if (!!this.subscription) {
			this.subscription.add(() => {
				this.closeSuccess();
			});
		}
	}
}

export class WaitModalConfiguration {
	title: string;
	body?: string;
	basic?: boolean;

	subscription?: Subscription;
}
