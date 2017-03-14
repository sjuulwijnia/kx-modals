import { ComponentRef, ComponentFactoryResolver, Injectable, Injector, ReflectiveInjector, Inject } from '@angular/core';

import { KxModalBaseComponent, KxModalStyleSettings } from "../modal-external";
import { KxModalComponentContainer } from './modal-declaration-container';
import { IKxModalOptions, KxModalConfiguration, IKxModalService, MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER } from './modal.models-internal';
import { GLOBAL_MODAL_STYLE, GLOBAL_MODAL_STYLE_PROVIDER, KxModalDeclaration } from './modal.models-internal';

import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class KxModalInstanceService implements IKxModalService {
	private modalInstanceContainerSubject: Subject<KxModalConfiguration<any>> = null;
	private modalInstanceCount: number = 0;

	public get hasOpenModals(): boolean {
		return this.openModalCount > 0;
	}

	public get openModalCount(): number {
		return this.modalInstanceCount;
	}

	private _globalStyleSettings: KxModalStyleSettings = null;
	public get globalStyleSettings() {
		return this._globalStyleSettings;
	}

	private modalComponentDeclarationContainer: KxModalComponentContainer = null;

	constructor(
		@Inject(MODAL_COMPONENT_DECLARATION_CONTAINER_PROVIDER) modalComponentDeclarations: KxModalDeclaration[],
		@Inject(GLOBAL_MODAL_STYLE_PROVIDER) globalStyleSettings: KxModalStyleSettings,

		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector
	) {
		this._globalStyleSettings = Object.assign({}, GLOBAL_MODAL_STYLE, globalStyleSettings || {});
		this.modalComponentDeclarationContainer = new KxModalComponentContainer(modalComponentDeclarations);
	}

	public bindToModalInstance(modalInstanceCountSubject: Observable<number>): Observable<KxModalConfiguration<any>> {
		modalInstanceCountSubject.subscribe(modalInstanceCount => {
			this.modalInstanceCount = modalInstanceCount;
		})
		this.modalInstanceContainerSubject = new Subject<KxModalConfiguration<any>>();

		return this.modalInstanceContainerSubject;
	}

	public create<RETURN_TYPE>(modalComponent: string | KxModalBaseComponent<any>, modalOptions?: IKxModalOptions): Observable<RETURN_TYPE> {
		if (!this.modalInstanceContainerSubject) {
			return Observable.throw(new Error("NO KX-MODAL-CONTAINER FOUND IN DOM"));
		}

		const component = this.modalComponentDeclarationContainer.getDeclaration(modalComponent);
		if (!component) {
			return Observable.throw(new Error(`NO MODALCOMPONENT FOUND FOR VALUE ${modalComponent.toString()}`));
		}

		const subject = new Subject<RETURN_TYPE>();

		this.modalInstanceContainerSubject.next({
			component: component,
			options: modalOptions,
			subject: subject
		});

		return subject;
	}

	public getComponentReference(modalConfiguration: KxModalConfiguration<any>): ComponentRef<any> {
		if (!modalConfiguration || !modalConfiguration.component) {
			return null;
		}

		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(modalConfiguration.component);
		const componentInjector = this.getComponentInjector(modalConfiguration);

		return componentFactory.create(componentInjector);
	}

	private getComponentInjector(modalConfiguration: KxModalConfiguration<any>): Injector {
		const options = Object.assign({}, modalConfiguration.options.modalValues);

		const inputProviders = Object.keys(options).map((inputName) => { return { provide: inputName, useValue: options[inputName] }; });
		const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

		return ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.injector);
	}
}
