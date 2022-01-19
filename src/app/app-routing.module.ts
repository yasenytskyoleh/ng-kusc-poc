import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WrapperComponent} from '@shared/modules/wrapper';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/stub/stub.module').then(m => m.StubModule)
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
