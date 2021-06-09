import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})



export class PostsService {
  error = new Subject<string>();

constructor (private http: HttpClient){}

  createAndStorePost(title: string, content: string){

    const postData: Post = {title: title, content: content};

     this.http
    .post<{name: string}>('https://jana1-1498a-default-rtdb.firebaseio.com/posts.json',
    postData,
    {
      observe: 'response'
    }
    )
    .subscribe
      (responseData  => {
        console.log(responseData)
      });

  }
  fetchPosts(){
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http.
    get<{[key: string]: Post}>('https://jana1-1498a-default-rtdb.firebaseio.com/posts.json',
    {
      headers: new HttpHeaders({'Custom-header': 'Hello'}),
      params: searchParams,
      responseType: 'json'
    })
    .pipe(map((responseData: {[key: string]: Post})=> {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key})
        }
      }
    return (postsArray);
    }),
    catchError(errorRes => {
      //generic - send to analytics server
     return throwError(errorRes);
    })
    );
  }
  deletePosts(){
    return this.http.delete('https://jana1-1498a-default-rtdb.firebaseio.com/posts.json',
    {
      observe: 'events',
      responseType: 'text'
    }
    ).pipe(tap(event =>{
        console.log(event);
        if (event.type === HttpEventType.Sent){
          //...
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
    })
    );
  }
}
