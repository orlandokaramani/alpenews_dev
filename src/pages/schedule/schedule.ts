import { Component } from '@angular/core';
  import { NavParams, ViewController, Platform } from 'ionic-angular';
  import { Service } from '../../providers/service';
  import { OneSignal } from '@ionic-native/onesignal';
  import { Storage } from '@ionic/storage';

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-schedule',
    templateUrl: 'schedule.html'
  })
  export class SchedulePage {
    tracks: Array<{name: string, isChecked: boolean}> = [];
  
    constructor(
      public confData: Service,
      public navParams: NavParams,
      public viewCtrl: ViewController,
      private oneSignal: OneSignal,
      public platform: Platform,
      public storage: Storage,
    ) {
      // passed in array of track names that should be excluded (unchecked)
      //let excludedTrackNames = this.navParams.data;    
  
      this.storage.get('push').then((value) => {
        for(let item in value){
          if(value[item].isChecked){
            this.confData.mainCategories[item].isChecked = true;
          }
        }
      });
    
            if(this.platform.is('cordova')){
  
            this.oneSignal.getTags().then((value) => {
              console.log('Tags Received: ' + JSON.stringify(value));
            });
  
            this.oneSignal.startInit('9d3f5c20-0ebb-4321-9e22-1cf74d2409ce', '814460906186');
  
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
  
            this.oneSignal.handleNotificationReceived().subscribe(() => {
             
            });
  
            this.oneSignal.handleNotificationOpened().subscribe(() => {
             
            });
            this.oneSignal.endInit();
        }
      }
  
    resetFilters() {
      // reset all of the toggles to be checked
      this.confData.mainCategories.forEach(category => {
        category.isChecked = false;
        this.oneSignal.deleteTag(category.slug);
      });
    }
  
    setPush(track: any){
      console.log(track);
      if(track.isChecked){
          //Subscribe track.slug for pushNotification
          this.oneSignal.sendTag(track.slug, track.slug);
          
      }
      else{
        this.oneSignal.deleteTag(track.slug);
        //UnSubscribe track.slug for pushNotification
      }
    }
  
    applyFilters() {
      this.storage.set('push', this.confData.mainCategories);
      // Pass back a new array of track names to exclude
     console.log(this.confData.mainCategories);
      //let excludedTrackNames = this.confData.mainCategories.filter(c => !c.isChecked).map(c => c.name);
      this.dismiss();
    }
  
    dismiss(data?: any) {
      // using the injected ViewController this page
      // can "dismiss" itself and pass back data
      this.viewCtrl.dismiss(data);
    }
  }
  