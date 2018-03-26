import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { UserData } from './user-data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');


@Injectable()
export class Service {
  recentPosts: any;
  data: any;
  url: any = '';
  //url: any;
  //url: any = 'http://localhost:8888/wp475';
  categories: any = {};
  mainCategories: any = [];
  loggedInn: any;
  relatedPosts: any;
  topStories: any;
  page: any;
  categoryPost: any;
  settings: any;
  status: any;
  search: any;

  constructor(public http: Http, public user: UserData) { 

     this.url = 'https://alpenews.al';
     //this.url = 'http://theindependentindian.com';
     //this.url = 'http://localhost/wp';
     //this.url = '/api';


  }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  getCategories () {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_category_index/')
        .map(res => res.json())
            .subscribe(data => {
              console.log(data);
              this.categories = data;
              this.mainCategories = [];

              for (var i = 0; i < this.categories.categories.length; i++) {
                   if (this.categories.categories[i].parent == '0') {
                       this.mainCategories.push(this.categories.categories[i]);
                  }
              }

          this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-blog-settings').map(res => res.json())
                .subscribe(data => {
                  this.settings = data;
          });
              resolve(data);
        });
    });

    /*this.categories = {"status":"ok","count":17,"categories":[{"id":92,"slug":"b-town-buzz","title":"B-town Buzz","description":"","parent":0,"post_count":41},{"id":94,"slug":"box-office","title":"Box-office","description":"","parent":92,"post_count":15},{"id":31,"slug":"breaking-news","title":"Breaking News","description":"","parent":0,"post_count":22},{"id":32,"slug":"business-news","title":"Business News","description":"","parent":0,"post_count":50},{"id":33,"slug":"car-bike","title":"Car &amp; bike","description":"","parent":0,"post_count":20},{"id":96,"slug":"celebrity-rendezvous","title":"Celebrity rendezvous","description":"","parent":92,"post_count":21},{"id":97,"slug":"food","title":"Food","description":"","parent":36,"post_count":26},{"id":110,"slug":"gadgets","title":"Gadgets","description":"","parent":0,"post_count":28},{"id":93,"slug":"happiness","title":"Happiness","description":"","parent":36,"post_count":4},{"id":36,"slug":"health-lifestyle","title":"Health &amp; lifestyle","description":"","parent":0,"post_count":63},{"id":159,"slug":"international-desk","title":"International Desk","description":"","parent":0,"post_count":37},{"id":87,"slug":"national-news","title":"National News","description":"","parent":0,"post_count":40},{"id":88,"slug":"page-3","title":"Page-3","description":"","parent":92,"post_count":12},{"id":98,"slug":"spiritual","title":"Spiritual","description":"","parent":36,"post_count":12},{"id":160,"slug":"the-independent-opinion","title":"The Independent Opinion","description":"","parent":0,"post_count":10},{"id":35,"slug":"video","title":"Video","description":"","parent":0,"post_count":3},{"id":51,"slug":"your-health","title":"Your Health","description":"","parent":36,"post_count":21}]};
            this.mainCategories = [];
            for (var i = 0; i < this.categories.categories.length; i++) {
                 if (this.categories.categories[i].parent == '0') {
                     this.mainCategories.push(this.categories.categories[i]);
                }
            }*/

  }

  getSearch(event, page) {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_search_results/?'+ 'search=' + event + '&page=' + page).map(res => res.json())
            .subscribe(data => {
              this.search = data;
              resolve(this.search);
        });
     });
  }


  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });
      return day;
    });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }
    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().map((data: any) => {
      return data.speakers.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

  login(login: any){
    var params = new URLSearchParams();
    params.append("username", login.username);
    params.append("password", login.password);

    return new Promise(resolve => {  
      this.http.post(this.url + '/api/app/login/', params).map(res => res.json())
        .subscribe(data => {
          this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-blog-settings').map(res => res.json())
                .subscribe(data => {
                  this.settings = data;
          });
          resolve(data);
        });
    });
  }

  register(signup: any){
    var params = new URLSearchParams();
    params.append("email", signup.email);
    params.append("password", signup.password);

    return new Promise(resolve => {  
      this.http.post(this.url + '/api/app/register', params).map(res => res.json())
        .subscribe(data => {
          this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-blog-settings').map(res => res.json())
                .subscribe(data => {
                  this.settings = data;
          });
          resolve(data);
        });
    });
  }

  getPost(id: any) {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_post/?'+ 'id=' + id).map(res => res.json())
            .subscribe(data => {
              resolve(data);
        });
     });
  }

  getCategoryPost(id: any, page: any) {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_category_posts/?'+ 'id=' + id + '&page=' + page).map(res => res.json())
            .subscribe(data => {
              this.categoryPost = data;
              console.log(data);
              resolve(this.categoryPost);
        });
     });
  }

  getRecentPosts(page: any) {
    return new Promise(resolve => {
      console.log(this.url);
        this.http.get(this.url + '/api/core/get_recent_posts/?' + 'page=' + page + '&count=20').map(res => res.json())
            .subscribe(data => {
              resolve(data);
        });
     });
  }

  getTopPosts(page: any) {
    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_tag_posts/?' + 'page=' + page + '&slug=top-story&count=20').map(res => res.json())
            .subscribe(data => {
              this.topStories = data;
              resolve(this.topStories);
        });
    });
  }
  
    getRelatedPosts(id) {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_category_posts/?'+ 'id=' + id).map(res => res.json())
            .subscribe(data => {
              this.relatedPosts = data;
              resolve(this.relatedPosts);
        });
     });
  }

  getPage(id) {

    return new Promise(resolve => {
        this.http.get(this.url + '/api/core/get_page/?'+ 'id=' + id).map(res => res.json())
            .subscribe(data => {
              this.page = data;
              resolve(this.page);
        });
     });
  }

  getSettings(){
    if (this.settings) {
      return new Promise(resolve => {
        resolve(this.settings);
      });  
    } else {
        return new Promise(resolve => {
            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-blog-settings').map(res => res.json())
                .subscribe(data => {
                  this.settings = data;
                    resolve(this.settings);
                });
        });
      }
    }

    submitComment(form, id){

    var params =new URLSearchParams();
    params.append("content", form.content);
    params.append("name", form.nickname);
    params.append("email", form.email);

    return new Promise(resolve => {
      this.http.post(this.url + '/api/respond/submit_comment/?' + 'post_id=' + id, params).map(res => res.json())
      .subscribe(data =>{
        this.status = data;
        resolve(this.status);
        }, err => resolve(JSON.parse(err._body)));
    });
  }

  googleLogin(token, email, first_name, last_name){
    var params = new URLSearchParams();
    params.append("access_token", token);
    params.append("email", email);
    params.append("first_name", first_name);
    params.append("last_name", last_name);
        return new Promise(resolve => {
        this.http.post(this.url + '/api/app/google_connect/', params).map(res => res.json())
        .subscribe(data => {
            console.log(data);
            resolve(data);
        });
    });
  }

  faceBookLogin(token){
    var params = new URLSearchParams();
    console.log(token);
    params.append("access_token", token);
        return new Promise(resolve => {
        this.http.post(this.url + '/api/app/facebook_connect/', params).map(res => res.json())
        .subscribe(data => {
            console.log(data);
            if(data.last_name)
            this.user.setUsername(data.last_name);
            this.user.setImage(data.avatar);
            resolve(data);
        });
    });
  }

}
