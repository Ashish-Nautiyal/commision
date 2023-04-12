import { Pipe, PipeTransform } from '@angular/core';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';  

@Pipe({
  name: 'ashu'
})
export class PipePipe implements PipeTransform {
  constructor() { }  

  transform(value: any, ...args: unknown[]): unknown {
    // let o="";
    // o+=`<select name="selected" [(ngModel)]=selected>`;
    // o+=`<option value=0>0</option>`;
    // for(let i=1;i<=value;i++){
    //  o+=`<option value=${i}>${i}</option>`;
    // }   
    // o+="</select>";
    // return this._sanitizer.bypassSecurityTrustHtml(o);    
    return value;
  }

}
