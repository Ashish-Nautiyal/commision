import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private service: UserService, private router: Router) {}
  public newLogin = { email: '', password: '' };
  public message: String = '';

  ngOnInit(): void {}

  signUp(){
    this.router.navigate(['/user/register']);
  }

  login() {
    this.service.loginUser(this.newLogin).subscribe(
      (res) => {
        if (res.success) {
          this.message = res.message;
          let token = res.data;       
          const helper = new JwtHelperService();
          const decoded= helper.decodeToken(token);
          localStorage.setItem('token',token);       
          localStorage.setItem('currentUser', decoded.userEmail); 
          localStorage.setItem('role', decoded.role);  
          this.router.navigateByUrl('user/myProfile');              
        } else {
          this.message = res.message;
        }
      },
      (error) => {
        console.log("err",error);
      }
    );
  }
}
