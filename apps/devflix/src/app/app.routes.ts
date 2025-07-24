import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./features/movies/movies.route').then((m) => m.moviesRoutes),
  },
  {
    path: '**',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
