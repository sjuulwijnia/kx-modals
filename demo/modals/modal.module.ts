import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KxModalModule } from '../../src';
import { ModalService } from './modal.service';

import { ConfirmModalComponent } from './confirm-modal.component/confirm-modal.component';
import { NotifyModalComponent } from './notify-modal.component/notify-modal.component';
import { WaitModalComponent } from './wait-modal.component/wait-modal.component';

@NgModule({
    imports: [
        CommonModule,

        KxModalModule.forRoot(
            // optionally set global styling here, e.g.:
            // {
            // 	defaultSettings: {
            // 		modalContainerClasses: 'my-custom-container-class-that-can-be-overridden-on-individual-basis',
            // 		modalDialogClasses: 'my-custom-dialog-class-that-can-be-overridden-on-individual-basis',

            // 		dismissByClick: true,
            // 		dismissByEscape: true,
            // 		dismissCausesError: false
            // 	},

            // 	globalStyleSettings: {
            // 		backdropClasses: 'my-custom-backdrop-class',
            // 		containerClasses: 'my-custom-container-class',
            // 		dialogClasses: 'my-custom-dialog-class'
            // 	}
            // }
        )
    ],

    declarations: [
        ConfirmModalComponent,
        NotifyModalComponent,
        WaitModalComponent
    ],

    entryComponents: [
        ConfirmModalComponent,
        NotifyModalComponent,
        WaitModalComponent
    ],

    providers: [
        ModalService
    ],

    exports: [
        KxModalModule
    ]
})
export class ModalModule {

}
