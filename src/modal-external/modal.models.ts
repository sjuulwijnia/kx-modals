import { Observable } from "rxjs/Observable";

import { KxModalBaseComponent } from "./modal-base.component";

export interface IKxModalSettings {
	modalClasses?: string;
	modalSize?: 'sm' | 'md' | 'lg';
}

export interface IKxModalOptions {
	modalValues?: { [key: string]: any };
	modalSettings?: IKxModalSettings;
}

export interface IKxModalService {
	hasOpenModals: boolean;
	openModalCount: number;

	create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: IKxModalOptions): Observable<RETURN_TYPE>;
}

export interface KxModalDeclaration {
	modalComponent: any;
	modalComponentName?: string;
};

export interface KxModalModuleDeclaration {
	modalComponents: KxModalDeclaration[];
	modalModules?: any[];
}
