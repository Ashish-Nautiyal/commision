import { environment } from './../../../environments/environment';
import { Observable,map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private http:HttpClient) { }



  //displayShares
  displayShares(): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'displayShare').pipe(
      map((res) => {
        var result = { data: res.data, orgNames: res.orgNames };
        let data = result.data;
        for (let i = 0; i < data.length; i++) {
          let ary = [];
          for (let j = 1; j <= data[i].remaining_share; j++) {
            ary.push(j);
          }
          data[i].new = ary;
          ary = [];
        }
        return result;
      })
    );
  }

  // buyedShares
  buyedShares(body: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'buyedShares', body);
  }
 

  
}
