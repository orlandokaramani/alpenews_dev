import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JetePage } from './jete';
import { PipeModule } from '../../providers/pipe.module'
@NgModule({
  declarations: [
    JetePage,
  ],
  imports: [
    IonicPageModule.forChild(JetePage),
    PipeModule
  ],
})
export class JetePageModule {}
