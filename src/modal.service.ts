import { Injectable } from "@angular/core";

import { KxModalBaseComponent } from "./modal-base.component";
import { KxModalContainerService } from "./private/modal-container.service";
import {
	KxModalOptions,
	IKxModalService
} from "./modal.models";

import { Observable } from "rxjs/Observable";

@Injectable()
export class KxModalService implements IKxModalService {
	public get hasOpenModals(): boolean {
		return this.modalContainerService.hasOpenModals;
	}
	public get openModalCount(): number {
		return this.modalContainerService.openModalCount;
	}

	public get onAnyModalOpened(): Observable<void> {
		return this.modalContainerService.onAnyModalOpened;
	}

	public get onAllModalsClosed(): Observable<void> {
		return this.modalContainerService.onAllModalsClosed;
	}

	constructor(
		private modalContainerService: KxModalContainerService
	) { }

	create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: KxModalOptions): Observable<RETURN_TYPE> {
		if (!modalComponent) {
			return Observable.throw(new Error(`UNKNOWN COMPONENT REQUESTED: ${modalComponent}`));
		}

		modalOptions = modalOptions || {};
		modalOptions.modalValues = modalOptions.modalValues || {};
		modalOptions.modalSettings = Object.assign({}, this.modalContainerService.defaultModalSettings, modalOptions.modalSettings || {});

		return this.modalContainerService.create<RETURN_TYPE>(modalComponent, modalOptions);
	}
}
