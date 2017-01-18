import { ComponentRef, ComponentFactoryResolver, Injectable, Injector, ReflectiveInjector } from "@angular/core";

import { KxModalBaseComponent } from "../modal-external";
import { KxModalComponentContainer } from "./modal-declaration-container";
import { IKxModalOptions, KxModalConfiguration, IKxModalService } from "./modal.models-internal";

import { Subject } from "rxjs/Subject";
import { Observer } from "rxjs/Observer";
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

	constructor(
		private modalComponentDeclarationContainer: KxModalComponentContainer,

		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector
	) { }

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

		return Observable.create((observer: Observer<RETURN_TYPE>) => {
			this.modalInstanceContainerSubject.next({
				component: component,
				options: modalOptions,
				observer: observer
			});
		});
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
