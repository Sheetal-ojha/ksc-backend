import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { HomeworkSubmission } from '../homework/homework-submission.entity';
import { Feedback } from '../feedback/feedback.entity';
import { Homework } from '../homework/homework.entity';
import { StudentEnrollment } from '../student-enrollment/student-enrollment.entity';

export interface StudentScore {
  studentId: string;
  username: string;
  studentPreRegId: string;
  attendanceScore: number;
  homeworkScore: number;
  feedbackScore: number;
  totalScore: number;
}

@Injectable()
export class BestStudentService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(HomeworkSubmission)
    private submissionRepo: Repository<HomeworkSubmission>,
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
    @InjectRepository(Homework)
    private homeworkRepo: Repository<Homework>,
    @InjectRepository(StudentEnrollment)
    private enrollmentRepo: Repository<StudentEnrollment>,
  ) {}

  async getBestStudent(classId: string, subjectId: string, month: number, year: number): Promise<StudentScore | null> {
    // Date range for the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0);
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    // Get all students enrolled in this class
    const enrollments = await this.enrollmentRepo.find({
      where: { class: { id: classId } as any },
      relations: ['student'],
    });

    if (!enrollments.length) return null;

    // Get all homeworks for this class+subject in this month
    const homeworks = await this.homeworkRepo.find({
      where: { class: { id: classId } as any, subject: { id: subjectId } as any },
    });
    const totalHomeworks = homeworks.length;
    const homeworkIds = homeworks.map(h => h.id);

    const scores: StudentScore[] = [];

    for (const enrollment of enrollments) {
      if (!enrollment.student) continue;
      const student = enrollment.student as any;
      const stuId = student.id;

      // 1. ATTENDANCE SCORE (40%)
      const allAttendance = await this.attendanceRepo.find({
        where: {
          student: { id: stuId } as any,
          subject: { id: subjectId } as any,
          class: { id: classId } as any,
        },
      });
      const monthAttendance = allAttendance.filter(a => {
        const d = a.date;
        return d >= startDate && d <= endDateStr;
      });
      const totalMarked = monthAttendance.length;
      const presentCount = monthAttendance.filter(a => a.status === 'present').length;
      const attendanceScore = totalMarked > 0 ? (presentCount / totalMarked) * 100 * 0.40 : 0;

      // 2. HOMEWORK SCORE (35%)
      let submittedCount = 0;
      if (homeworkIds.length > 0) {
        for (const hwId of homeworkIds) {
          const sub = await this.submissionRepo.findOne({
            where: { student: { id: stuId } as any, homework: { id: hwId } as any },
          });
          if (sub) submittedCount++;
        }
      }
      const homeworkScore = totalHomeworks > 0 ? (submittedCount / totalHomeworks) * 100 * 0.35 : 0;

      // 3. FEEDBACK SCORE (25%)
      const ratingMap: Record<string, number> = {
        excellent: 1.0,
        best: 0.85,
        good: 0.70,
        need_modify: 0.40,
        try_again: 0.20,
      };
      let feedbackTotal = 0;
      let feedbackCount = 0;
      for (const hwId of homeworkIds) {
        const sub = await this.submissionRepo.findOne({
          where: { student: { id: stuId } as any, homework: { id: hwId } as any },
        });
        if (sub) {
          const fb = await this.feedbackRepo.findOne({
            where: { submission: { id: sub.id } as any },
          });
          if (fb) {
            feedbackTotal += ratingMap[fb.rating] || 0;
            feedbackCount++;
          }
        }
      }
      const avgFeedback = feedbackCount > 0 ? feedbackTotal / feedbackCount : 0;
      const feedbackScore = avgFeedback * 100 * 0.25;

      const totalScore = Math.round(attendanceScore + homeworkScore + feedbackScore);

      scores.push({
        studentId: stuId,
        username: student.username || '',
        studentPreRegId: student.studentId || '',
        attendanceScore: Math.round(attendanceScore),
        homeworkScore: Math.round(homeworkScore),
        feedbackScore: Math.round(feedbackScore),
        totalScore,
      });
    }

    if (!scores.length) return null;
    scores.sort((a, b) => b.totalScore - a.totalScore);
    return scores[0];
  }
}