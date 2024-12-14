import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {VideoSnap} from "../models/graphql-models";

@Injectable({
  providedIn: "root",
})
export class VideoSnapService {
  private apiUrl = "http://localhost:5000/graphql"; // Replace with your actual GraphQL API URL

  constructor(private http: HttpClient) {
  }

  createVideoSnap(feedId: string, data: string): Observable<VideoSnap> {
    const query = `
      mutation CreateVideoSnap($feedId: ID!, $data: String!) {
        createVideoSnap(input: {feedId: $feedId, data: $data}) {
          id
          date
          data
        }
      }
    `;

    return this.http.post(this.apiUrl, {
      query,
      variables: {feedId, data},
    }).pipe(map((res: any) => res.data.createVideoSnap)) as Observable<VideoSnap>;
  }
}
