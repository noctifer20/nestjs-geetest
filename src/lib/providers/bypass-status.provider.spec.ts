import { Test, TestingModule } from '@nestjs/testing';
import test from 'ava';

import { BypassStatusProvider } from './bypass-status.provider';

let bypassStatusProvider: BypassStatusProvider;

test.before(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [BypassStatusProvider],
  }).compile();

  bypassStatusProvider = module.get<BypassStatusProvider>(BypassStatusProvider);
});

test('should be defined', (t) => {
  t.not(bypassStatusProvider, undefined);
});

test.serial('should have default status as fail', (t) => {
  t.deepEqual(bypassStatusProvider.bypassStatus, 'fail');
});

test.serial('status change status with setter', (t) => {
  bypassStatusProvider.bypassStatus = 'success';
  t.deepEqual(bypassStatusProvider.bypassStatus, 'success');
});
