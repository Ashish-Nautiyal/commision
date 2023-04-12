import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
})
export class ChildComponent implements OnInit {
  @Input() Name: string | undefined;
  newName = 'Ashish Nautiyal';
  @Output() nameChange: EventEmitter<String> = new EventEmitter(); 

  update() {
    this.nameChange.emit(this.newName);
  }
  constructor() {}

  ngOnInit(): void {}
}
