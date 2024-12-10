import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideoSnapService {
  private apiUrl = 'http://localhost:5000/graphql'; // Replace with your actual GraphQL API URL

  constructor(private http: HttpClient) {}

  createVideoSnap(feedId: string, data: string): Observable<any> {
    const query = `
      mutation CreateVideoSnap($feedId: ID!, $data: String!) {
        createVideoSnap(input: {feedId: $feedId, data: $data}) {
          id
          date
        }
      }
    `;

    return this.http.post(this.apiUrl, { query, variables: { feedId, data } });
  }
}
