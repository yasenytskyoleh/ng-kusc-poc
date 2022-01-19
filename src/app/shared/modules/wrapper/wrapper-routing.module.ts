import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WrapperComponent} from './components/wrapper/wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrapperRoutingModule {
}
