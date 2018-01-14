import { InjectionToken } from '@angular/core';

/**
 * Injection token for the global styling inside the module.
 */
export const KX_MODAL_STYLING_TOKEN = new InjectionToken('KX_MODAL_STYLING_TOKEN');

/**
 * Default modal z-index value. Used for calculating the z-index of all modals, in case there is more than one modal.
 */
export const KX_MODAL_BACKDROP_ZINDEX = 1050;
