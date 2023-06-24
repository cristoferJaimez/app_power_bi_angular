import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportModalService {
  private post: any;
  private postSubject: Subject<any> = new Subject<any>(); // Nuevo subject para emitir actualizaciones del post

  constructor() {}

  setPost(post: any) {
    this.post = post;
    this.postSubject.next(post); // Emite los nuevos datos del post
  }

  getPost() {
    return this.post;
  }

  getPostSubject() {
    return this.postSubject.asObservable(); // Devuelve el observable del postSubject
  }
}
