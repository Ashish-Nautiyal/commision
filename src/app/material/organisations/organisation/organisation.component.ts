import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent implements OnInit {
  
  currentUser =localStorage.getItem('currentUser');
  userRole=localStorage.getItem('role')
  canRequest:Boolean;
  renew:Boolean;
  status:Boolean;
  organisation:any;
  
  constructor(private service: UserService) {}
  
  ngOnInit(): void {
    this.myOrganisation();
    this.canCommissionRequest();
  }

  //user can request for commission
  canCommissionRequest() {
    this.service.orgData(this.currentUser).subscribe(
      (res) => {
        this.canRequest=res.request;
        this.renew=res.renew; 
        this.status=res.pending;       
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Commission request
  commissionRequest(){
    this.service.orgComInserData({org_id:this.organisation._id,user_email:this.currentUser, Role:this.userRole,requestApproved:false}).subscribe(
      (res)=>{
        console.log(res);        
        this.canCommissionRequest();
      },
      (err)=>{
        console.log(err);        
      }
    )
  }

  //user organisation
 myOrganisation(){
    this.service.myOrganisation({email:this.currentUser}).subscribe(
      (res)=>{
        this.organisation=res.data;
      },
      (err)=>{
        console.log(err);        
      }
    )
  }

  //Reopen Account
  reopenAccount(){
    this.service.reopen({email:localStorage.getItem('currentUser'),orgId:this.organisation._id}).subscribe(
      (res)=>{
        this.canRequest=res.request;
        this.renew=res.renew; 
        this.status=res.pending; 
        this.canCommissionRequest();
        this.myOrganisation();
      },
      (err)=>{
        console.log(err);
      }
    )
  }
}
