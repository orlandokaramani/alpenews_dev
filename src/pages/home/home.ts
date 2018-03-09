import { SchedulePage } from '../../pages/schedule/schedule';
import {Component, ViewChild} from '@angular/core';
import {App, ModalController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SuperTabsController} from "ionic2-super-tabs";
import {SuperTabs} from "ionic2-super-tabs/";
import { Service } from '../../providers/service'
@IonicPage({
  segment: 'home/:type'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  page1: any = 'KreuPage';
  page2: any = 'PolitikePage';
  page3: any = 'OpedPage';
  page4: any = 'AktualitetPage';
  page5: any = 'EkonomiPage';
  page6: any = 'KulturePage';
  page7: any = 'JetePage';
  
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  posts: any;
  filter: any = {};
  showIcons: boolean = true;
  showTitles: boolean = true;
  pageTitle: string = 'Full Height';
  topStories: any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public superTabsCtrl: SuperTabsController,
    public modalCtrl: ModalController,
    public service : Service,
    public app: App,
  ) {
    const type = navParams.get('type');
    switch (type) {
      case 'icons-only':
        this.showTitles = false;
        this.pageTitle += ' - Icons only';
        break;

      case 'titles-only':
        this.showIcons = false;
        this.pageTitle += ' - Titles only';
        break;
    }
  }
  ionViewDidLoad() {
    this.filter.postLoader = true;
    this.app.setTitle('Schedule');
    this.updateSchedule();
    
    this.service.getRecentPosts(this.filter.recentStoriesPage)
        .then((results) => {this.filter.postLoader = false; this.posts = results});

     this.service.getTopPosts(this.filter.topStoriesPage)
        .then((results) => {this.filter.topLoader = false; this.topStories = results});   
   
  }
  ngAfterViewInit() {
    //this.superTabsCtrl.increaseBadge('page1', 10);
     //this.superTabsCtrl.enableTabSwipe('page3', true);
     //this.superTabsCtrl.enableTabsSwipe(true);

    // Test issue #122
    // setTimeout(() => {
    //   this.superTabs.slideTo(4);
    // }, 2000);
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

  updateSchedule() {

    this.service.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }

}
