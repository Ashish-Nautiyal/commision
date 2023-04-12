import { UserService } from './../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';


@Component({
  selector: 'app-my-shares',
  templateUrl: './my-shares.component.html',
  styleUrls: ['./my-shares.component.scss'], 
})
export class MySharesComponent implements OnInit {
  public selected = '0'; 
  public orgNames = [];
  public myShares: any;
  public message: string;
  subject = webSocket('ws://localhost:8080'); 



  constructor(
    private service: UserService,
  ) {}

  ngOnInit(): void {
    this.displayMyShares();
  }

  //displayMyShares
  displayMyShares() {
    this.service
      .myShares({ email: localStorage.getItem('currentUser') })
      .subscribe(
        (res) => {
          this.myShares = res.shares;
          this.orgNames = res.orgNames;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //add Bid
  addBid(val: any) {
    let data = {
      org_id: val,
      user_email: localStorage.getItem('currentUser'),
      share_percentage: this.selected,
    };
    console.log(data);
    this.service.biding(data).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      }
    );
  } 

  //on change event
  onChange(e: any) {
    this.selected = e.target.value;
  }

  onClick(text: any) {
    this.subject.subscribe();
    this.subject.next(this.message);
    this.subject.complete();
  }
  
}
