import { Directive, HostBinding, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver, ComponentFactory, OnInit, OnDestroy } from "@angular/core";
import { NgControl } from '@angular/forms'
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
    private visible: boolean;
    private statusSubscription: Subscription;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor
        (private viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private control: NgControl
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

        // initialize tooltip on startup (if applicable)
        this.processStatus(this.control.control.status as ('VALID' | 'INVALID' | 'PENDING' | 'DISABLED'));
    }
    ngOnDestroy() {
        this.statusSubscription.unsubscribe();
    }

    private processStatus = (status: 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'): void => {
        switch (status) {
            case 'INVALID':
                this.createOrUpdate();
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
    private createOrUpdate = (): void => {
        if (!this.visible) {

            this.visible = true;

            this.tooltip = this.viewContainerRef.createComponent(this.tooltipFactory);
            this.tooltip.instance.initialize(this.control, this.viewContainerRef.element.nativeElement, this.tooltipPlacement);
        } else if (this.tooltip) {
            this.tooltip.instance.updateErrorMessage();
        }
    }
    private destroy = (): void => {
        if (this.visible) {

            this.visible = false;

            if (this.tooltip)
                this.tooltip.destroy();
        }    
    }

    @HostBinding('style.border') get hostBorder() { return this.visible ? '2px solid #FF4844' : null };
}