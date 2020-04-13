import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import {Post} from '../post.model'
import { FormGroup, FormControl ,Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import  {MimeType} from './mime-type.validator';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})


export class CreatePostComponent implements OnInit {

  private mode = 'create';
  private postId:string;
  public post:Post;
  form: FormGroup;
  isLoading=false;
  imagePreview:string;
  constructor(private postsService:PostsService,private route:ActivatedRoute) { }


  ngOnInit(): void {
    this.form=new FormGroup({
      title:new FormControl(null,{
        validators: [Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{
        validators: [Validators.required,Validators.minLength(3)]}),
      image:new FormControl(null,{
        validators: [Validators.required],asyncValidators:[MimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId).subscribe((postData)=>{
          console.log(postData);
          this.isLoading=false;
          this.post={
            id:postData._id,
            title:postData.title,
            content:postData.content,
            imagePath:postData.imagePath,
            creator:postData.userId
          };
          this.imagePreview=postData.imagePath;
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image: this.post.imagePath
          });
        });

      }
      else{
        this.mode='create';
        this.postId=null;
      }
    });
  }


  onImagePicked(event: Event){
    console.log('is it coming here');
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();

    reader.onload = () =>{
      this.imagePreview=(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode==='create')
    this.postsService.addPosts(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image);
    else
    {
      console.log("lets see the updated values");
      console.log(this.post);
      this.postsService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
