# kx-modals
A simple implementation of modals in Angular.

## Quick start
* Add the package to your project by using ``npm install kx-modals --save``. After that, just complete the following steps:
* Add the ``KxModalModule`` to your root module (usually ``app.module.ts``):
  ```
  import { KxModalModule } from 'kx-modals';

  @NgModule({
      imports: [
        KxModalModule.forRoot(),
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
* Create a modal component by extending the ``KxModalComponent``:
  ```
  import { Component } from '@angular/core';
  import { KxModalComponent } from 'kx-modals';

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
  export class ExampleModalComponent extends KxModalComponent<any> {
      onClose() {
          this.closeSilent();
      }
  }
  ```
* Call the modal by using the ``KxModalService`` from any component or service:
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

Now you're set to use ``kx-modals`` in your project!