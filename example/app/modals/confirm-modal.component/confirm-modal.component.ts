import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { KxModalComponent } from 'kx-modals';

@Component({
	selector: 'kx-bs3-confirm-modal',
	templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent extends KxModalComponent<any> implements AfterViewInit, ConfirmModalConfiguration {
	public title = '';
	public body = '';

	public confirmLabel = 'OK';
	public declineLabel = 'Cancel';
	public declineCausesError = false;

	constructor(
		private readonly elementRef: ElementRef,
		private readonly renderer: Renderer2
	) {
		super();
	}

	ngAfterViewInit() {
		const element = this.elementRef.nativeElement;
		const marginOffset = -(element.scrollHeight / 2);

		this.renderer.setStyle(this.elementRef.nativeElement, 'margin-top', `${marginOffset}px`);
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
