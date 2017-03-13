import { Injectable } from "@angular/core";
import { KxModalService, IKxModalOptions, IKxModalService } from "../../src";

import { ConfirmModalComponent, IConfirmModalConfiguration } from "./confirm-modal.component";
import { NotifyModalComponent, INotifyModalConfiguration } from "./notify-modal.component";
import { WaitModalComponent, IWaitModalConfiguration } from "./wait-modal.component";

@Injectable()
export class ModalService implements IKxModalService {
	public get hasOpenModals(): boolean {
		return this.kxModalService.hasOpenModals;
	}

	public get openModalCount(): number {
		return this.kxModalService.openModalCount;
	}

	constructor(
		private kxModalService: KxModalService
	) { }

	public create(modalComponent: any, modalOptions: IKxModalOptions) {
		return this.kxModalService.create(modalComponent, modalOptions);
	}

	public confirm(confirmConfiguration: string | IConfirmModalConfiguration) {
		let modalValues: IConfirmModalConfiguration;
		if (typeof confirmConfiguration === "string") {
			modalValues = {
				title: confirmConfiguration
			};
		} else {
			modalValues = confirmConfiguration;
		}

		return this.create(ConfirmModalComponent, {
			modalSettings: {
				modalDialogClasses: 'modal-sm',

				dismissCausesError: !!modalValues.errorOnDecline
			},
			modalValues
		});
	}

	public notify(notifyConfiguration: string | INotifyModalConfiguration) {
		let modalValues: INotifyModalConfiguration;
		if (typeof notifyConfiguration === "string") {
			modalValues = {
				title: notifyConfiguration
			};
		} else {
			modalValues = notifyConfiguration;
		}

		return this.create(NotifyModalComponent, {
			modalSettings: {
				modalDialogClasses: 'modal-sm'
			},
			modalValues
		});
	}

	public wait(waitConfiguration: string | IWaitModalConfiguration) {
		let modalValues: IWaitModalConfiguration;
		if (typeof waitConfiguration === "string") {
			modalValues = {
				title: waitConfiguration
			};
		} else {
			modalValues = waitConfiguration;
		}

		return this.create(WaitModalComponent, {
			modalSettings: {
				modalDialogClasses: 'modal-sm',

				dismissByClick: false,
				dismissByEscape: false
			},
			modalValues
		});
	}
}
