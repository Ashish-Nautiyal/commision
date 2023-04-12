import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//components
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { PageNOtFoundComponent } from './organisations/page-not-found/page-not-found.component';
//modules
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { OrganisationComponent } from './organisations/organisation/organisation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareMarketComponent } from './market/share-market/share-market.component';
import { PipePipe } from './pipe/pipe.pipe';
import { BidingComponent } from './market/biding/biding.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MySharesComponent } from './user/my-shares/my-shares.component';

@NgModule({
  declarations: [ 
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    UserListComponent,
    OrganisationComponent,
    ShareMarketComponent,
    BidingComponent,
    PageNOtFoundComponent,
    PipePipe,
    MySharesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatGridListModule,
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    UserListComponent,
    OrganisationComponent,
    ShareMarketComponent,
    BidingComponent,
    PageNOtFoundComponent,
    MySharesComponent
  ],
})
export class MaterialModule {}
