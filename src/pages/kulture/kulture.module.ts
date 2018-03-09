import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KulturePage } from './kulture';
import { PipeModule } from '../../providers/pipe.module'
@NgModule({
  declarations: [
    KulturePage,
  ],
  imports: [
    IonicPageModule.forChild(KulturePage),
    PipeModule
  ],
})
export class KulturePageModule {}
