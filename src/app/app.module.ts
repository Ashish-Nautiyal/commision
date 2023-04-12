//modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

//components
import { AppComponent } from './app.component';
import { HeaderComponent } from './headers/header/header.component'; 
import { ExampleInterceptorInterceptor } from './interceptors/example-interceptor.interceptor'; 
import { ChildComponent } from './headers/child/child.component';
import { ParentComponent } from './headers/parent/parent.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChildComponent,
    ParentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule, 
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExampleInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
