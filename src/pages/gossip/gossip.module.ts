import { PipeModule } from './../../providers/pipe.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GossipPage } from './gossip';

@NgModule({
  declarations: [
    GossipPage,
  ],
  imports: [
    IonicPageModule.forChild(GossipPage),
    PipeModule
  ],
})
export class GossipPageModule {}
