import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor() { 
    super("User");
  }
}
