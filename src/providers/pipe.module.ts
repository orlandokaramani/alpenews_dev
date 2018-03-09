import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KeysPipe } from './pipe';

@NgModule({
  declarations: [
    KeysPipe,
  ],
  exports:[KeysPipe],
  imports: [
    IonicPageModule,
  ],
})
export class PipeModule {}
