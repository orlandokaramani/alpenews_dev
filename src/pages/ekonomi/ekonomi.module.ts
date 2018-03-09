import { PipeModule } from '../../providers/pipe.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EkonomiPage } from './ekonomi';

@NgModule({
  declarations: [
    EkonomiPage,
  ],
  imports: [
    IonicPageModule.forChild(EkonomiPage),
    PipeModule,
  ],
})
export class EkonomiPageModule {}
