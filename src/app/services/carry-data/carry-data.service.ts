import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CarryDataService {
  constructor() {}

  data;

  getData() {
    return this.data;
  }

  setData(data) {
    return (this.data = data);
  }
}
