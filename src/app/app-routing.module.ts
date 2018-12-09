import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadChildren: "./pages/home/home.module#HomePageModule"
  },
  {
    path: "list",
    loadChildren: "./pages/list/list.module#ListPageModule"
  },
  {
    path: "add-task",
    loadChildren: "./pages/add-task/add-task.module#AddTaskPageModule"
  },
  {
    path: "edit-task",
    loadChildren: "./pages/edit-task/edit-task.module#EditTaskPageModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
