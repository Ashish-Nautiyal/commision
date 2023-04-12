import { environment } from './../../../environments/environment';
import { Observable,map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  constructor(private http:HttpClient) { }

// Display bids
displayBiding(): Observable<any> {
  return this.http.get<any>(environment.baseUrl+'displayBiding').pipe(
    map((res) => {
      let result = {
        bidsList: res.bidsList,
        bidTime: res.bidTime,
        orgNames: res.orgNames,
        highestBid: res.highestBid,
      };
      let ary = [];
      let bidingsData = result.bidsList;
      for (let i = 0; i < bidingsData.length; i++) {
        ary.push(bidingsData[i].share_price);
        if (
          bidingsData[i].user_email == localStorage.getItem('currentUser')
        ) {
          bidingsData[i].user = false;
        } else {
          bidingsData[i].user = true;
        }
      }
      bidingsData.new = ary;
      return result;
    })
  );
}

// Biding Timer start
bidStart(body: any): Observable<any> {
  return this.http.put<any>(environment.baseUrl+'saveBid', body);
}

// Biding Time Expired
bidTimeExpired(body: any): Observable<any> {
  return this.http.post<any>(environment.baseUrl+'bidExpired', body);
}

}
