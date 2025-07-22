import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Actions } from './actions/actions';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'actions',
        component: Actions
    }
];
