import { NgModule } from "@angular/core"
import { CreatePostComponent } from './create-post/create-post.component';
import { PostListComponent } from './post-list/post-list.component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations:[
    PostListComponent,
    CreatePostComponent
  ],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class PostsModule {

}
