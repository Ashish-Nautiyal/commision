import { ShareService } from './../../../services/share/share.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-market',
  templateUrl: './share-market.component.html',
  styleUrls: ['./share-market.component.scss'],
})
export class ShareMarketComponent implements OnInit {
  public shares: any = [];
  public orgNames: any = [];
  public selected: any = [];
  public currentLoginEmail = localStorage.getItem('currentUser');
  @Input() orgId: string;

  constructor(private service: ShareService) {}

  ngOnInit(): void {
    this.displayShares();
  }

  //display shares
  displayShares() { 
    this.service.displayShares().subscribe(
      (res) => {
        this.shares = res.data;
        this.orgNames = res.orgNames;
        for (let i = 0; i < this.shares.length; i++) {
          this.selected.push(0);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Buy Share
  buyShares(val: any,i:any) {
    let obj = {
      org_id: val,
      user_email: this.currentLoginEmail,
      share_percentage: this.selected[i],
    };
    this.service.buyedShares(obj).subscribe(
      (res) => {
        this.displayShares();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChange(e: any, i: number) {
    this.selected[i] = e.target.value;
  }
}
