import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject } from '@angular/core';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  imports: [CommonModule],
  templateUrl: './movies.html',
})
export class Movies {
  isLoading = computed(() => this._moviesService.isLoading());
  hasMorePages = computed(() => this._moviesService.hasMorePages());

  private readonly _moviesService = inject(MoviesService);
  readonly movies = this._moviesService.movies;

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isLoading() || !this.hasMorePages()) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const scrollThrehold = document.documentElement.scrollHeight;

    if (scrollPosition >= scrollThrehold) this._moviesService.getMovies();
  }
}
