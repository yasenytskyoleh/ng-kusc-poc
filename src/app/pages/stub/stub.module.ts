import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StubRoutingModule } from './stub-routing.module';
import { StubComponent } from './components/stub/stub.component';
import { StubItemComponent } from './components/stub-item/stub-item.component';
import {StubService} from './services/stub.service';


@NgModule({
  declarations: [
    StubComponent,
    StubItemComponent
  ],
  imports: [
    CommonModule,
    StubRoutingModule
  ],
  providers: [
    StubService
  ],
})
export class StubModule { }
