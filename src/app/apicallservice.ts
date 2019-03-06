import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor (
    private http: Http
  ) {}

  getUser() {
    return this.http.get(`https://conduit.productionready.io/api/profiles/eric`)
    .pipe(map((res:Response) => res.json()));
  }

}