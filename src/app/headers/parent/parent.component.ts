import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  receieved:any;
  name="Ashish";
  recieveData(event:any){
    this.receieved=event;
  }
  update(){
    this.name="updated";
  }
}
