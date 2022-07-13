import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {UrlsApiService} from '../model/urls-api.service';
import {Url} from '../model/url.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';
  inputString = '';

  urlsListSubs: Subscription = Subscription.EMPTY;
  urlShortenSubs: Subscription = Subscription.EMPTY;
  urlsList: Url[] = [];
  urlShorten: string = '';

  constructor(private urlsApi: UrlsApiService, private toast: ToastrService) {
  }

  ngOnInit() {
    this.urlsListSubs = this.urlsApi
        .getUrls()
        .subscribe((res) => {
          this.urlsList = res;
          this.toast.success('Loaded shortened link');
          this.urlShorten = this.urlsList[this.urlsList.length - 1].shortUrl;
        });
  }

  ngOnDestroy() {
    this.urlsListSubs.unsubscribe();
  }

  onInputChange(event: any) {
    if (!(event.target.value as string)) return;
    this.inputString = event.target.value as string;
  }

  onClick() {
    if (!this.inputString) {
      this.toast.error('Text Field Cannot Be Empty');
      return;
    }

    this.urlShortenSubs = this.urlsApi
        .addUrl(this.inputString)
        .subscribe((res) => {
          this.urlShorten = res;
          this.toast.success('Loaded shortened link');
        },
        (error) => {
          this.toast.error('Server Error');
        });
  }
}
