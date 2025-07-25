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
  currentPage = signal<number>(1);
  hasMorePages = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private readonly _apiKey = environment.apiKey;
  private readonly _apiUrl = environment.apiUrl;
  // private readonly _searchTerm = signal<string>('');
  private readonly _http = inject(HttpClient);

  constructor() {
    this.getMovies();
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

  getMovies(): void {
    this._http
      .get<MovieResponse>(
        `${this._apiUrl}/movie/popular?api_key=${this._apiKey}`
      )
      .pipe(
        tap((response) => {
          const currentMovies = this.movies();
          // Aca se le agrega un nuevo array con los resultados de la respuesta
          // y se le agrega al array actual
          this.movies.set([...currentMovies, ...response.results]);
          this.hasMorePages.set(response.page < response.total_pages);
          // Usamos el update para que nos devuelva el valor actual y no el valor anterior
          this.currentPage.update((currentPage) => currentPage + 1);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          console.error('Error fetching movies', error);
          return of([]);
        })
      )
      .subscribe();
  }
}
