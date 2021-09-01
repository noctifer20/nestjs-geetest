import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axios, { CancelTokenSource } from 'axios';
import { interval, Subscription } from 'rxjs';

import { BypassStatusProvider, GeetestOptionsProvider } from '../providers';

@Injectable()
export class BypassPollingService {
  private cancelSource?: CancelTokenSource;
  private pollingInterval?: Subscription;
  private readonly logger = new Logger();

  constructor(
    private readonly geetestOptionsProvider: GeetestOptionsProvider,
    private readonly bypassStatusProvider: BypassStatusProvider,
    private readonly httpService: HttpService
  ) {}

  private log(message: string) {
    if (this.geetestOptionsProvider.options.debug) {
      this.logger.debug(message);
    }
  }

  checkBypassStatus() {
    this.cancelSource = axios.CancelToken.source();

    this.log('checking bypass status');

    const request = this.httpService.request<{ status: 1 | 0 }>({
      url: this.geetestOptionsProvider.options.bypassConfig.url,
      cancelToken: this.cancelSource.token,
      method: 'GET',
      timeout: 5000,
      params: {
        gt: this.geetestOptionsProvider.options.bypassConfig.url,
      },
    });

    request.subscribe({
      next: () => {
        this.log('bypass status check success');
      },
      error: () => {
        this.log('bypass status check fail');
      },
    });

    return request;
  }

  startPolling() {
    if (this.geetestOptionsProvider.options.bypassConfig.policy === 'polling')
      this.pollingInterval = interval(
        this.geetestOptionsProvider.options.bypassConfig.frequency
      )
        .pipe(() => this.checkBypassStatus())
        .subscribe({
          next: () => {
            this.bypassStatusProvider.bypassStatus = 1;
          },
          error: () => {
            this.bypassStatusProvider.bypassStatus = 0;
          },
        });
  }

  stopPolling() {
    this.cancelSource?.cancel();
    this.pollingInterval?.unsubscribe();
  }
}
