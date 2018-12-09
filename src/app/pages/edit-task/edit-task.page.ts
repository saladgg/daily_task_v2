import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { Toast } from "@ionic-native/toast/ngx";
import { CarryDataService } from "src/app/services/carry-data/carry-data.service";

@Component({
  selector: "app-edit-task",
  templateUrl: "./edit-task.page.html",
  styleUrls: ["./edit-task.page.scss"]
})
export class EditTaskPage {
  task = { taskId: 0, dayTask: "", taskTime: "", isComplete: false };
  constructor(
    public navCtrl: NavController,
    private sqlite: SQLite,
    private toast: Toast,
    private carryData: CarryDataService
  ) {
    this.getCurrentData(carryData.getData());
  }

  getCurrentData(taskId) {
    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT * FROM tblTasks WHERE taskId=?", [taskId])
            .then(res => {
              if (res.rows.length > 0) {
                this.task.taskId = res.rows.item(0).taskId;
                this.task.dayTask = res.rows.item(0).dayTask;
                this.task.taskTime = res.rows.item(0).taskTime;
                this.task.isComplete = res.rows.item(0).isComplete;
              }
            })
            .catch(e => {
              console.log(e);
              this.toast.show(e, "5000", "center").subscribe(toast => {
                console.log(toast);
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

  updateTask() {
    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql(
            "UPDATE tblTasks SET dayTask=?,taskTime=?,isComplete=? WHERE taskId=?",
            [
              this.task.dayTask,
              this.task.taskTime,
              this.task.isComplete,
              this.task.taskId
            ]
          )
            .then(res => {
              console.log(res);
              this.toast
                .show("Task updated", "5000", "center")
                .subscribe(toast => {
                  this.navCtrl.goBack();
                });
            })
            .catch(e => {
              console.log(e);
              this.toast.show(e, "5000", "center").subscribe(toast => {
                console.log(toast);
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
