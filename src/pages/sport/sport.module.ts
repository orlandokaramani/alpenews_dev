import { PipeModule } from './../../providers/pipe.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportPage } from './sport';

@NgModule({
  declarations: [
    SportPage,
  ],
  imports: [
    IonicPageModule.forChild(SportPage),
    PipeModule
  ],
})
export class SportPageModule {}
