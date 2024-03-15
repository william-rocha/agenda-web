import { TestBed } from '@angular/core/testing';

import { PhoneContactsService } from './phone-contacts.service';

describe('PhoneContactsService', () => {
  let service: PhoneContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
