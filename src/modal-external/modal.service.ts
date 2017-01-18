import { Inject, Injectable } from "@angular/core";

import { KxModalBaseComponent } from "./modal-base.component";
import { KxModalInstanceService } from "../modal-internal";
import { DEFAULT_MODAL_SETTINGS_PROVIDER, IKxModalSettings } from "../modal-internal";
import { IKxModalOptions, IKxModalService } from "./modal.models";

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
		@Inject(DEFAULT_MODAL_SETTINGS_PROVIDER) private defaultModalSettings: IKxModalSettings,
		private modalInstanceService: KxModalInstanceService
	) { }

	create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: IKxModalOptions): Observable<RETURN_TYPE> {
		if (!modalComponent) {
			return Observable.throw(new Error(`UNKNOWN COMPONENT REQUESTED: ${modalComponent}`));
		}

		modalOptions = modalOptions || {};
		modalOptions.modalValues = modalOptions.modalValues || {};
		modalOptions.modalSettings = Object.assign({}, this.defaultModalSettings, modalOptions.modalSettings || {});

		return this.modalInstanceService.create<RETURN_TYPE>(modalComponent, modalOptions);
	}
}
