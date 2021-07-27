import { Injectable } from '@nestjs/common';

@Injectable()
export class BypassStatusProvider {
  constructor() {
    console.log('gt---------BypassStatusProvider');
  }
  private value: 'success' | 'fail' = 'fail';

  get bypassStatus() {
    return this.value;
  }

  set bypassStatus(status) {
    this.value = status;
  }
}
