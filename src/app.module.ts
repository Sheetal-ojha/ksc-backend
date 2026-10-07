import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';



import { Feedback } from './feedback/feedback.entity';
import { Result } from './result/result.entity';
import { ExamSchedule } from './exam-schedule/exam-schedule.entity';
import { Notification } from './notification/notification.entity';
import { FeedbackModule } from './feedback/feedback.module';
import { ResultModule } from './result/result.module';
import { ExamScheduleModule } from './exam-schedule/exam-schedule.module';
import { NotificationModule } from './notification/notification.module';










import { Subject } from './subject/subject.entity';
import { ClassSubject } from './class-subject/class-subject.entity';
import { StudentSubject } from './student-subject/student-subject.entity';
import { StudentEnrollment } from './student-enrollment/student-enrollment.entity';
import { Attendance } from './attendance/attendance.entity';
import { ClassSubjectModule } from './class-subject/class-subject.module';
import { SubjectModule } from './subject/subject.module';
import { StudentSubjectModule } from './student-subject/student-subject.module';
import { TeacherAssignmentModule } from './teacher-assignment/teacher-assignment.module';
import { HomeworkModule } from './homework/homework.module';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentEnrollmentModule } from './student-enrollment/student-enrollment.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard'; 
import { RolesGuard } from './auth/role.guard';
import { DepartmentModule } from './department/department.module';
import { Homework } from './homework/homework.entity';
import { Department } from './department/department.entity';
import { Class } from './department/class.entity';
import { UserEntity} from './auth/users/user.entity';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './auth/users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault} from '@apollo/server/plugin/landingPage/default';
import { TeacherAssignment } from './teacher-assignment/teacher-assignment.entity';
import { HomeworkSubmission } from './homework/homework-submission.entity';
import { PreRegistered } from './auth/pre-registered/pre-registered.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities:[UserEntity, Homework, Department, Class, Subject, ClassSubject, StudentSubject, StudentEnrollment, TeacherAssignment, HomeworkSubmission, Attendance, PreRegistered,Feedback,Result,ExamSchedule,Notification],
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      sortSchema: true,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground:false,
    }),

    UserModule,
    AuthModule,
    DepartmentModule,
    SubjectModule, ClassSubjectModule,
     StudentSubjectModule, 
     TeacherAssignmentModule,
      HomeworkModule,
       AttendanceModule, 
    StudentEnrollmentModule,
    FeedbackModule,
    ResultModule,
    ExamScheduleModule,
    NotificationModule
  ],

  providers: [
    AppResolver,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}