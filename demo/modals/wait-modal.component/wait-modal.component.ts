import { Component, OnInit } from "@angular/core";
import { KxModalBaseComponent } from "../../../src";

import { Subscription } from "rxjs/Subscription";

@Component({
	selector: 'wait-modal',
	templateUrl: './wait-modal.component.html'
})
export class WaitModalComponent extends KxModalBaseComponent<void> implements IWaitModalConfiguration, OnInit {
	public title: string = null;
	public body: string = null;

	public subscription: Subscription = null;

	ngOnInit() {
		if (this.subscription) {
			this.subscription.add(this.closeSilent.bind(this));
		}
	}
}

export interface IWaitModalConfiguration {
	title: string;
	body?: string;

	subscription?: Subscription;
}
