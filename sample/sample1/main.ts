import { Component, NgModule } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorTooltipModule } from "../../src/index";

@Component({
    selector: "app",
    template: `
<div class="container">
    <form novalidate [formGroup]="sampleForm" class="form-horizontal" role="form">
        <div class="form-group">
            <label class="control-label col-sm-3" for="sample1">Required:</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" formControlName="sample1" errorTooltip tooltipPlacement="top">
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-sm-3" for="sample2">Minimum length 3:</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" formControlName="sample2" errorTooltip tooltipPlacement="top">
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-sm-3" for="sample3">Maximum length 3:</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" formControlName="sample3" errorTooltip tooltipPlacement="top">
            </div>
        </div>
        <div class="col-sm-2 pull-right">
            <button type="submit" class="btn btn-primary btn-lg btn-block">SUBMIT</button>
        </div>
    </form>
</div>
`
})
export class Sample1App {

    private sampleForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.sampleForm = this.fb.group({
            sample1: ['', [Validators.required]],
            sample2: ['', [Validators.minLength(3)]],
            sample3: ['', [Validators.maxLength(3)]]
        })
    }
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