import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ErrorTooltip} from "./ErrorTooltip";
import {ErrorTooltipContent} from "./ErrorTooltipContent";

export * from "./ErrorTooltip";
export * from "./ErrorTooltipContent";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ErrorTooltip,
        ErrorTooltipContent,
    ],
    exports: [
        ErrorTooltip,
        ErrorTooltipContent,
    ],
    entryComponents: [
        ErrorTooltipContent
    ]
})
export class ErrorTooltipModule {

}