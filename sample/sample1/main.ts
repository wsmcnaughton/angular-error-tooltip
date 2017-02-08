import { Component, NgModule } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorTooltipModule } from "../../src/index";

@Component({
    selector: "app",
    template: `
<div class="container">
    <form novalidate [formGroup]="sample1Form" class="form-horizontal" role="form">
        <div class="form-group">
            <label class="control-label col-sm-3" for="city">Required:</label>
            <div class="col-sm-9">
                <!--<input type="text" class="form-control" formControlName="city" errorTooltip tooltipPlacement="top">-->
            </div>
        </div>
    </form>
</div>
`
})
export class Sample1App {

}

@NgModule({
    imports: [
        BrowserModule,
        ErrorTooltipModule
    ],
    declarations: [
        Sample1App
    ],
    bootstrap: [
        Sample1App
    ]
})
export class Sample1Module {

}

platformBrowserDynamic().bootstrapModule(Sample1Module);