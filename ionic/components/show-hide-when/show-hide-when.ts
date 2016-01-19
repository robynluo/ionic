import {Directive, Attribute, NgZone} from 'angular2/core'

import {Platform} from '../../platform/platform';


/**
 * @private
 */
export class DisplayWhen {
  protected isMatch: boolean = false;
  private platform: Platform;
  private conditions: string[];

  constructor(conditions: string, platform: Platform, ngZone: NgZone) {
    this.platform = platform;

    if (!conditions) return;

    this.conditions = conditions.split(',');

    // check if its one of the matching platforms first
    // a platform does not change during the life of an app
    for (let i = 0; i < this.conditions.length; i++) {
      if (this.conditions[i] && platform.is(this.conditions[i])) {
        this.isMatch = true;
        return;
      }
    }

    if ( this.orientation() ) {
      // add window resize listener
      platform.onResize(() => {
        ngZone.run(() => {
          this.orientation();
        });
      });
      return;
    }

  }

  orientation(): boolean {
    for (let i = 0; i < this.conditions.length; i++) {

      if (this.conditions[i] == 'portrait') {
        this.isMatch = this.platform.isPortrait();
        return true;
      }

      if (this.conditions[i] == 'landscape') {
        this.isMatch = this.platform.isLandscape();
        return true;
      }
    }
  }

}

/**
 *
 * The `showWhen` attribute takes a string that represents a plaform or screen orientation.
 * The element the attribute is added to will only be shown when that platform or screen orientation is active.
 * Complements the [hideWhen attribute](../HideWhen).
 * @usage
 * ```html
 * <div showWhen="ios">I am only visible on iOS!</div>
 * ```
 * @demo /docs/v2/demos/show-when/
 * @see {@link ../HideWhen HideWhen API Docs}
 */
@Directive({
  selector: '[showWhen]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class ShowWhen extends DisplayWhen {

  constructor(
    @Attribute('showWhen') showWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(showWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden(): boolean {
    return !this.isMatch;
  }

}

/**
 *
 * The `hideWhen` attribute takes a string that represents a plaform or screen orientation.
 * The element the attribute is added to will only be hidden when that platform or screen orientation is active.
 * Complements the [showWhen attribute](../ShowWhen).
 * @usage
 * ```html
 * <div hideWhen="android">I am hidden on Android!</div>
 * ```
 * @demo /docs/v2/demos/hide-when/
 * @see {@link ../ShowWhen ShowWhen API Docs}
 */
@Directive({
  selector: '[hideWhen]',
  host: {
    '[hidden]': 'hidden'
  }
})
export class HideWhen extends DisplayWhen {

  constructor(
    @Attribute('hideWhen') hideWhen: string,
    platform: Platform,
    ngZone: NgZone
  ) {
    super(hideWhen, platform, ngZone);
  }

  /**
   * @private
   */
  get hidden(): boolean {
    return this.isMatch;
  }

}
