import { Injectable } from '@angular/core';
import { animate, style } from '@angular/animations';

import { IKxModalConfiguration, IKxModalService, KxModalComponent, KxModalService } from 'kx-modals';

import { ConfirmModalComponent, ConfirmModalConfiguration } from './confirm-modal.component';
import { NotifyModalComponent, NotifyModalConfiguration } from './notify-modal.component';
import { StackingModalComponent, StackingModalConfiguration } from './stacking-modal.component';
import { WaitModalComponent, WaitModalConfiguration } from './wait-modal.component';

@Injectable()
export class ModalService implements IKxModalService {

	public get hasModals(): boolean {
		return this.modalCount > 0;
	}

	public get modalCount(): number {
		return this.kxModalService.modalCount;
	}

	constructor(
		public readonly kxModalService: KxModalService
	) { }

	public create<T>(modalComponent: typeof KxModalComponent, modalConfiguration?: IKxModalConfiguration) {
		return this.kxModalService.create<T>(modalComponent, modalConfiguration);
	}

	public confirm(values: string | ConfirmModalConfiguration): ConfirmModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(ConfirmModalComponent, {
			values: values,
			styling: 'tiny'
		}) as ConfirmModalComponent;
	}

	public notify(values: string | NotifyModalConfiguration): NotifyModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(NotifyModalComponent, {
			values: values,

			styling: 'tiny'
		}) as NotifyModalComponent;
	}

	public notifyCustomOutAnimation(values: string | NotifyModalConfiguration): NotifyModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(NotifyModalComponent, {
			values: values,

			styling: {
				classes: 'tiny',
				in: [
					style({
						opacity: 0,
						transform: 'rotateZ(-225deg) scale(0)'
					}),
					animate('500ms ease-in', style({
						opacity: 1,
						transform: 'rotateZ(0) scale(1)'
					}))
				],
				out: [
					animate('500ms ease-in', style({
						opacity: 0,
						transform: 'rotateZ(225deg) scale(3)'
					}))
				]
			}
		}) as NotifyModalComponent;
	}

	public stacking(): StackingModalComponent {
		return this.create(StackingModalComponent) as StackingModalComponent;
	}

	public wait(values: string | WaitModalConfiguration): WaitModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(WaitModalComponent, {
			values: values,

			settings: {
				closeOnBackdropClick: false,
				closeOnEscape: false
			},

			styling: (values.basic ? 'basic' : 'tiny')
		}) as WaitModalComponent;
	}
}
