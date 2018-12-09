import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Datetime, NavController, Events } from "@ionic/angular";
import { Task } from "src/app/models/task";
import { StorageService } from "src/app/services/storage-service/storage.service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { Toast } from "@ionic-native/toast/ngx";

@Component({
  selector: "app-add-task",
  templateUrl: "./add-task.page.html",
  styleUrls: ["./add-task.page.scss"]
})
export class AddTaskPage {
  formGroup: FormGroup;
  taskTime: Datetime;
  //taskTime = new Date().toLocaleTimeString();
  tasks: Task[];
  formData: any;

  TaskNotificationName: string;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public storageProvider: StorageService,
    public events: Events,
    private sqlite: SQLite,
    private toast: Toast
  ) {
    this.formGroup = formBuilder.group({
      isComplete: false,
      dayTask: ["", Validators.required],
      taskTime: this.taskTime
    });
    this.formData = this.formGroup.value;
  }

  createTask(formData) {
    console.log("------form data---", formData);

    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO tblTasks VALUES(NULL,?,?,?)", [
            formData.dayTask,
            formData.taskTime,
            formData.isComplete
          ]).then(res => {
            console.log(res);
            this.toast.show("Task saved", "5000", "center").subscribe(toast => {
              this.navCtrl.goBack();
            });
          });
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, "5000", "center").subscribe(toast => {
            console.log(toast);
          });
        });
    });
  }
}
