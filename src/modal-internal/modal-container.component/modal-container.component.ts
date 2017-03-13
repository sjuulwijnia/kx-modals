import { Component, ComponentRef, ComponentFactory, ComponentFactoryResolver, Inject, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/core";

import { KxModalComponent } from "../modal.component";
import {
	KxModalConfiguration,
	KX_MODAL_ANIMATION_TIME,
	KX_MODAL_STATE_HIDE,
	KX_MODAL_STATE_SHOW
} from "../modal.models-internal";
import { KxModalInstanceService } from "../modal-instance.service";

import {
	GLOBAL_MODAL_STYLE_PROVIDER,
	KxModalStyleSettings
} from "../modal.models-internal";

import { Subject } from "rxjs/Subject";

@Component({
	selector: 'kx-modal-container',
	templateUrl: './modal-container.component.html',

	animations: [
		trigger('kxModalBackdrop', [
			state(KX_MODAL_STATE_SHOW,
				style({
					opacity: 0.5
				})
			),
			state(KX_MODAL_STATE_HIDE,
				style({
					opacity: 0.1
				})
			),

			transition(`void => ${KX_MODAL_STATE_SHOW}`, [
				style({
					opacity: 0.1
				}),

				animate(`${KX_MODAL_ANIMATION_TIME}ms`)
			]),

			transition(`${KX_MODAL_STATE_SHOW} => ${KX_MODAL_STATE_HIDE}`, [
				animate(`${KX_MODAL_ANIMATION_TIME}ms`)
			])
		])
	]
})
export class KxModalContainerComponent implements OnInit {
	public kxModalBackdrop = KX_MODAL_STATE_HIDE;
	public kxModalBackdropClasses: string = null;

	private modalContainerComponentFactory: ComponentFactory<KxModalComponent>;
	private modalContainerCountSubject: Subject<number> = new Subject<number>();

	@ViewChild("kxModalContainer", { read: ViewContainerRef }) private modalComponentContainer: ViewContainerRef;
	private modalComponentRefs: ComponentRef<KxModalComponent>[] = [];

	public get modalComponentCount(): number {
		return this.modalComponentContainer.length;
	}

	constructor(
		componentFactoryResolver: ComponentFactoryResolver,
		@Inject(GLOBAL_MODAL_STYLE_PROVIDER) globalStyleSettings: KxModalStyleSettings,

		private modalInstanceService: KxModalInstanceService
	) {
		this.modalContainerComponentFactory = componentFactoryResolver.resolveComponentFactory(KxModalComponent);

		this.kxModalBackdropClasses = globalStyleSettings.backdropClasses;
	}

	ngOnInit() {
		this.modalInstanceService.bindToModalInstance(this.modalContainerCountSubject)
			.subscribe(this.onModalCreation.bind(this));
	}

	private onModalCreation(modalConfiguration: KxModalConfiguration<any>): void {
		const componentRef = this.modalComponentContainer.createComponent(this.modalContainerComponentFactory);

		componentRef.instance.modalConfiguration = modalConfiguration;

		this.kxModalBackdrop = KX_MODAL_STATE_SHOW;
		this.modalComponentRefs.push(componentRef);

		modalConfiguration.subject
			.subscribe({
				error: this.onModalDestroy.bind(this, componentRef),
				complete: this.onModalDestroy.bind(this, componentRef)
			});

		this.emitModalComponentCount();
	}

	private onModalDestroy(componentRef: ComponentRef<KxModalComponent>) {
		componentRef.instance.modalAnimationState = KX_MODAL_STATE_HIDE;

		setTimeout(() => {
			const index = this.modalComponentContainer.indexOf(componentRef.hostView);

			if (index >= 0) {
				this.modalComponentRefs.splice(index, 1);
				this.modalComponentContainer.remove(index);
			}

			this.emitModalComponentCount();
		}, KX_MODAL_ANIMATION_TIME);
	}

	private emitModalComponentCount() {
		this.modalContainerCountSubject.next(this.modalComponentCount);

		this.modalComponentRefs.forEach((componentRef: ComponentRef<KxModalComponent>, index: number) => {
			componentRef.instance.modalCount = this.modalComponentRefs.length;
			componentRef.instance.modalIndex = index;
		});

		if (this.modalComponentRefs.length === 0) {
			this.kxModalBackdrop = KX_MODAL_STATE_HIDE;
		}
	}
}
