import { BidService } from './../../../services/biding/bid.service';
import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-biding',
  templateUrl: './biding.component.html',
  styleUrls: ['./biding.component.scss'],
})


export class BidingComponent implements OnInit {

  public subject = webSocket("ws://localhost:8081"); 
  public bidsList: any = [];
  public orgNames: any = [];
  public myBid: any = [];
  public timer: any = [];
  public days: any;
  public stopTimer: any = [];
  public hrs: any = [];
  public mins: any = [];
  public secs: any = [];
  public highestBid: any = [];

  constructor(private service: BidService) {}

  ngOnInit(): void {
    this.displayBidShares();
  }

  manageArrays() {
    for (let i = 0; i < this.bidsList.length; i++) { 
      this.myBid.push(0); 
      this.hrs.push('_ _');
      this.mins.push('_ _');
      this.secs.push('_ _');
      this.stopTimer.push(false);
    }
  }

  //display Bid shares
  displayBidShares() {
    this.service.displayBiding().subscribe(
      (res) => {
        this.bidsList = res.bidsList;
        this.timer = res.bidTime;
        this.orgNames = res.orgNames;
        this.highestBid = res.highestBid;

        this.manageArrays();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  intializeClock(bid: any, i: any) {
    if (bid.date_time != null) {
      const timeInterval = setInterval(() => {
        this.countDownTime(bid.date_time, i, timeInterval);
      }, 1000);
    }
  }

  countDownTime(datetime: any, i: any, interval: any) {
    const lastDate = new Date(datetime).getTime();
    const startDate = new Date().getTime();
    const distance = lastDate - startDate;

    this.hrs[i] = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.mins[i] = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.secs[i] = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance <= 0) {
      clearInterval(interval);
      this.hrs[i] = 0;
      this.mins[i] = 0;
      this.secs[i] = 0;
      this.bidExpired(datetime, i);
    }
  }

  // get text box value
  getTextValue(e: any, i: any) {
    this.myBid[i] = e.target.value;
  }

  // Save Bid
  buyBid(val: any, i: any) {
    let obj = {
      org_id: val.org_id,
      share_holder: val.user_email,
      user_email: localStorage.getItem('currentUser'),
      share_percentage: val.share_percentage,
      share_price: val.share_price,
      bid_price: this.myBid[i],
    };
    this.service.bidStart(obj).subscribe(
      (res) => {
        this.displayBidShares();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  bidExpired(dateTime: any, i: any) {
    this.stopTimer[i] = true;
    this.service.bidTimeExpired({date:dateTime}).subscribe(
      (res)=>{
        console.log(res);
      },(err)=>{ 
        console.log(err);
      }
    )
  }
}
