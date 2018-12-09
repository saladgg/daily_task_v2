import { Injectable } from "@angular/core";
import { Task } from "src/app/models/task";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  tasks: Task[];
  constructor(public storage: Storage) {
    console.log("Hello storage Service");
  }

  set(key, value) {
    return this.storage.set(key, value);
  }
  get(key) {
    return this.storage.get(key);
  }

  remove(key) {
    return this.storage.remove(key);
  }

  // getData() {
  //   return this.storage.get('todos');
  // }

  // save(data){
  //   this.storage.set('todos', data);
  // }
}
