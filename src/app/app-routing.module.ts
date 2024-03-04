import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  // { path: 'add-vehicle', component: NewCarFormComponent },
  // { path: 'edit-vehicle', component: EditCarComponent },
  // { path: 'audit', component: AuditComponent },
  // { path: 'chart', component: ChartComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
