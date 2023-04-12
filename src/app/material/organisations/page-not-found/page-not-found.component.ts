import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNOtFoundComponent implements OnInit {

  constructor(private router:Router) { }
 
  ngOnInit(): void {
  }

  redirectHomePage(){
    this.router.navigateByUrl("/user/userlist");
  }
}
