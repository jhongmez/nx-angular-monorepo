import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from './models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  movies = signal<Movie[]>([]);
  trendingMovies = signal<Movie[]>([]);
  selectedMovie = signal<Movie | null>(null);

  private readonly _apiKey = environment.apiKey;
  private readonly _apiUrl = environment.apiUrl;
  // private readonly _searchTerm = signal<string>('');
  private readonly _http = inject(HttpClient);

  constructor() {
    this._getMovies();
  }

  getMovieById(movieId: string): Observable<MovieResponse | null> {
    return this._http
      .get<MovieResponse>(
        `${this._apiUrl}/movie/${movieId}?api_key=${this._apiKey}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching movie', error);
          return of(null);
        })
      );
  }

  private _getMovies(): void {
    this._http
      .get<MovieResponse>(
        `${this._apiUrl}/movie/popular?api_key=${this._apiKey}`
      )
      .pipe(
        tap((response) => this.movies.set(response.results)),
        catchError((error) => {
          console.error('Error fetching movies', error);
          return of([]);
        })
      )
      .subscribe();
  }
}
