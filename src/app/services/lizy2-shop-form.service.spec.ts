import { TestBed } from '@angular/core/testing';

import { Lizy2ShopFormService } from './lizy2-shop-form.service';

describe('Lizy2ShopFormService', () => {
  let service: Lizy2ShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lizy2ShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
