import { PipeModule } from '../../providers/pipe.module';
import { PolitikePage } from './politike';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PolitikePage,
  ],
  imports: [
    IonicPageModule.forChild(PolitikePage),
    PipeModule
  ]
})
export class Module {}
