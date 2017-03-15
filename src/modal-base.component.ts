import { Observer } from "rxjs/Observer";

import { KxModalSettings } from "./modal.models";

export const MODAL_OBSERVER_PROPERTY = '$$modalObserver';
export const MODAL_SETTINGS_PROPERTY = '$$modalSettings';
export const MODAL_INDEX_PROPERTY = '$$modalIndex';
export const MODAL_COUNT_PROPERTY = '$$modalCount';

export abstract class KxModalBaseComponent<T> {
	private $$modalObserver: Observer<T> = null;
	public get modalObserver(): Observer<T> {
		return this.$$modalObserver;
	}

	private $$modalSettings: KxModalSettings = null;
	public get modalSettings(): KxModalSettings {
		return this.$$modalSettings;
	}

	private $$modalIndex: number = null;
	public get modalIndex(): number {
		return this.$$modalIndex;
	}

	private $$modalCount: number = null;
	public get modalCount(): number {
		return this.$$modalCount;
	}

	public get isTopModal(): boolean {
		return (this.$$modalCount - 1) === this.$$modalIndex;
	}

	constructor() { }

	public closeSuccess(value?: T, close: boolean = true): void {
		this.$$modalObserver.next(value);

		if (close) {
			this.closeSilent();
		}
	}

	public closeError(error?: any): void {
		this.$$modalObserver.error(error);
	}

	public closeSilent(): void {
		this.$$modalObserver.complete();
	}

	readonly prototype;
}