import { Component } from "@angular/core";
import { Task } from "src/app/models/task";
import { NavController, AlertController } from "@ionic/angular";
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { AudioService } from "src/app/services/audio-service/audio.service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { Toast } from "@ionic-native/toast/ngx";
import { Router } from "@angular/router";
import { CarryDataService } from "src/app/services/carry-data/carry-data.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  //tasks: Task[] = [];
  tasks: Task[];
  // the 'it-IT' helps display time in 24 hrs
  //taskStartTime = new Date().toLocaleTimeString("it-IT");
  taskStartTime;
  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public nativeAudio: NativeAudio,
    public audioProvider: AudioService,
    private sqlite: SQLite,
    private toast: Toast,
    private carryData: CarryDataService,
    private navCtrl: NavController
  ) {
    this.loadAlarm();
    this.getTasks();
    setInterval(() => {
      this.taskStartTime = new Date().toLocaleTimeString("it-IT");
    }, 1000);
    this.taskStatusAlert();
  }

  loadAlarm() {
    this.audioProvider.preload("alertSound", "assets/audio/alarm.wav");
  }

  ionViewWillEnter() {
    this.loadAlarm();
    this.getTasks();
    setInterval(() => {
      this.taskStartTime = new Date().toLocaleTimeString("it-IT");
    }, 1000);
  }

  getTasks() {
    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql(
            "CREATE TABLE IF NOT EXISTS tblTasks(taskId INTEGER PRIMARY KEY, dayTask TEXT, taskTime TEXT, isComplete BOOLEAN)",
            []
          )
            .then(res => console.log("Executed SQL"))
            .catch(e => console.log(e));

          db.executeSql("SELECT * FROM tblTasks ORDER BY taskId DESC", [])
            .then(res => {
              this.tasks = [];
              for (var i = 0; i < res.rows.length; i++) {
                this.tasks.push({
                  taskId: res.rows.item(i).taskId,
                  dayTask: res.rows.item(i).dayTask,
                  taskTime: res.rows.item(i).taskTime,
                  isComplete: res.rows.item(i).isComplete
                });
              }
            })
            .catch(e => console.log(e));
        });
    });
  }

  addTask() {
    this.router.navigateByUrl("add-task");
  }

  editTask(taskId) {
    this.router.navigateByUrl("edit-task");
    this.carryData.setData(taskId);
  }

  deleteTask(taskId) {
    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("DELETE FROM tblTasks WHERE taskId=?", [taskId])
            .then(res => {
              console.log(res);
              this.getTasks();
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    });
  }

  playAudio() {
    this.audioProvider.play("alertSound");
  }

  taskStatusAlert() {
    document.addEventListener("deviceready", () => {
      setInterval(() => {
        let status = this.tasks.find(
          task =>
            task.isComplete == false && task.taskTime == this.taskStartTime
        );
        if (status) return this.audioProvider.play("alertSound");
      }, 1000);
    });
  }

  toggleStatus(task) {
    document.addEventListener("deviceready", () => {
      this.sqlite
        .create({
          name: "tasksdb.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO tblTasks VALUES(NULL,?,?,?)", [
            task.dayTask,
            task.taskTime,
            true
          ]).then(res => {
            this.toast
              .show("Task is done!", "5000", "center")
              .subscribe(toast => {
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
