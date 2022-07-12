import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UrlsApiService} from '../../model/urls-api.service';
import {Url} from '../../model/url.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit, OnDestroy {
  constructor(private urlsApi: UrlsApiService) { }

  urlsListSubs: Subscription = Subscription.EMPTY;
  urlsList: Url[] = [];

  ngOnInit() {
    this.urlsListSubs = this.urlsApi
        .getUrls()
        .subscribe((res) => {
          this.urlsList = res;
        },
        console.error,
        );
  }

  ngOnDestroy() {
    this.urlsListSubs.unsubscribe();
  }
}
