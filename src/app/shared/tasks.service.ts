import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id?: string
  title: string
  date?: string
}

export interface CreateResponse {
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url = 'https://ngapporganizer-default-rtdb.firebaseio.com/tasks'; //в конце пути к базе указать поле tasks
  
  constructor(private http: HttpClient) { }

  fetch(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
    .pipe(map(tasks => {
      if (!tasks) {
        return [];
      }
      const resTasks: Task[] = [];
      for (let key in tasks) { 
        resTasks.push({...tasks[key], id: key});  
      }
      return resTasks;
    }))
  }

  create(task: Task): Observable<Task> {
    console.log('New task', task);  
    return this.http
    .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
    .pipe(map(res => {
      return {...task, id: res.name};
    }));
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }
}
