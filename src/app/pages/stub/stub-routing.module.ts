import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StubComponent} from './components/stub/stub.component';
import {StubItemComponent} from './components/stub-item/stub-item.component';

const routes: Routes = [
  {
    path: ':stationName',
    component: StubItemComponent,
  },
  {
    path: '',
    component: StubComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StubRoutingModule {
}
