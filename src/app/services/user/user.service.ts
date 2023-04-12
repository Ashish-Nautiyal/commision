import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})   
export class UserService {
  constructor(private http: HttpClient) {}
  // register 
  registerUser(body:any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'signUp', body);
  }

  // login 
  loginUser(newLogin: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'login', newLogin);
  }

  // admin list
  getAllAdmin(): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'getAdmins');
  }

  // agent list
  getAllAgent(): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'getAgents');
  }

  //get all users
  pagination(
    offset: any,
    limit: any,
    email: any,
    search: any
  ): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl+'getUsers?offset=' +
        offset +
        '&limit=' +
        limit +
        '&email=' +
        email +
        '&search=' +
        search
    );
  }

  //user's share
  myShares(body:any):Observable<any>{ 
   return this.http.post<any>(environment.baseUrl+'getMyShares',body).pipe( 
      map((res) => {    
        var result = res;
        var ary = [];
        let data = result.shares;
        if (data.length<=0) return result; 
        for (let i = 0; i < data.length; i++) { 
          for (let j = 1; j <= data[i].share_percentage; j++) { 
            ary.push(j);
          }
          data[i].new = ary; 
          ary = [];
        }
        return result;
      })
    );
  }

  //UserProfile
  myProfile(currentUser: any): Observable<any> {
    return this.http
      .post<any>(environment.baseUrl+'profile', currentUser);
      
  }

  // update userProfile
  updateUserProfile(update: any): Observable<any> {
    return this.http.put<any>(environment.baseUrl+'editProfile', update);
  }
  //<--------------------------------------------------------------------------------->
  //email Exist or not in orgComDistribution
  orgData(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'commission/checkCommissionRequest', body);
  }
  //Insert Request
  orgComInserData(body: any): Observable<any> {
    return this.http.post<any>(
      environment.baseUrl+'commission/commissionRequest',
      body
    );
  }
  // organisation detail
  myOrganisation(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'organisation/myOrg', body);
  }
  //checking release for admin
  countForReleaseOrg(): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'requestCount');
  }
  //releasing Organisation
  releaseOrg(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'releaseOrg', body);
  }
  //reopen Account
  reopen(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'reopen', body);
  }

  // --------------------------------------------------------------------
  //share Check
  shareAval(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'shareCheck', body);
  }

  
  // Share release request
  shareRealeaseReq(): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'shareReleaseReq');
  }

   //share Insert
   sharInsert(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'shareEntry', body);
  }

  // shareRelease
  shareRelease(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'shareRelease', body);
  }

 
   // Add bid
 biding(body: any): Observable<any> {
  return this.http.post<any>(environment.baseUrl+'addBid', body);
}

// Win bid time expired
winBidTimeExpired(body: any): Observable<any> {
  return this.http.delete<any>(
    environment.baseUrl+'winBidExpired?id='+
    body
  );
}

//Purchasse win bid
purchaeWinBid(body: any): Observable<any> {
  return this.http.post<any>(environment.baseUrl+'purchaseWinBid', body);
}

}
