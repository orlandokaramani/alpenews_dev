import { PipeModule } from './../../providers/pipe.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlogPage } from './blog';

@NgModule({
  declarations: [
    BlogPage,
  ],
  imports: [
    IonicPageModule.forChild(BlogPage),
    PipeModule
  ],
})
export class BlogPageModule {}
