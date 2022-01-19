import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StubRoutingModule } from './stub-routing.module';
import { StubComponent } from './components/stub/stub.component';


@NgModule({
  declarations: [
    StubComponent
  ],
  imports: [
    CommonModule,
    StubRoutingModule
  ]
})
export class StubModule { }
