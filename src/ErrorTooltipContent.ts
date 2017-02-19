import { Component, Input, ElementRef, ChangeDetectorRef } from "@angular/core";
import { NgControl } from '@angular/forms';

@Component({
    selector: "error-tooltip-content",
    template: `
<div class="tooltip {{ placement }}"
     [style.top.px]="tooltipPosition.top"
     [style.left.px]="tooltipPosition.left"
     [class.in]="isIn"
     [class.fade]="isFade"
     role="tooltip">
    <div class="tooltip-arrow"></div> 
    <div class="tooltip-inner">
        <ng-content></ng-content>
        {{ errorMessage }}
    </div> 
</div>
`,
    styles: [`
.tooltip-inner {
    color: #A94442;
    border: 1px solid #000;
    background-color: #F2DEDE;
    font-size: 14px;
}
`]
})
export class ErrorTooltipContent {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    hostElement: HTMLElement;
    control: NgControl;
    placement: "top" | "bottom" | "left" | "right" = "bottom";

    private get errorMessage(): string { return this.errorMessages ? this.errorMessages.join('\n') : null; }
    private errorMessages: string[];

    tooltipPosition: { top: number, left: number } = { top: -100000, left: -100000 };
    isIn: boolean = true;
    isFade: boolean = true;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private element: ElementRef,
        private cdr: ChangeDetectorRef) {
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------
    

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    show = (): void => {
        if (!this.hostElement)
            return;

        this.positionTooltip();
        this.isIn = true;
        this.isFade = true;
    }

    hide = (): void => {
        this.tooltipPosition = { top: -100000, left: -100000 };
        this.isIn = true;
        this.isFade = false;
    }

    initialize = (control: NgControl, hostElement: HTMLElement, placement: 'top' | 'bottom' | 'left' | 'right'): void => {
        this.control = control;
        this.hostElement = hostElement;
        this.placement = placement;

        this.updateErrorMessage();
        this.cdr.detectChanges();
    }

    updateErrorMessage = (): void => {
        let errMsgs: string[] = [];
        for (let propName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propName)) {

                let errMsg: string;
                switch (propName) {
                    case 'required':
                        errMsg = 'Required';
                        break;
                    case 'minlength':
                        errMsg = `Must contain at least ${this.control.errors[propName].requiredLength} characters`
                        break;
                    case 'maxlength':
                        errMsg = `Cannot contain more than ${this.control.errors[propName].requiredLength} characters`
                        break;
                    case 'pattern':
                        errMsg = 'Invalid value';
                        break;
                    default:
                        break; // Do nothing
                }

                if (!!errMsg) errMsgs.push(errMsg);
            }
        }

        let updatePositioning = this.hasNewErrorMessages(errMsgs);
        this.errorMessages = errMsgs;

        if (updatePositioning) {
            this.cdr.detectChanges();
            this.positionTooltip(); // adjust positioning
        }
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private positionElements(hostEl: HTMLElement, targetEl: HTMLElement, positionStr: string, appendToBody: boolean = false): { top: number, left: number } {
        let positionStrParts = positionStr.split("-");
        let pos0 = positionStrParts[0];
        let pos1 = positionStrParts[1] || "center";
        let hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);
        let targetElWidth = targetEl.offsetWidth;
        let targetElHeight = targetEl.offsetHeight;
        let shiftWidth: any = {
            center: function (): number {
                return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
            },
            left: function (): number {
                return hostElPos.left;
            },
            right: function (): number {
                return hostElPos.left + hostElPos.width;
            }
        };

        let shiftHeight: any = {
            center: function (): number {
                return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
            },
            top: function (): number {
                return hostElPos.top;
            },
            bottom: function (): number {
                return hostElPos.top + hostElPos.height;
            }
        };

        let targetElPos: { top: number, left: number };
        switch (pos0) {
            case "right":
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: shiftWidth[pos0]()
                };
                break;

            case "left":
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: hostElPos.left - targetElWidth
                };
                break;

            case "bottom":
                targetElPos = {
                    top: shiftHeight[pos0](),
                    left: shiftWidth[pos1]()
                };
                break;

            default:
                targetElPos = {
                    top: hostElPos.top - targetElHeight,
                    left: shiftWidth[pos1]()
                };
                break;
        }

        return targetElPos;
    }

    private position(nativeEl: HTMLElement): { width: number, height: number, top: number, left: number } {
        let offsetParentBCR = { top: 0, left: 0 };
        const elBCR = this.offset(nativeEl);
        const offsetParentEl = this.parentOffsetEl(nativeEl);
        if (offsetParentEl !== window.document) {
            offsetParentBCR = this.offset(offsetParentEl);
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
        };
    }

    private offset(nativeEl: any): { width: number, height: number, top: number, left: number } {
        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
            left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
        };
    }

    private getStyle(nativeEl: HTMLElement, cssProp: string): string {
        if ((nativeEl as any).currentStyle) // IE
            return (nativeEl as any).currentStyle[cssProp];

        if (window.getComputedStyle)
            return (window.getComputedStyle(nativeEl) as any)[cssProp];

        // finally try and get inline style
        return (nativeEl.style as any)[cssProp];
    }

    private isStaticPositioned(nativeEl: HTMLElement): boolean {
        return (this.getStyle(nativeEl, "position") || "static") === "static";
    }

    private parentOffsetEl(nativeEl: HTMLElement): any {
        let offsetParent: any = nativeEl.offsetParent || window.document;
        while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || window.document;
    }

    private positionTooltip = (): void => {
        this.tooltipPosition = this.positionElements(this.hostElement, this.element.nativeElement.children[0], this.placement);
    }

    private hasNewErrorMessages = (newErrorMessages: string[]): boolean => {
        if (!this.errorMessages || this.errorMessages.length !== newErrorMessages.length) {
            return true;
        } else {
            for (let i = 0; i < newErrorMessages.length; i++) {
                if (this.errorMessages.findIndex((errorMessage) => { return errorMessage === newErrorMessages[i]; }) === -1) {
                    return true;
                }
            }

            return false;
        }
    }
}