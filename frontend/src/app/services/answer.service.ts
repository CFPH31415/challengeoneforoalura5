import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer } from '../interfaces/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private apiUrl = 'http://localhost:8080/answers';

  constructor(private http: HttpClient) { }


    private getHeaders() {
      const authToken = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });
      return { headers: headers };
    }

    getTopicAnswers(topicId: number): Observable<Answer[]> {
      const headers = this.getHeaders();
      return this.http.get<Answer[]>(`${this.apiUrl}/topic/${topicId}`, headers);
    }
  
    createAnswer(newAnswer: Answer): Observable<Answer> {
      const headers = this.getHeaders();
      return this.http.post<Answer>(`${this.apiUrl}`, newAnswer, headers);
    }
  
    deleteAnswer(answerId: number): Observable<void> {
      const headers = this.getHeaders();
      return this.http.delete<void>(`${this.apiUrl}/${answerId}`, headers);
    }
  
  
}
