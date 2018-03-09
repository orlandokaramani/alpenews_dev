import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, App, FabContainer, ItemSliding, List, NavParams, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';
import { Service } from '../../providers/service';
import { UserData } from '../../providers/user-data';
import { PostPage } from '../../pages/post/post';
import { SchedulePage } from '../../pages/schedule/schedule';


@IonicPage()
@Component({
  selector: 'page-ekonomi',
  templateUrl: 'ekonomi.html'
})
export class EkonomiPage {

  @ViewChild('scheduleList', { read: List }) 
  scheduleList: List;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  posts: any;
  topStories: any;
  showRecent: boolean = false;
  filter: any = {};
  hasMoreStories: boolean = true;
  hasMoreTopStories: boolean = true;
  myInput: any;
  id: any;
  name: any;
  has_more_items: boolean = false;
  page: any;
  categoryId: number;
  categoryTitle: string;
  rootNavCtrl: NavController;
constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public service: Service,
    public user: UserData,
    public params: NavParams,
    
  ) {
    
    this.myInput = "";
    this.page = 1;
    this.id = params.data.id;
    this.name = params.data.title;
    this.rootNavCtrl = params.get('rootNavCtrl');

    this.service.getCategoryPost(this.id = 71, this.page)
    .then((results) => {this.posts = results});
}

  ionViewDidLoad() {
    this.filter.postLoader = true;
    this.app.setTitle('Schedule');
    this.updateSchedule();
    this.id = this.id ;
    this.categoryTitle = this.params.get('title');

    this.service.getCategoryPost(this.id, this.page)
        .then((results) => {this.filter.postLoader = false; this.posts = results});
      }

      updateSchedule() {
    // Close any open sliding items when the schedule updates
    this.scheduleList && this.scheduleList.closeSlidingItems();

    if(this.showRecent){
      this.showRecent = false;
    }
    else{
      this.showRecent = true;
     // this.filter.topStoriesPage += 1;
     }

    this.service.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(SchedulePage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
      }
    });

  }

  goToPostDetail(post: any) {
    // go to the session detail page
    // and pass in the session data

    this.navCtrl.push(PostPage, post);
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    if(this.showRecent){
      this.filter.recentStoriesPage = 1;
      this.service.getCategoryPost(this.id, this.page)
        .then((results) => {refresher.complete(); this.posts = results});
    }
    else{
      this.filter.recentStoriesPage = 1;
      this.service.getCategoryPost(this.id, this.page)
        .then((results) => {refresher.complete(); this.posts = results});
    }  
  }

  doInfinite(infiniteScroll) {
    this.page += 1;    

    this.service.getCategoryPost(this.id, this.page)
       .then((results) => this.handleMore(results, infiniteScroll));      

    }

    handleMore(results, infiniteScroll){
      if(results.posts != undefined){
        for(var i = 0; i < results.posts.length; i++) {
          this.posts.posts.push(results.posts[i]);
        };
      }
      
      if(results.posts.length == 0) {
        this.has_more_items = false;
      }

      infiniteScroll.complete();
    }

  searchPage(){
    this.navCtrl.push(EkonomiPage);
  }
}
