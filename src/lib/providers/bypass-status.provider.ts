import { Injectable } from '@nestjs/common';

@Injectable()
export class BypassStatusProvider {
  private value: 1 | 0 = 0;

  get bypassStatus() {
    return this.value;
  }

  set bypassStatus(status) {
    this.value = status;
  }
}
