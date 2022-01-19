import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StubComponent} from './components/stub/stub.component';

const routes: Routes = [
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
