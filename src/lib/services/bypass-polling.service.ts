import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { CancelTokenSource } from 'axios';
import { interval, Subscription } from 'rxjs';

import { BypassStatusProvider, GeetestOptionsProvider } from '../providers';

@Injectable()
export class BypassPollingService {
  private cancelSource?: CancelTokenSource;
  private pollingInterval?: Subscription;

  constructor(
    private readonly geetestOptionsProvider: GeetestOptionsProvider,
    private readonly bypassStatusProvider: BypassStatusProvider,
    private readonly httpService: HttpService
  ) {
    console.log(
      'gt-----------BypassPollingService',
      geetestOptionsProvider,
      bypassStatusProvider
    );
  }

  async startPolling() {
    this.pollingInterval = interval(
      this.geetestOptionsProvider.options.HTTP_TIMEOUT_DEFAULT
    ).subscribe(() => {
      this.cancelSource = axios.CancelToken.source();

      this.httpService
        .request<{ status: 'success' | 'fail' }>({
          url: this.geetestOptionsProvider.options.BYPASS_URL,
          cancelToken: this.cancelSource.token,
          method: 'GET',
          timeout: 5000,
          params: {
            gt: this.geetestOptionsProvider.options.GEETEST_ID,
          },
        })
        .subscribe({
          next: (response) => {
            console.log(response.data);
            this.bypassStatusProvider.bypassStatus = response.data.status;
          },
          error: (err) => {
            console.log(err);

            this.bypassStatusProvider.bypassStatus = 'fail';
          },
        });
    });
  }

  stopPolling() {
    this.cancelSource?.cancel();
    this.pollingInterval?.unsubscribe();
  }
}
