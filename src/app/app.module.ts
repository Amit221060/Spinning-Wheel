import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UserService} from './apicallservice';
import { AppComponent } from './app.component';
import { HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
