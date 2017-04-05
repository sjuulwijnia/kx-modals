import { Component, ComponentRef, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/core";

import { KxModalComponent } from "./modal.component";
import {
	KxModalConfiguration,
	KX_MODAL_ANIMATION_TIME,
	KX_MODAL_STATE_HIDE,
	KX_MODAL_STATE_SHOW
} from "./modal.models-private";
import { KxModalInstanceService } from "./modal-instance.service";

import { Subject } from "rxjs/Subject";

@Component({
	selector: 'kx-modal-container',
	template: `
<div>
	<ng-template #kxModalContainer></ng-template>

	<div [hidden]="modalComponentCount === 0" [ngClass]="kxModalBackdropClasses" [@kxModalBackdrop]="kxModalBackdrop"></div>
</div>
	`,
	styles: [
		`.kx-modals-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: #000; z-index: 1040; }`
	],

	animations: [
		trigger('kxModalBackdrop', [
			state('kxModalAnimationShow',
				style({
					opacity: 0.5
				})
			),
			state('kxModalAnimationHide',
				style({
					opacity: 0.1
				})
			),

			transition(`void => kxModalAnimationShow`, [
				style({
					opacity: 0.1
				}),

				animate(`200ms`)
			]),

			transition(`kxModalAnimationShow => kxModalAnimationHide`, [
				animate(`200ms`)
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
		private modalInstanceService: KxModalInstanceService
	) {
		this.modalContainerComponentFactory = componentFactoryResolver.resolveComponentFactory(KxModalComponent);

		this.kxModalBackdropClasses = modalInstanceService.globalStyleSettings.backdropClasses;
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
