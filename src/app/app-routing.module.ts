import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './material/user/login/login.component';
import { PageNOtFoundComponent } from './material/organisations/page-not-found/page-not-found.component';
import { RegisterComponent } from './material/user/register/register.component';
import { UserListComponent } from './material/user/user-list/user-list.component';
import { HeaderComponent } from './headers/header/header.component';
import { UserProfileComponent } from './material/user/user-profile/user-profile.component';
import { OrganisationComponent } from './material/organisations/organisation/organisation.component';
import { ShareMarketComponent } from './material/market/share-market/share-market.component';
import { BidingComponent } from './material/market/biding/biding.component';
import { AuthGuard } from './material/guards/auth.guard';
import { MySharesComponent } from './material/user/my-shares/my-shares.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'user',
    component: HeaderComponent,
    children: [
      { path: '', component: HeaderComponent },
      {
        path: 'myProfile',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: UserProfileComponent },
          {
            path: 'myOrganisation',
            component: OrganisationComponent,
            canActivate: [AuthGuard],
          },         
        ],
      },
      {
        path: 'myShares',
        component: MySharesComponent,
        canActivate: [AuthGuard],
      },
      { path: 'register', component: RegisterComponent },
      {
        path: 'userList',
        component: UserListComponent,
        canActivate: [AuthGuard],
      },
      { path: 'biding', component: BidingComponent, canActivate: [AuthGuard] },
      {
        path: 'share',
        component: ShareMarketComponent,
        canActivate: [AuthGuard],
      },
      { path: '**', component: PageNOtFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
// @NgModule({
//   imports: [ RouterModule.forChild(routes) ],
//   exports: [ RouterModule ]
// })
export class AppRoutingModule {}
