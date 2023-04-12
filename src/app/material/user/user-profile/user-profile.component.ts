import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  currentUser = { userEmail: localStorage.getItem('currentUser') };
  currentUserRole = localStorage.getItem('role');
  release = false;
  shareAval = true;
  shareReqData: any;
  public shareReleaseStatus: Boolean;
  public timer:any;
  public timerExpired:Boolean=false;
  email: any; 
  public countDown:any={hrs:'',mins:'',secs:''}

  public user:any;
  public userCommission: number;
  public organisation:any;
  public orgNames: [];

  sendRelease = {
    userdata: '',
    References: '',
    admin: '',
  };
 

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getParam();
    this.myProfile();
    if (this.currentUserRole == '1') {
      this.releaseCount();
      this.shareReleaseReqCheck();
    }
  }

  // openDialog(){
  //   this.dialog.open(MySharesComponent ,{
  //     width: '250px',
  //   });
  // }

  //get user Profile
  myProfile() {
    this.userService.myProfile(this.currentUser).subscribe(
      (res) => { 
        this.user = res.user;
        this.userCommission = res.commission;
        this.organisation=res.organisation;
        this.orgNames = res.orgNames;
        this.timer=res.bidStatus;
        if(this.timer.date_time!=null){
        this.intializeClock(this.timer.date_time);
        }
        this.shareCheck();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //edit Profile
  editProfile() {
    this.router.navigate(['/main/userProfile'], {
      queryParams: { email: this.currentUser.userEmail },
    });
  }

  //update Profile
  updateProfile() {
    this.userService.updateUserProfile(this.user).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/user/myProfile']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //getQueryParams
  getParam() {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email');
    });
  }

  //Count For Release Org
  releaseCount() {
    this.userService.countForReleaseOrg().subscribe(
      (res) => {
        // console.log(res);
        if (localStorage.getItem('currentUser') == res.admindata) {
          this.release = res.request;
          this.sendRelease.admin = res.admindata;
          this.sendRelease.userdata = res.userdata;
          this.sendRelease.References = res.References;
          this.myProfile();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Release Org
  releaseOrg() {
    this.userService.releaseOrg(this.sendRelease).subscribe(
      (res) => {
        this.release = res.request;
        this.releaseCount();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  //shareCheck
  shareCheck() {
    // console.log(this.orgId);
    this.userService.shareAval({ orgId: this.organisation._id }).subscribe(
      (res) => {
        this.shareAval = res.shareAval;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //share deploy
  deployShare() {
    // console.log(this.orgId);
    this.userService.sharInsert({ orgId: this.organisation._id }).subscribe(
      (res) => {
        this.shareCheck();
      },
      (err) => {
        console.log(err);
      }
    );
  }


  //share release request check
  shareReleaseReqCheck() {
    this.userService.shareRealeaseReq().subscribe(
      (res) => {
        // console.log(res);
        this.shareReqData = res.data;
        this.shareReleaseStatus = res.release;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //share Release
  shareRelease() {
    this.userService.shareRelease({ data: this.shareReqData }).subscribe(
      (res) => {
        this.shareReleaseReqCheck();
      },
      (err) => {
        console.log(err);
      }
    );
  }




// ------------------------------------------------------------------

  intializeClock(time: any) {
    if (time != null) {
      const timeInterval = setInterval(() => {
        this.countDownTime(time, timeInterval);
      }, 1000);
    }
  }

  
  countDownTime(datetime: any, interval: any) {
    const lastDate = new Date(datetime).getTime();
    const startDate = new Date().getTime();
    const distance = lastDate - startDate;

    this.countDown.hrs = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.countDown.mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.countDown.secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance <= 0) {   
      clearInterval(interval);
      this.countDown.hrs = 0;
      this.countDown.mins = 0;
      this.countDown.secs = 0;
      this.timerExpired=true;
      this.winBidExpired(datetime);
    }
  }

  winBidExpired(time:any){
    console.log("here",this.timer);
    this.userService.winBidTimeExpired(this.timer._id).subscribe( 
      (res)=>{
        console.log("success");
      },(err)=>{      
        console.log(err);
      }
    ) ;
  }

  purchaseWinBid(){
    // console.log(this.timer)
    this.userService.purchaeWinBid(this.timer).subscribe(
      (res)=>{
        console.log(res);
      },(err)=>{
        console.log(err);
      }
    )
  }
}
