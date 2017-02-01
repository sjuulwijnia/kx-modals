import { Component } from "@angular/core";

import { Observer } from "rxjs/Observer";

import { IKxModalSettings } from "./modal.models";

export const MODAL_OBSERVER_PROPERTY = '$$modalObserver';
export const MODAL_SETTINGS_PROPERTY = '$$modalSettings';
export const MODAL_INDEX_PROPERTY = '$$modalIndex';
export const MODAL_COUNT_PROPERTY = '$$modalCount';

@Component({})
export abstract class KxModalBaseComponent<T> {
	private $$modalObserver: Observer<T> = null;
	public get modalObserver(): Observer<T> {
		return this.$$modalObserver;
	}

	private $$modalSettings: IKxModalSettings = null;
	public get modalSettings(): IKxModalSettings {
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

	protected closeSuccess(value?: T): void {
		this.$$modalObserver.next(value);
		this.closeSilent();
	}

	protected closeError(error?: any): void {
		this.$$modalObserver.error(error);
	}

	protected closeSilent(): void {
		this.$$modalObserver.complete();
	}

	readonly prototype;
}