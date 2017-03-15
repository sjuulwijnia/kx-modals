import { Injectable } from "@angular/core";

import { KxModalBaseComponent } from "./modal-base.component";
import { KxModalInstanceService } from "./internal/modal-instance.service";
import {
	KxModalOptions,
	IKxModalService
} from "./modal.models";

import { Observable } from "rxjs/Observable";

@Injectable()
export class KxModalService implements IKxModalService {
	public get hasOpenModals(): boolean {
		return this.modalInstanceService.hasOpenModals;
	}
	public get openModalCount(): number {
		return this.modalInstanceService.openModalCount;
	}

	constructor(
		private modalInstanceService: KxModalInstanceService
	) { }

	create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: KxModalOptions): Observable<RETURN_TYPE> {
		if (!modalComponent) {
			return Observable.throw(new Error(`UNKNOWN COMPONENT REQUESTED: ${modalComponent}`));
		}

		modalOptions = modalOptions || {};
		modalOptions.modalValues = modalOptions.modalValues || {};
		modalOptions.modalSettings = Object.assign({}, this.modalInstanceService.defaultModalSettings, modalOptions.modalSettings || {});

		return this.modalInstanceService.create<RETURN_TYPE>(modalComponent, modalOptions);
	}
}
