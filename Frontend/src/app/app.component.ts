import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UrlsApiService } from '../model/urls-api.service';
import { Url } from '../model/url.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';
  inputString = '';

  urlsListSubs: Subscription = Subscription.EMPTY;
  urlShortenSubs: Subscription = Subscription.EMPTY;
  urlsList: Url[] = [];
  urlShorten: string = '';

  constructor(private urlsApi: UrlsApiService) {
  }

  ngOnInit() {
    this.urlsListSubs = this.urlsApi
      .getUrls()
      .subscribe(res => {
        this.urlsList = res;
      },
        console.error
      );
  }

  ngOnDestroy() {
    this.urlsListSubs.unsubscribe();
  }

  onInputChange(event: any) {
    if (!(event.target.value as string)) {
      // show toast message if no input
      return;
    }
    this.inputString = event.target.value as string;
  }

  onClick() {
    if (!this.inputString) {
      // can show toast message if no input
      return;
    }

    this.urlShortenSubs = this.urlsApi
      .addUrl(this.inputString)
      .subscribe(res => {
        this.urlShorten = res;
      },
        console.error
      );
    // show toast message for success
  }
}
