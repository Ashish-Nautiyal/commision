import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user/user.service';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'address',
    'phoneNumber',
    'email',
    'actions',
  ];
  pageEvent: PageEvent;
  totalRecords: any;
  pageLimitOption: any;
  offset = 0;
  limit = 20;
  length: any;
  email:any;
  userDetail:any;
  search = { name: '' };
  currentUser =localStorage.getItem('currentUser');
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUsers();
  }




  //Getting all user's list
  getUsers() {
    this.userService
      .pagination(
        this.offset,
        this.limit,
        this.currentUser,
        this.search?.name
      )
      .subscribe(
        (res) => {
          this.totalRecords = res.count;
          this.pageLimitOption = [1, 2, this.totalRecords];
          this.length = this.totalRecords;
          if (res.data.length != 0) {
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.sort = this.sort;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // pageChange Event
  onPageChange(event: PageEvent) {
    this.length = this.totalRecords;
    this.pageLimitOption = [1, 2, this.totalRecords];
    let offset = event.pageIndex;
    let limit = event.pageSize;
    this.userService
      .pagination(offset, limit, this.currentUser, this.search?.name)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
      });
  }
  
  //edit Profile
  editProfile(param: any) {
    this.email={userEmail:param}
    this.userService.myProfile(this.email).subscribe(
      (res) => {
        console.log(res);
        this.userDetail = res.data[0];
      },
      (err) => {
        console.log(err);
      }
    );

  }

   //update Profile
   updateProfile(){
    this.userService.updateUserProfile(this.userDetail).subscribe(
      (res)=>{
        this.email=null;
        this.getUsers();
      },
      (err)=>{
        console.log(err);        
      }
    )
  }

  //CancelEdit
  cancel(){
    this.email=null;
  }
}
