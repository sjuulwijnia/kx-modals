import { Observable } from "rxjs/Observable";

import { KxModalBaseComponent } from "./modal-base.component";

export interface KxModalSettings {
	/**
	 * Extension on the global KxModalStyleSettings.containerClasses that applies to this individual modal only.
	 * Defaults to empty.
	 */
	modalContainerClasses?: string;

	/**
	 * Extension on the global KxModalStyleSettings.dialogClasses that applies to this individual modal only.
	 * Defaults to empty.
	 */
	modalDialogClasses?: string;

	/**
	 * Whether pressing the backdrop (or anywhere outside the modal, more specifically) should close this modal when it is the top-most modal.
	 * Defaults to true.
	 */
	dismissByClick?: boolean;

	/**
	 * Whether pressing escape should close this modal when it is the top-most modal.
	 * Defaults to true.
	 */
	dismissByEscape?: boolean;

	/**
	 * Whether dismissByEscape and dismissByClick should throw an error when triggered. If true, make sure the error is caught using a .catch(...) on the Observable.
	 * Defaults to false.
	 */
	dismissCausesError?: boolean;
}

export interface KxModalOptions {
	/**
	 * The values that should be passed on to this individual modal. These are available in and after the OnInit cycle.
	 */
	modalValues?: { [key: string]: any };

	/**
	 * The settings that are used for this individual modal. All omitted settings are set to their defaults.
	 */
	modalSettings?: KxModalSettings;
}

export interface IKxModalService {
	/**
	 * Whether there are any modals currently open or not.
	 */
	hasOpenModals: boolean;

	/**
	 * The amount of modals currently open.
	 */
	openModalCount: number;

	/**
	 * Creates the given ModalComponent using the given option.
	 * Returns an Observable to subscribe to for the result.
	 */
	create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: KxModalOptions): Observable<RETURN_TYPE>;
}

export interface KxModalDeclaration {
	/**
	 * The ModalComponent to register to the service, allowing this ModalComponent to be called by name rather than by class declaration.
	 */
	modalComponent: any;

	/**
	 * The name that the ModalComponent should register under and should be called by. If omitted, it uses the name of the ModalComponent itself.
	 * Example: if your ModalComponent is named 'ConfirmModalComponent' and this field is omitted, it will register under 'ConfirmModalComponent'.
	 */
	modalComponentName?: string;
};

export interface KxModalModuleDeclaration {
	/**
	 * Contains all ModalComponents that you want to be able to be called by name rather than by class declaration.
	 */
	modalComponents?: KxModalDeclaration[];
}

export interface KxChildModalModuleDeclaration extends KxModalModuleDeclaration { }

export interface KxModalStyleSettings {
	/**
	 * The classes that are used for the backdrop.
	 * Defaults to the modal values used by the Bootstrap 4 modal, 'modal-backdrop fade show'.
	 */
	backdropClasses?: string;

	/**
	 * The classes that are used for the outer <div> that is containing the modal. This one is usually used to set the location of the modal, and is extended by setting the KxModalSettings.modalContainerClasses when creating an individual modal. 
	 * Defaults to the modal values used by the Bootstrap 4 modal, 'modal fade show'.
	 */
	containerClasses?: string;

	/**
	 * The classes that are used for the inner <div> that is containing the modal. This one is usually used to set the outer styling characteristics of the modal, and is extended by setting the KxModalSettings.modalDialogClasses when creating an individual modal. 
	 * Defaults to the modal values used by the Bootstrap 4 modal, 'modal-dialog'.
	 */
	dialogClasses?: string;
};

export interface KxRootModalModuleDeclaration extends KxModalModuleDeclaration {
	/**
	 * The default settings object used for the modals that can be overridden by each modal.
	 */
	defaultSettings?: KxModalSettings;

	/**
	 * The settings object used for the global styling of all modals used by this application. Put simple, it concerns the backdrop that is used and how the container of the modals is styled.
	 */
	globalStyleSettings?: KxModalStyleSettings;
}
