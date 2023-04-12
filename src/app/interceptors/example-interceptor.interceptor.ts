import { Injectable } from '@angular/core'; 
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ExampleInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(httpRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwt = localStorage.getItem("token");
    if(jwt){
      return next.handle(httpRequest.clone({ setHeaders: { authorization: `${jwt}`  } 
    }));
    }else{
      return next.handle(httpRequest);  
    }
   
  }
}
