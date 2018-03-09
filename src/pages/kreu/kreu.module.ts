import { PipeModule } from './../../providers/pipe.module';
import { KreuPage } from './kreu';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    KreuPage,
],

  imports: [
    IonicPageModule.forChild(KreuPage),
PipeModule
  ]
})
export class Module {}