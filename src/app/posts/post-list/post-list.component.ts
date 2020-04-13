import { Component, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator'
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  userId: string;
  totalValues = 0;
  currentPage=1;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  public isLoading=false;
  posts:Post[]=[];
  private postsSub:Subscription;
  private authListenersubscription: Subscription;
  userIsAuthenticated = false;
  constructor(private postService: PostsService,private authService: AuthService) {
   }

  ngOnInit(): void {



    this.isLoading=true;

    this.postService.getPosts(this.currentPage,this.postsPerPage);
    this.userIsAuthenticated = this.authService.getIsAuth();
    console.log(this.userIsAuthenticated);
    this.userId = this.authService.getUserId();
    console.log("userId obtained from auuth Service");
    console.log(this.userId);
    this.authListenersubscription = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      console.log("userId obtained from auuth Service");
      console.log(this.userId);
      }
    );
    this.postsSub=this.postService.getPostUpdateListener()
     .subscribe((postsData:{posts:Post[],postCount:number})=>{
      this.posts=postsData.posts;
      this.totalValues=postsData.postCount;
      this.isLoading=false;
    });
    this.authListenersubscription = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
      }
    );
  }
  onDelete(postId:string){
    this.isLoading=true;
    this.postService.deletePost(postId).subscribe(()=>{
      if((this.totalValues-1)%this.postsPerPage==0)
      this.currentPage=this.currentPage-1;
      this.postService.getPosts(this.currentPage,this.postsPerPage);
    })
  }
  onChangedPage(pageData: PageEvent)
  {
    console.log(pageData);
    this.isLoading=true;
    this.currentPage= pageData.pageIndex+1;
    this.postsPerPage= pageData.pageSize;
    this.postService.getPosts(this.currentPage,this.postsPerPage);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authListenersubscription.unsubscribe();
  }

}
