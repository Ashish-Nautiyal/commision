// import { UserService } from 'src/app/services/user.service';
import { UserService } from '../../../services/user/user.service';
import { User } from './../../../user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router:Router
  ) {}
  newUser = new User();
  public adminList: any;
  public agentList: any;
  public id: Number;
  public registrationForm:any;
  

  ngOnInit(): void {
    this.getAdmin();
    this.getAgent();
    this.newUser.reference = 'superAdmin@gmail.com';  
    this.registrationForm = new FormGroup({
      name: new FormControl(null,Validators.required),
      address: new FormControl(null,Validators.required),
      phoneNumber: new FormControl(null,Validators.required),
      email: new FormControl(null,Validators.required),
      password: new FormControl(null,Validators.required),
      reference: new FormControl('superAdmin@gmail.com',Validators.required),
      org: new FormControl(null),
      role: new FormControl(this.id,Validators.required)
    });  
  }

  
 
  // Registration
  register() {
    this.userService.registerUser(this.registrationForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //get Form
  getForm(val:number){
    this.id=val;
    console.log(this.id);
    this.ngOnInit();
  }
 
  

  //Admin List
  getAdmin() {
    this.userService.getAllAdmin().subscribe(
      (res) => {
        this.adminList = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Agent List
  getAgent() {
    this.userService.getAllAgent().subscribe(
      (res) => {
        this.agentList = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}