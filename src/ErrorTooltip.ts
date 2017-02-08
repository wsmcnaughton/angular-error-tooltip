import { Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver, ComponentFactory, OnInit, OnDestroy } from "@angular/core";
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
    tooltipDisabled: boolean;

    @Input()
    tooltipAnimation: boolean = true;

    @Input()
    tooltipPlacement: "top"|"bottom"|"left"|"right" = "bottom";

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.statusSubscription = this.control.statusChanges.subscribe(
            status => console.log(status)  
        );
    }
    ngOnDestroy() {
        this.statusSubscription.unsubscribe();
    }

    //@HostListener("focusin")
    //@HostListener("mouseenter")
    //show(): void {
    //    if (this.tooltipDisabled || this.visible)
    //        return;

    //    this.visible = true;
    //    if (typeof this.content === "string") {
    //        const factory = this.resolver.resolveComponentFactory(ErrorTooltipContent);
    //        if (!this.visible)
    //            return;

    //        this.tooltip = this.viewContainerRef.createComponent(factory);
    //        this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
    //        this.tooltip.instance.content = this.content as string;
    //        this.tooltip.instance.placement = this.tooltipPlacement;
    //        this.tooltip.instance.animation = this.tooltipAnimation;
    //    } else {
    //        const tooltip = this.content as ErrorTooltipContent;
    //        tooltip.hostElement = this.viewContainerRef.element.nativeElement;
    //        tooltip.placement = this.tooltipPlacement;
    //        tooltip.animation = this.tooltipAnimation;
    //        tooltip.show();
    //    }
    //}

    //@HostListener("focusout")
    //@HostListener("mouseleave")
    //hide(): void {
    //    if (!this.visible)
    //        return;

    //    this.visible = false;
    //    if (this.tooltip)
    //        this.tooltip.destroy();

    //    if (this.content instanceof ErrorTooltipContent)
    //        (this.content as ErrorTooltipContent).hide();
    //}

}