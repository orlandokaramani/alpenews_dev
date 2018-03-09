import { PipeModule } from './../../providers/pipe.module';
import { OpedPage } from './oped';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    OpedPage,
],
  
  imports: [
    PipeModule,
    IonicPageModule.forChild(OpedPage)
  ]
})
export class Module {}