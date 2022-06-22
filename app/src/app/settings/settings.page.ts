import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ChannelService } from '../core/services/channel.service';
import { ChatHubService } from '../core/services/chat-hub.service';
import { SessionService } from '../core/services/session.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit { 
  chat: Object = null;
  users: Object[] = [];
  quests: Object[] = [];
  user: Object = null;

  constructor(
    public alertController: AlertController,
    private router: Router,
    private chatService: ChannelService,
    private chatHubService: ChatHubService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.chatService.getWithUsers(this.chatHubService.activeChatId)
      .subscribe(response => {
        this.chat = response['data']
        this.users = response['data']['users']
      });
    this.chatService.getWithQuests(this.chatHubService.activeChatId)
      .subscribe(response => {
        this.quests = response['data']['quests'];
      });

    this.user = this.sessionService.get();
  }

  mockNavigateToChat(){
    this.router.navigate(['/chat-detail'])
  }

  mockNavigateToQuests(){
    this.router.navigate(['/quest-detail'])
  }

  async deleteUserFromChat(user: Object){
    const alert = await this.alertController.create({
      header: 'Benutzer ausschliessen?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, 
        {
          text: 'Ja',
          cssClass: 'alertCancel',
          handler: (data) => {
            if (user['id'] !== this.user['id']) {
              this.chatService.removeUsers(this.chat['id'], [user])
                .subscribe(result => {
                  this.users.splice(this.users.indexOf(user), 1);
                })
            } else {
                return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async leaveChat(user){
    const alert = await this.alertController.create({
      header: 'Chat verlassen?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, 
        {
          text: 'Ja',
          cssClass: 'alertCancel',
          handler: (data) => {
            if (user['id'] === this.user['id']) {
              this.chatService.removeUsers(this.chat['id'], [user])
                .subscribe(() => this.router.navigate(['/']));
            } else {
                return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
