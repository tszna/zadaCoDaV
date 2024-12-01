import { Routes } from '@angular/router';
import { StudentComponent } from './app/components/student/student.component';
import { TeacherComponent } from './app/components/teacher/teacher.component';
import { AuthGuard } from './app/utils/AuthGuard';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';

export const routes: Routes = [
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_TEACHER', 'ROLE_STUDENT'] },
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_TEACHER'] },
  },
  { path: 'not-authorized', component: NotAuthorizedComponent }
];
