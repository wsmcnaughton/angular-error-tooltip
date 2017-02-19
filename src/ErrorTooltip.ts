import { Directive, HostListener, HostBinding, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver, ComponentFactory, OnInit, OnDestroy, Optional, Host, SkipSelf } from "@angular/core";
import { NgControl, FormGroupDirective } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription';
import { ErrorTooltipContent } from "./ErrorTooltipContent";

@Directive({
    selector: "[errorTooltip]"
})
export class ErrorTooltip implements OnInit, OnDestroy {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private tooltip: ComponentRef<ErrorTooltipContent>;
    private tooltipFactory: ComponentFactory<ErrorTooltipContent>;
    private initialized: boolean;
    private statusSubscription: Subscription;
    private formSubmissionSubscription: Subscription;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor
        (private viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private control: NgControl,
        @Optional() @Host() @SkipSelf() private parent: FormGroupDirective
    ) {
    }

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input()
    tooltipAnimation: boolean = true;

    @Input()
    tooltipPlacement: "top"|"bottom"|"left"|"right" = "bottom";

    // -------------------------------------------------------------------------
    // Methods
    // -------------------------------------------------------------------------
    ngOnInit() {
        this.tooltipFactory = this.resolver.resolveComponentFactory(ErrorTooltipContent);

        this.statusSubscription = this.control.statusChanges.subscribe(
            status => this.processStatus(status)
        );

        this.formSubmissionSubscription = this.parent.ngSubmit.subscribe((e: any) => this.processStatus(this.control.control.status as ('VALID' | 'INVALID' | 'PENDING' | 'DISABLED')));
    }

    @HostListener('focusin')
    show(): void {
        this.tooltip && this.tooltip.instance.show();
    }
    @HostListener('focusout')
    hide(): void {
        this.tooltip && this.tooltip.instance.hide();
    }
    ngOnDestroy() {
        this.statusSubscription && this.statusSubscription.unsubscribe();
        this.formSubmissionSubscription && this.formSubmissionSubscription.unsubscribe();
    }

    private processStatus = (status: 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'): void => {
        switch (status) {
            case 'INVALID':
                this.update();
                break;
            case 'VALID':
            case 'DISABLED':
                this.destroy();
                break;
            case 'PENDING':
            default:
                break; // do nothing
        }
    }

    private create = (): void => {
        if (!this.tooltip && this.control.invalid) {

            this.tooltip = this.viewContainerRef.createComponent(this.tooltipFactory);
            this.tooltip.instance.initialize(this.control, this.viewContainerRef.element.nativeElement, this.tooltipPlacement);
        }
    }
    private update = (): void => {
        if (this.tooltip) {
            this.tooltip.instance.updateErrorMessage();
        } else {
            this.create();
        }
    }
    private destroy = (): void => {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }    
    }

    @HostBinding('style.border') get hostBorder() { return this.tooltip ? '2px solid #FF4844' : null };
}