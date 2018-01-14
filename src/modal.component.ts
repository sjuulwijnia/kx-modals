import { AfterViewInit, ComponentRef, HostBinding } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { KX_MODAL_BACKDROP_ZINDEX } from './modal.configuration';

import { IKxModalComponentCreationConfiguration } from './modal.models';
import { IKxModalContainerItemComponent } from './private/modal-container.models';

export interface KxModalComponentType<MC extends KxModalComponent<RT>, RT> {
	new(...args: any[]): MC;
}

export class KxModalComponent<RT = any> extends Subject<RT> implements AfterViewInit {
	/**
	 * Current z-index of this component.
	 */
	@HostBinding('style.zIndex')
	public get styleZIndex(): number {
		return KX_MODAL_BACKDROP_ZINDEX + 5 - ((this.$$modalCount - this.$$modalIndex - 1) * 2);
	}

	private modalContainerItem: IKxModalContainerItemComponent = null;

	/**
	 * The configuration used to create this modal. Is sealed.
	 */
	public configuration: IKxModalComponentCreationConfiguration<any, RT> = null;

	/**
	 * Number of modals in the parent KxModalContainerComponent.
	 */
	public get modalCount() {
		return this.$$modalCount;
	}
	private $$modalCount = 0;

	/**
	 * Index of this modal in the parent KxModalContainerComponent.
	 */
	public get modalIndex() {
		return this.$$modalIndex;
	}
	private $$modalIndex = 0;

	/**
	 * Whether this modal is currently on top or not.
	 */
	public get isTopModal() {
		return (this.$$modalIndex + 1) === this.$$modalCount;
	}

	/**
	 * Whether the modal is current animating or not.
	 */
	public get isAnimating() {
		return this.$$isAnimating;
	}
	private $$isAnimating = false;

	/**
	 * Creates a new KxModalComponent.
	 * @param args These are not used. Do whatever you want with these.
	 *
	 * *However*, they are required to make the modals function properly when it comes to dependency injection, so... *Keep these.*
	 */
	constructor(...args: any[]) {
		super();
	}

	/**
	 * Dummy after view init. Needs to be here, else we can't override and call it.
	 */
	ngAfterViewInit() { }

	/**
	 * Silently closes this modal. Is the same as calling ``this.complete()``.
	 */
	public closeSilent(): void {
		this.complete();
	}

	/**
	 * Passes the *returnValue* back to the observers, and closes if *close* is true.
	 * @param returnValue The value to pass back to the observers.
	 *
	 * *Default: empty (undefined)*
	 * @param close If true, this closes the modal as well.
	 *
	 * *Default: true*
	 */
	public closeSuccess(
		returnValue?: RT,
		close = true
	): void {
		this.next(returnValue);

		if (close) {
			this.closeSilent();
		}
	}

	/**
	 * Closes the modal with the given *error* as reason. Is the same as calling ``this.error(...)``.
	 * @param reason Reason for closing this modal with an error.
	 *
	 * *Default: empty (undefined)
	 */
	public closeError(reason?: any) {
		this.error(reason);
	}

	/**
	 * Shows this modal, making it visible and adding it back to view.
	 */
	public show() {
		this.modalContainerItem.show();
	}

	/**
	 * Hides this modal, making it invisible and removing it from view.
	 */
	public hide() {
		this.modalContainerItem.hide();
	}
}
