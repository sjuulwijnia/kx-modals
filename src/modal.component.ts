import { AfterViewInit, ComponentRef, HostBinding } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IKxModalComponentCreationConfiguration } from './modal.models';

export type KxModalComponentRef<T> = ComponentRef<KxModalComponent<T>>;
export class KxModalComponent<T> extends Subject<T> implements AfterViewInit {
	@HostBinding('style.zIndex') public get styleZIndex(): number {
		return 1041 - ((this.$$modalCount - this.$$modalIndex) * 2);
	}

	/**
	 * The configuration used to create this modal. Is sealed.
	 */
	public configuration: IKxModalComponentCreationConfiguration<any, T> = null;

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
		returnValue?: T,
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
}
