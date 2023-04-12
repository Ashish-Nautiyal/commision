import { Injectable } from '@angular/core'; 
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

//  public socket: WebSocketSubject<any>;
  public socket:any ;
  constructor() {
    this.socket = new WebSocketSubject('ws://localhost:8080'); 

    this.socket.subscribe(
      (message:any) => {
        console.log(`Received message: ${message}`);
      },
      (err:any) => {
        console.error(err);
      }, 
      () => {
        console.log('WebSocket connection closed');
      }
    )    
   }

   
  sendMessage(message: string) { 
    this.socket.next(message);  
  }
}
