import { Component, ComponentRef, HostListener, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/core";

import {
	KxModalConfiguration,
	KX_MODAL_STATE_SHOW
} from "./modal.models-internal";
import { KxModalInstanceService } from "./modal-instance.service";

import {
	KxModalBaseComponent,
	MODAL_COUNT_PROPERTY,
	MODAL_INDEX_PROPERTY,
	MODAL_OBSERVER_PROPERTY,
	MODAL_SETTINGS_PROPERTY
} from "../modal-base.component";

@Component({
	selector: 'kx-modal',
	template: `
<div [style.z-index]="modalZIndex" [ngClass]="modalContainerClasses" [@kxModalComponent]="modalAnimationState" (click)="onBackdropClick($event)">
	<div [ngClass]="modalDialogClasses">
		<div (click)="onBackdropClickCancel($event)">
			<template #kxModal></template>
		</div>
	</div>
</div>
	`,

	animations: [
		trigger('kxModalComponent', [
			state('kxModalAnimationShow',
				style({
					transform: 'translateY(0)',
					opacity: 1
				})
			),
			state('kxModalAnimationHide',
				style({
					transform: 'translateY(-5%)',
					opacity: 0
				})
			),

			transition(`void => kxModalAnimationShow`, [
				style({
					transform: 'translateY(-5%)',
					opacity: 0
				}),

				animate(`200ms ease-out`)
			]),

			transition(`kxModalAnimationShow => kxModalAnimationHide`, [
				animate(`200ms ease-out`)
			])
		])
	]
})
export class KxModalComponent implements OnInit {
	@ViewChild("kxModal", { read: ViewContainerRef }) private viewContainerRef: ViewContainerRef;

	public modalAnimationState = KX_MODAL_STATE_SHOW;
	public modalConfiguration: KxModalConfiguration<any> = null;

	private _modalCount: number = 0;
	public set modalCount(value: number) {
		this._modalCount = value;
		this.updateModalComponentValues();
	}
	public get modalCount(): number {
		return this._modalCount;
	}

	private _modalIndex: number = 0;
	public set modalIndex(value: number) {
		this._modalIndex = value;
		this.updateModalComponentValues();
	}
	public get modalIndex(): number {
		return this._modalIndex;
	}

	modalContainerClasses: string = null;
	modalDialogClasses: string = null;

	private modalComponentRef: ComponentRef<KxModalBaseComponent<any>> = null;
	private modalComponent: any = null;

	public get modalZIndex(): number {
		return (1041 - (this.modalCount - this.modalIndex - 1));
	}

	constructor(
		private modalInstanceService: KxModalInstanceService
	) { }

	ngOnInit() {
		this.modalComponentRef = this.modalInstanceService.getComponentReference(this.modalConfiguration);
		this.modalComponent = this.modalComponentRef.instance;

		this.resolveModalComponentValues();

		this.modalContainerClasses = `${this.modalInstanceService.globalStyleSettings.containerClasses} ${this.modalConfiguration.options.modalSettings.modalContainerClasses}`;
		this.modalDialogClasses = `${this.modalInstanceService.globalStyleSettings.dialogClasses} ${this.modalConfiguration.options.modalSettings.modalDialogClasses}`;

		this.viewContainerRef.insert(this.modalComponentRef.hostView);
	}

	private resolveModalComponentValues(): void {
		if (this.modalComponent) {
			this.modalComponent[MODAL_OBSERVER_PROPERTY] = this.modalConfiguration.subject;
			this.modalComponent[MODAL_SETTINGS_PROPERTY] = this.modalConfiguration.options.modalSettings;
		}

		if (this.modalConfiguration.options.modalValues) {
			const keys = Object.keys(this.modalConfiguration.options.modalValues);
			for (let key of keys) {
				this.modalComponent[key] = this.modalConfiguration.options.modalValues[key];
			}
		}

		this.updateModalComponentValues();
	}

	private updateModalComponentValues(): void {
		if (this.modalComponent) {
			this.modalComponent[MODAL_COUNT_PROPERTY] = this._modalCount;
			this.modalComponent[MODAL_INDEX_PROPERTY] = this._modalIndex;
		}
	}

	/* EVENT HANDLING START */
	public onBackdropClick($event: MouseEvent) {
		if (!$event.defaultPrevented) {
			this.handleDismiss(this.modalConfiguration.options.modalSettings.dismissByClick, 'click');
		}
	}

	public onBackdropClickCancel($event: MouseEvent) {
		$event.preventDefault();
	}

	@HostListener('document:keydown.escape', ['$event'])
	public onEscapePress($event: KeyboardEvent) {
		if (!$event.shiftKey && !$event.ctrlKey && !$event.altKey) {
			this.handleDismiss(this.modalConfiguration.options.modalSettings.dismissByEscape, 'escape');
		}
	}

	private handleDismiss(dismiss: boolean, from: string) {
		if (this.modalComponentRef.instance.isTopModal && dismiss) {
			if (dismiss) {
				if (this.modalConfiguration.options.modalSettings.dismissCausesError) {
					this.modalComponentRef.instance.closeError(`Dismissed by ${from}.`);
				} else {
					this.modalComponentRef.instance.closeSilent();
				}
			}
		}
	}
}
