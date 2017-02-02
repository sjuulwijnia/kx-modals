import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/core";

import {
	KxModalConfiguration,
	KX_MODAL_ANIMATION_TIME,
	KX_MODAL_STATE_HIDE,
	KX_MODAL_STATE_SHOW
} from "../modal.models-internal";
import { KxModalInstanceService } from "../modal-instance.service";

import {
	MODAL_COUNT_PROPERTY,
	MODAL_INDEX_PROPERTY,
	MODAL_OBSERVER_PROPERTY,
	MODAL_SETTINGS_PROPERTY
} from "../../modal-external";

@Component({
	selector: 'kx-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css'],

	animations: [
		trigger('kxModalComponent', [
			state(KX_MODAL_STATE_SHOW,
				style({
					transform: 'translateY(0)',
					opacity: 1
				})
			),
			state(KX_MODAL_STATE_HIDE,
				style({
					transform: 'translateY(-5%)',
					opacity: 0
				})
			),

			transition(`void => ${KX_MODAL_STATE_SHOW}`, [
				style({
					transform: 'translateY(-5%)',
					opacity: 0
				}),

				animate(`${KX_MODAL_ANIMATION_TIME}ms ease-out`)
			]),

			transition(`${KX_MODAL_STATE_SHOW} => ${KX_MODAL_STATE_HIDE}`, [
				animate(`${KX_MODAL_ANIMATION_TIME}ms ease-out`)
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

	modalClasses: string[] = [];
	modalDialogClasses: string[] = [];

	private modalComponentRef: ComponentRef<any> = null;
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

		this.modalClasses.push(`modal-${this.modalConfiguration.options.modalSettings.modalClasses}`);
		this.modalDialogClasses.push(`modal-${this.modalConfiguration.options.modalSettings.modalSize}`);

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
}
