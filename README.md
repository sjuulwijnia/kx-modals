# kx-modals
A simple implementation of modals in Angular.

## Quick start
Add the package to your project by using ``npm install kx-modals --save``. After that, just complete the following steps:
* Create a modal component by extending the ``KxModalComponent``:
  ```typescript
  import { Component } from '@angular/core';
  import { KxModalComponent } from 'kx-modals';

  @Component({
      selector: 'example-modal',

      // styling down here based on Semantic UI styling
      template: `
        <i class="close icon" (click)="onClose()"></i>
        <div class="header">
          Hello world!
        </div>

        <div *ngIf="!!body" class="content">
          This is just an example modal!
        </div>

        <div class="actions">
          <button class="ui basic button" (click)="onClose()">
            Have fun using <code>kx-modals</code>!
          </button>
        </div>
      `
  })
  export class ExampleModalComponent extends KxModalComponent<any> {
      onClose() {
          this.closeSilent();
      }
  }
  ```
* Add the just created ``ExampleModalComponent`` to your AppModule's ``entryComponents: [...]``:
  ```typescript

  ```
* Add the ``KxModalModule`` to your root module (usually ``app.module.ts``) and add your ``ExampleModalComponent`` to the module's ``declarations: [...]`` and ``entryComponents: [...]``:
  ```typescript
  import { NgModule } from '@angular/core';
  import { KxModalModule } from 'kx-modals';
  import { ExampleModalComponent } from './example-modal.component';

  @NgModule({
      imports: [
        KxModalModule.forRoot(),
        ...
      ],
      declarations: [
        ExampleModalComponent,
        ...
      ],
      entryComponents: [
        ExampleModalComponent,
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
* Call the modal by using the ``KxModalService`` from any component or service:
  ```typescript
  import { Component } from '@angular/core';
  import { KxModalService } from 'kx-modals';

  import { ExampleModalComponent } from './example-modal.component';

  @Component({
      selector: "example",
      template: "<button class="ui positive button" (click)="open()">Open that example modal!</button>"
  })
  export class ExampleComponent {
    constructor(
        private modalService: KxModalService
    ) { }

    public open() {
        this.modalService
          .create(ExampleModalComponent)
          .subscribe(() => {
            console.log('And it\'s closed again!');
          });
    }
  }
  ```

Now you're set to use ``kx-modals`` in your project!

## Styling
However, your modals should have some styling! Good thing ``kx-modals`` has excellent styling support and even has some default styling configurations for some popular CSS frameworks.

### Default configurations
``kx-modals`` supplies the following default configurations:

* [``Semantic UI (v2.2)``](https://semantic-ui.com/): use ``SEMANTIC2`` as configuration.
* [``Bootstrap (v3.3.7)``](https://getbootstrap.com/docs/3.3/): use ``BOOTSTRAP3`` as configuration.
* [``Bootstrap (v4.0.0-beta)``](https://getbootstrap.com/): use ``BOOTSTRAP4`` as configuration.
* [``Foundation 6 (v6.4.2)``](http://foundation.zurb.com/): use ``FOUNDATION6`` as configuration.

When passed to the ``KxModalModule.forRoot(...)`` import (e.g., ``KxModalModule.forRoot(SEMANTIC2)`` ), the styles inside the configurations will be applied automatically.

### Applying your own styling
If you need to apply your own styling, ``kx-modals`` needs to know about this. There are certain elements it has to create with classes attached, and if you have any animations.. well, ``kx-modals`` knows how to handle those.

For an example of your own styling, here's the default configuration that is being used for the Bootstrap 3 configuration:
```typescript
export const BOOTSTRAP3: IKxModalStyling = {
  body: 'modal-open',
  modalBackdrop: {
    class: 'modal-backdrop',
    // the IN animation that is played when the backdrop is created
    in: [
      style({
        opacity: 0
      }),
      animate('150ms ease-out', style({
        opacity: 0.5
      }))
    ],
    // the OUT animation that is played when the backdrop is destroyed
    out: [
      animate('150ms ease-out', style({
        opacity: 0
      }))
    ]
  },
  modalContainer: 'modal',
  modal: {
    class: 'modal-dialog',
    // the IN animation that is played when a modal is created
    in: [
      style({
        opacity: 0,
        transform: 'translate(0, -25%)'
      }),
      animate('300ms ease-out', style({
        opacity: 1,
        transform: 'translate(0, 0)'
      }))
    ],
    // the OUT animation that is played when a modal is created
    out: [
      animate('300ms ease-out', style({
        opacity: 0,
        transform: 'translate(0, -25%)'
      }))
    ]
  }
};
```

As you can see, the classes are strings that will be applied to the right components, and the animations are the default Angular animations that can be found in the ``@angular/animations`` package.

For more examples, look at the [configuration file](./lib/src/modal.configuration.ts) that contains all default configurations.
