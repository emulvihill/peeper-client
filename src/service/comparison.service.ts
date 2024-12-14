import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {VideoSnap} from "../models/graphql-models";

@Injectable({
  providedIn: "root",
})
export class ComparisonService {
  private apiUrl = "http://localhost:5000/graphql"; // Replace with your actual GraphQL API URL

  constructor(private http: HttpClient) {
  }

  compareVideoSnaps(first: VideoSnap, second: VideoSnap): Observable<String> {
    const query = `
      query CompareVideoSnapsById($id1: ID!, $id2: ID!) {
        compareVideoSnapsById(id1: $id1, id2: $id2)
      }
    `;

    return this.http.post(this.apiUrl, {
      query,
      variables: {id1: first.id, id2: second.id},
    }).pipe(map((res: any) => res.data.compareVideoSnapsById)) as Observable<String>;
  }
}
