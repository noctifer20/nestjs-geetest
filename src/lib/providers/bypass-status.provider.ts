import { Injectable } from '@nestjs/common';

@Injectable()
export class BypassStatusProvider {
  private value: 'success' | 'fail' = 'fail';

  get bypassStatus() {
    return this.value;
  }

  set bypassStatus(status) {
    this.value = status;
  }
}
