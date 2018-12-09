import { TestBed } from "@angular/core/testing";

import { CarryDataService } from "./carry-data.service";

describe("CarryDataService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: CarryDataService = TestBed.get(CarryDataService);
    expect(service).toBeTruthy();
  });
});
