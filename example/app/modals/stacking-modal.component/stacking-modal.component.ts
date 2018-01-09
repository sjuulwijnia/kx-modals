import { Component, Type } from '@angular/core';

import { KxModalComponent, KxModalService } from 'kx-modals';

@Component({
	selector: 'kx-stacking-modal',
	templateUrl: './stacking-modal.component.html'
})
export class StackingModalComponent extends KxModalComponent<any> implements StackingModalConfiguration {
	public index = 1;

	constructor(
		public kxModalService: KxModalService
	) {
		super();
	}

	public onClose() {
		this.closeSuccess();
	}

	public onStackModal() {
		this.hide();
		this.kxModalService.create(StackingModalComponent, {
			values: {
				index: (this.index + 1)
			}
		}).subscribe({
			complete: () => { this.show(); }
		});
	}
}

export class StackingModalConfiguration {
	index: number;
}
