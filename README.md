# kx-modals
A simple implementation of modals in Angular 2, using Bootstrap 4's modal style by default.

## Quick start
* Add the package to your project by using ``npm install kx-modals --save``. After that, just complete the following steps:
* Add the ``KxModalModule`` to your root module (usually ``app.module.ts``):
  ```
  import { KxModalModule } from 'kx-modals';

  @NgModule({
      imports: [
        KxModalModule.forRoot({
            // configuration
        }),
        ...
      ],
      ...
  })
  export class AppModule { }
  ```
* Add the ``KxModalContainerComponent`` to the HTML of your root component (usually the ``app.component.html``):
  ```
  ...
  <kx-modal-container></kx-modal-container>
  ...
  ```
* Create a modal component by extending the ``KxModalBaseComponent``:
  ```
  import { Component } from '@angular/core';
  import { KxModalBaseComponent } from 'kx-modals';

  @Component({
      selector: 'example-modal',
      template: `
        <div class="modal-container">
            <div class="modal-header">
                Hello world!
            </div>

            <div class="modal-body">
                This is just an example modal! Have fun!
            </div>

            <div class="modal-footer">
                <button class="btn btn-default" (click)="onClose()">Close</button>
            </div>
        </div>
      `
  })
  export class ExampleModalComponent extends KxModalBaseComponent<void> {
      onClose() {
          this.closeSilent();
      }
  }
  ```
* Call the modal by using the ``KxModalService`` from any component:
  ```
  import { Component } from '@angular/core';
  import { KxModalService } from 'kx-modals';

  import { ExampleModalComponent } from './example-modal.component';

  @Component({
      selector: "example",
      template: "<button class="btn btn-default" (click)="open()">Open that example modal!</button>"
  })
  export class ExampleComponent {
    constructor(
        private modalService: KxModalService
    ) { }

    public open() {
        this.modalService.create(ExampleModalComponent);
    }
  }
  ```

Now you're set the use ``kx-modals`` in your project!

## Tips
* Add the ``KxModalModule`` to a separate modal module and wrap the ``KxModalService`` by an own defined service. Add any modals that can be reused (such as a confirmation modal) to this module and add functions for them to your own modal service. For an example, look at the ([demo](https://github.com/sjuulwijnia/kx-modals/tree/master/demo/src/modals)).
* Override the default styling or settings by passing your own to the ``KxModalModule``:
  ```
  KxModalModule.forRoot({
      // optionally set default modal styling here, e.g.:
      defaultSettings: {
          // these two are added to respective globalStyleSettings classes
          modalContainerClasses: 'my-custom-container-class-that-can-be-overridden-on-individual-basis',
          modalDialogClasses: 'my-custom-dialog-class-that-can-be-overridden-on-individual-basis',

          dismissByClick: true,
          dismissByEscape: true,
          dismissCausesError: false
      },
      
      // optionally set global styling here, e.g.:
      globalStyleSettings: {
          backdropClasses: 'my-custom-backdrop-class',
          containerClasses: 'my-custom-container-class',
          dialogClasses: 'my-custom-dialog-class'
      }
  })
  ```

  The ``defaultSettings`` can be overridden when calling the ``KxModalService.create`` function:
  ```
  this.modalService.create(ExampleModalComponent, {
    modalSetting: {
        modalContainerClasses: 'my-custom-container-class',
        modalDialogClasses: 'my-custom-dialog-class',

        dismissByClick: false,
        dismissByEscape: false
    }
  }).subscribe(...);
  ```
