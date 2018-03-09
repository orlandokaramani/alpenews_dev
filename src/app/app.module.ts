import { UserData } from './../providers/user-data';
import { SchedulePage } from './../pages/schedule/schedule';
import { PostPage } from '../pages/post/post';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Service } from '../providers/service'
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal'
import { Functions } from '../providers/functions';
import { Facebook } from '@ionic-native/facebook';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    PostPage,
    SchedulePage,
  
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule, 
    HttpModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PostPage,
    SchedulePage,
  ],
 
providers: [
    SplashScreen,
    StatusBar,
    SchedulePage,
    Service,
    OneSignal,
    Facebook,
    SocialSharing,
    Functions,
    UserData,
    
    NativeStorage,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
