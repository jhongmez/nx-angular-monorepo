import { Route } from '@angular/router';

const moviesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./movies').then((m) => m.Movies),
  },
  {
    path: ':movieId',
    loadComponent: () =>
      import('./movie-details/movie-details').then((m) => m.MovieDetails),
  },
];

export { moviesRoutes };
