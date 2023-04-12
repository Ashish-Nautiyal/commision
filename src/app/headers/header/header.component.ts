import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  public userEmail:any;
  public userRole:any;

  ngOnInit(): void {
    this.getLoginDetail();
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getLoginDetail(){
    this.userEmail = localStorage.getItem('currentUser');
    this.userRole = localStorage.getItem('role');
  }
}
