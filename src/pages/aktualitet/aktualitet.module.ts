import { PipeModule } from '../../providers/pipe.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AktualitetPage } from './aktualitet';


@NgModule({
  declarations: [
    AktualitetPage
  ],
  imports: [
    IonicPageModule.forChild(AktualitetPage),
    PipeModule
  ],
})
export class AktualitetPageModule {}
