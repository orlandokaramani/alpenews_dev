import { Component } from '@angular/core';
//import { NgForm } from '@angular/forms';
import { Service } from '../../providers/service';
import { Functions } from '../../providers/functions';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NavController, FabContainer, LoadingController, NavParams } from 'ionic-angular';



@Component({
  templateUrl: 'post.html'
})
export class PostPage {

  id: any;
  post: any;
  relatedPostsLoader : boolean = false;
  relatedPosts: any;
  item: any;
  form: any;
  status: any;
  message: any;
  name: any;
  url: any;
  image: any;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public service: Service,
    public functions: Functions,
    public params: NavParams,
    private socialSharing: SocialSharing
    ) { 

    this.form = [];
    this.post = params.data;
    this.id = params.data.id;
    console.log(this.post.id);
    this.service.getPost(this.post.id)
       .then((results) => this.handlePostResults(results));
}

  handlePostResults(results){
    this.post = results;
    if(this.post.post.categories.length){
      this.relatedPostsLoader = true;
      this.service.getRelatedPosts(this.post.post.categories[0].id)
          .then((results) => {this.relatedPostsLoader = false; this.relatedPosts = results});
          console.log(this.relatedPosts);
    }

    else{
       this.relatedPostsLoader = false;
    }
  }

    getPost(id, name){
      this.item = [];
      this.item.id = id;
      this.item.name = name;
      this.nav.push(PostPage, this.item);
    }

  submit(){
    
    if(this.validateForm()){
       this.service.submitComment(this.form, this.id)
       .then((results) => this.handleResults(results));
    }
  }

    handleResults(results){
    if(!results.error){
        this.status = results;
        this.functions.showAlert('success', 'You have successfully submitted your comment');

        this.form.content = "";
        this.form.nickname = "";
        this.form.email = "";
    }

    else if(results.error){
        this.functions.showAlert('error', results.error);
    }       
  }

    validateForm(){
      
      if(this.form.nickname == undefined || this.form.nickname == ""){this.functions.showAlert("Oops!", "Please Enter name"); return false}
      if(this.form.email == undefined || this.form.email == ""){this.functions.showAlert("Oops!", "Please Enter email"); return false}
      if(this.form.content == undefined || this.form.content == ""){this.functions.showAlert("Oops!", "Please Enter Comment"); return false}
    
     return true;
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

   shareWithFb(post, network: string, fab: FabContainer){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    
      this.message = post.title; // not supported on some apps (Facebook, Instagram)
      this.image = post.thumbnail; // fi. for email
     // files: ['', ''], // an array of filenames either locally or remotely
      this.url = post.url;
     // chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.present();
    loading.onWillDismiss(() => {
      fab.close();
    });
    

    this.socialSharing.shareViaFacebook(this.message, this.image, this.url);
    }

  shareWithTw(post, network: string, fab: FabContainer){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    
      this.message = post.title; // not supported on some apps (Facebook, Instagram)
      this.image = post.thumbnail; // fi. for email
     // files: ['', ''], // an array of filenames either locally or remotely
      this.url = post.url;
     // chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.present();
    loading.onWillDismiss(() => {
      fab.close();
    });
    
    this.socialSharing.shareViaTwitter(this.message, this.image, this.url);
  }

    shareWithGmail(post){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    
      this.message = post.title; // not supported on some apps (Facebook, Instagram)
      this.image = post.thumbnail; // fi. for email
     // files: ['', ''], // an array of filenames either locally or remotely
      this.url = post.url;
     // chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    

    this.socialSharing.shareViaEmail(this.url, this.message, [this.image]);
  }

   shareWithWhatsapp(post, network: string, fab: FabContainer){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    
      this.message = post.title; // not supported on some apps (Facebook, Instagram)
      this.image = post.thumbnail; // fi. for email
     // files: ['', ''], // an array of filenames either locally or remotely
      this.url = post.url;
     // chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();

     this.socialSharing.shareViaWhatsApp(this.message, this.image, this.url);
  }

}
