/**
### Example:
    <div class="layout horizontal flex wrap">
      <div class="horizontal-section layout horizontal flex">
        <textfit-div class="fullHeight flex" horizontal-center vertical-center text="Hey!"></textfit-div>
      </div>
      <div class="horizontal-section layout horizontal flex">
        <textfit-div class="fullHeight flex" text="Good Evening!"></textfit-div>
      </div>
    </div>

   Custom property | Description               | Default
   ----------------|---------------------------|----------
  `--textfit-div`  | Mixin applied to the text | `{}`

  @element textfit-div
  @demo demo/index.html
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'textfit/textFit.js';

class TextfitDiv extends GestureEventListeners(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --textfit-div;
            }

            .fullHeight {
                @apply --layout-flex;
                @apply --textfit-div;
            }

            div > span {
                @apply --textfit-div;
            }
        </style>

        <!-- <script src="node_modules/textfit/textFit.js"></script> -->

        <div id="fitMe" class="fullHeight">{{text}}</div>
`;
    }

    static get properties() {
        return {
            /**
             * The text that will be displayed and fit into its container.
             *
             * @attribute text
             * @type String
             * @default ''
             */
            text: {
                observer: '_textChanged',
                type: String,
                value: ''
            },
            /**
             * Tracks the attachment status of the textfit-div element.
             *
             * @attribute isAttached
             * @type Boolean
             * @default false
             */
            isAttached: {
                type: Boolean,
                value: false
            },
            /**
             * When set to true the content will be centered horizontally.
             *
             * @attribute horizontalCenter
             * @type Boolean
             * @default false
             */
            horizontalCenter: {
                type: Boolean,
                value: false
            },
            /**
             * When set to true the content will be centered vertically.
             *
             * @attribute verticalCenter
             * @type Boolean
             * @default false
             */
            verticalCenter: {
                type: Boolean,
                value: false
            },
            /**
             * When set to true, textfit's multiline detection will be explicitly turned on.
             *
             * @attribute multiLine
             * @type Boolean
             * @default false
             */
            multiLine: {
                type: Boolean,
                value: false
            },
            /**
             * If your text has multiple lines, textFit() will automatically detect that and disable white-space: no-wrap! No changes are necessary.
             *
             * @attribute detectMultiLine
             * @type Boolean
             * @default true
             */
            detectMultiLine: {
                type: Boolean,
                value: true
            },
            /**
             * Minimum font-size for textfit. If set the calculated font-size will not be set below the defined value.
             *
             * @attribute minFontSize
             * @type Number
             * @default 6
             */
            minFontSize: {
                type: Number,
                value: 6
            },
            /**
             * Maximum font-size for textfit. If set the calculated font-size will not be set above the defined value.
             *
             * @attribute maxFontSize
             * @type Number
             * @default 200
             */
            maxFontSize: {
                type: Number,
                value: 200
            },
            /**
             * If true, textFit will re-process already-fit nodes. Set to 'false' for better performance
             *
             * @attribute reProcess
             * @type Boolean
             * @default true
             */
            reProcess: {
                type: Boolean,
                value: true
            },
            /**
             * If true, textFit will fit text to element width, regardless of text height
             *
             * @attribute widthOnly
             * @type Boolean
             * @default false
             */
            widthOnly: {
                type: Boolean,
                value: false
            },
            /**
             * If set to true, textfit-div will not automatically recalculate the font-size when a resize event is fired or the text content is changed.
             * doFitMe() must be called manually to trigger a recalculation.
             *
             * @attribute manualFire
             * @type Boolean
             * @default false
             */
            manualFire: {
                type: Boolean,
                value: false
            },
            /**
             * If true, textFit will use flexbox for vertical alignment
             *
             * @attribute manualFire
             * @type Boolean
             * @default false
             */
            alignVertWithFlexbox: {
                type: Boolean,
                value: false
            }
        }

    }

    ready() {
        super.ready();
        this.addEventListener('iron-resize', this._onIronResize);
    }

    /**
     * Triggered when the textfit-div element is attached.
     * Initial textfit calculation is triggered.
     */
    attached() {
        super.attached();
        this.isAttached = true;

        if (this.manualFire)
            return;

        // Below we run async because there is a known bug with polymer attached callback and clientWidth parameter used in textFit plugin
        this.async(this.doFitMe);
    }

    detached() {
        super.detached();
        this.isAttached = false;
    }

    /**
     * Observer method that is triggered when text content changed.
     */
    _textChanged(newText, oldText) {
        if (newText !== oldText && !this.manualFire) {
            var span = this.shadowRoot.querySelector('.textFitted');
            if (span) {
                span.innerHTML = newText;
            }
            this.async(this.doFitMe);
        }
    }

    /**
     * Triggered on iron-resize event.
     */
    _onIronResize() {
        if (this.manualFire)
            return;
        this.async(this.doFitMe);
    }

    /**
     * Calls textfit to trigger font-size recalculation.
     */
    doFitMe() {
        if (!this.isAttached)
            return;
        if (this.$.fitMe.innerHTML.length < 1)
            return;
        if (this.$.fitMe.clientHeight <= 0 || this.$.fitMe.clientWidth <= 0) {
            console.debug('textfit-div has no size yet, therefore the text can not be fitted.');
            return;
        }
        try {
            textFit(this.$.fitMe, {
                alignHoriz: this.horizontalCenter,
                alignVert: this.verticalCenter,
                multiLine: this.multiLine,
                detectMultiLine: this.detectMultiLine,
                minFontSize: this.minFontSize,
                maxFontSize: this.maxFontSize,
                reProcess: this.reProcess,
                widthOnly: this.widthOnly,
                alignVertWithFlexbox: this.alignVertWithFlexbox
            });
        } catch (e) {
            console.warn(e);
        }
    }
}

window.customElements.define("textfit-div", TextfitDiv);