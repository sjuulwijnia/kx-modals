import { Injectable } from '@angular/core';
import { animate, style } from '@angular/animations';

import { IKxModalConfiguration, IKxModalService, KxModalComponent, KxModalService } from '../../../src';

import { ConfirmModalComponent, ConfirmModalConfiguration } from './confirm-modal.component';
import { NotifyModalComponent, NotifyModalConfiguration } from './notify-modal.component';

@Injectable()
export class ModalService implements IKxModalService {
	constructor(
		public readonly kxModalService: KxModalService
	) { }

	public create<T>(modalComponent: typeof KxModalComponent, modalConfiguration?: IKxModalConfiguration) {
		return this.kxModalService.create<T>(modalComponent, modalConfiguration);
	}

	public confirm(title: string): ConfirmModalComponent;
	public confirm(configuration: ConfirmModalConfiguration): ConfirmModalComponent;
	public confirm(values: string | ConfirmModalConfiguration): ConfirmModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(ConfirmModalComponent, {
			values: values
		}) as ConfirmModalComponent;
	}

	public notify(title: string): NotifyModalComponent;
	public notify(configuration: NotifyModalConfiguration): NotifyModalComponent;
	public notify(values: string | NotifyModalConfiguration): NotifyModalComponent {
		if (typeof values === 'string') {
			values = {
				title: values
			};
		}

		return this.create(NotifyModalComponent, {
			values: values,

			settings: {
				animate: false
			},

			styling: {
				class: 'modal-sm',
				in: [
					style({
						opacity: 0,
						transform: 'rotateZ(-360deg)'
					}),
					animate('300ms ease-in', style({
						opacity: 1,
						transform: 'rotateZ(0)'
					}))
				],
				out: [
					animate('300ms ease-in', style({
						opacity: 0
					}))
				]
			}
		}) as NotifyModalComponent;
	}
}
