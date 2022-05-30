import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl, Validators } from "@angular/forms";
import * as moment from "moment";

@Directive({
    selector: '[embgisvalid]'
}) export class EmbgValidatorDirective {

    constructor(private el: ElementRef, private control: NgControl) {

    }

    @HostListener('change', ['$event'])
    onInput(event: any) {
        let arr = event.target.value;
        let final = this.embgValidator(arr)
        //this.el.nativeElement.value = final;
        if (final)
            this.control.control?.removeValidators
        else
            this.control.control?.setErrors({ incorrect: true, message: ' Внесете валиден ЕМБГ!' });
    }

    embgValidator(embg: any) {
        console.log(embg)
        if (!embg) {
            return true;
        }
        if (!/^[0-9]{13}$/.test(embg)) {
            return false;
        }
        if (!this.isValidCheckSum(embg)) {
            return false;
        }
        if (!this.isValidDate(embg)) {
            return false;
        }
        return true;
    }

    isValidCheckSum(embg: any) {
        var mask = '765432765432',
            sum = 0,

            K = parseInt(embg[embg.length - 1]);

        for (var i = 0; i < 12; i++) {
            sum += parseInt(embg[i]) * parseInt(mask[i]);
        }
        var m = 11 - sum % 11;
        if (m >= 10) {
            m = 0;
        }
        return m == K;
    }

    isValidDate(embg: any) {

        var d = parseInt(embg.substr(0, 2)),
            m = parseInt(embg.substr(2, 2)) - 1,
            y = parseInt(embg.substr(4, 3)) + 1000;

        if (parseInt(embg.substr(4, 1)) < 8) {
            y += 1000;
        }

        return m >= 0 && m <= 12 && d > 0 && d <= this.daysInMonth(m, y) && y > 1800 && y <= moment().year();
    }

    daysInMonth(m: any, y: any) {
        switch (m) {
            case 1:
                return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
            case 8: case 3: case 5: case 10:
                return 30;
            default:
                return 31;
        }
    }
}