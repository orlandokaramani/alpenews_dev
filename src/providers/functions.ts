import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';

@Injectable()
export class Functions {
    loader: any;
    constructor(private alert: AlertController) {
    }
    showAlert(title, text) {
        let alert = this.alert.create({
            title: title,
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
}