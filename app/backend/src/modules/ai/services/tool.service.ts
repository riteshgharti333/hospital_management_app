// src/modules/ai/services/tool.service.ts

import { Intent } from './intent.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ToolService {
  
  async execute(intent: Intent): Promise<any> {
    
    switch (intent.intent) {
      case 'GET_TOTAL_ADMISSIONS':
        return await this.getTotalAdmissions(intent.filters);
      
      case 'GET_ADMISSIONS_BY_GENDER':
        return await this.getAdmissionsByGender(intent.filters);
      
      case 'GET_ADMISSIONS_BY_DOCTOR':
        return await this.getAdmissionsByDoctor(intent.filters);
      
      case 'GET_ACTIVE_ADMISSIONS':
        return await this.getActiveAdmissions(intent.filters);
      
      case 'GET_DISCHARGED_TODAY':
        return await this.getDischargedToday(intent.filters);
      
      case 'COMPARE_ADMISSIONS':
        return await this.compareAdmissions(intent.filters);
      
      default:
        return { 
          error: 'Cannot process this query yet',
          total: 0
        };
    }
  }
  
  // Get total admissions
  private async getTotalAdmissions(filters: any): Promise<any> {
    try {
      const { startDate, endDate } = this.getDateRange(filters.date);
      
      // 🔥 PRISMA QUERY
      const count = await prisma.admission.count({
        where: {
          admissionDate: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      console.log(`📊 Total admissions (${filters.date}): ${count}`);
      
      return {
        total: count,
        date: filters.date,
        period: {
          start: startDate,
          end: endDate
        }
      };
    } catch (error) {
      console.error('❌ Error fetching admissions:', error);
      return {
        total: 0,
        date: filters.date,
        error: 'Database query failed'
      };
    }
  }
  
  // Get admissions by gender
  private async getAdmissionsByGender(filters: any): Promise<any> {
    try {
      const { startDate, endDate } = this.getDateRange(filters.date);
      
      // 🔥 PRISMA QUERY with gender filter
      const count = await prisma.admission.count({
        where: {
          admissionDate: {
            gte: startDate,
            lte: endDate
          },
          patient: {
            gender: filters.gender === 'male' ? 'Male' : 'Female'
          }
        }
      });
      
      console.log(`📊 ${filters.gender} admissions (${filters.date}): ${count}`);
      
      return {
        total: count,
        gender: filters.gender,
        date: filters.date
      };
    } catch (error) {
      console.error('❌ Error fetching gender admissions:', error);
      return { total: 0, gender: filters.gender, date: filters.date };
    }
  }
  
  // Get admissions by doctor
  private async getAdmissionsByDoctor(filters: any): Promise<any> {
    try {
      const { startDate, endDate } = this.getDateRange(filters.date);
      
      // 🔥 PRISMA QUERY - First find doctor
      const doctor = await prisma.doctor.findFirst({
        where: {
          fullName: {
            contains: filters.doctorName,
            mode: 'insensitive' // Case insensitive search
          }
        }
      });
      
      if (!doctor) {
        return { 
          total: 0, 
          doctor: filters.doctorName, 
          message: 'Doctor not found' 
        };
      }
      
      // Count admissions for this doctor
      const count = await prisma.admission.count({
        where: {
          admissionDate: {
            gte: startDate,
            lte: endDate
          },
          doctorId: doctor.id
        }
      });
      
      console.log(`📊 Dr. ${doctor.fullName} admissions: ${count}`);
      
      return {
        total: count,
        doctor: doctor.fullName,
        date: filters.date
      };
    } catch (error) {
      console.error('❌ Error fetching doctor admissions:', error);
      return { total: 0, doctor: filters.doctorName, date: filters.date };
    }
  }
  
  // Get active admissions (not discharged)
  private async getActiveAdmissions(filters: any): Promise<any> {
    try {
      // 🔥 PRISMA QUERY - where dischargeDate is null
      const count = await prisma.admission.count({
        where: {
          dischargeDate: null
        }
      });
      
      console.log(`📊 Active admissions: ${count}`);
      
      return {
        total: count,
        status: 'active'
      };
    } catch (error) {
      console.error('❌ Error fetching active admissions:', error);
      return { total: 0, status: 'active' };
    }
  }
  
  // Get discharged today
  private async getDischargedToday(filters: any): Promise<any> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      // 🔥 PRISMA QUERY - discharged today
      const count = await prisma.admission.count({
        where: {
          dischargeDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      
      console.log(`📊 Discharged today: ${count}`);
      
      return {
        total: count,
        date: 'today',
        status: 'discharged'
      };
    } catch (error) {
      console.error('❌ Error fetching discharges:', error);
      return { total: 0, date: 'today', status: 'discharged' };
    }
  }
  
  // Compare today vs yesterday
  private async compareAdmissions(filters: any): Promise<any> {
    try {
      // Today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      // Yesterday
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      const yesterdayEnd = new Date(todayEnd);
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
      
      // 🔥 PRISMA QUERIES
      const todayCount = await prisma.admission.count({
        where: {
          admissionDate: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      });
      
      const yesterdayCount = await prisma.admission.count({
        where: {
          admissionDate: {
            gte: yesterdayStart,
            lte: yesterdayEnd
          }
        }
      });
      
      const difference = todayCount - yesterdayCount;
      const percentChange = yesterdayCount === 0 ? 0 : 
        ((difference / yesterdayCount) * 100).toFixed(1);
      
      console.log(`📊 Today: ${todayCount}, Yesterday: ${yesterdayCount}`);
      
      return {
        today: todayCount,
        yesterday: yesterdayCount,
        difference: difference,
        percentChange: percentChange,
        trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'same'
      };
    } catch (error) {
      console.error('❌ Error comparing admissions:', error);
      return { today: 0, yesterday: 0, difference: 0 };
    }
  }
  
  // Get detailed admission list (for showing actual data)
  async getAdmissionDetails(filters: any): Promise<any> {
    try {
      const { startDate, endDate } = this.getDateRange(filters.date);
      
      // 🔥 PRISMA QUERY with relations
      const admissions = await prisma.admission.findMany({
        where: {
          admissionDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              gender: true,
              mobileNumber: true
            }
          },
          doctor: {
            select: {
              id: true,
              fullName: true
            }
          }
        },
        orderBy: {
          admissionDate: 'desc'
        }
      });
      
      return {
        total: admissions.length,
        admissions: admissions,
        date: filters.date
      };
    } catch (error) {
      console.error('❌ Error fetching admission details:', error);
      return { total: 0, admissions: [] };
    }
  }
  
  // Helper: Get date range
  private getDateRange(dateType: string): { startDate: Date, endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();
    
    switch (dateType) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
        
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.setHours(0, 0, 0, 0));
        endDate = new Date(yesterday.setHours(23, 59, 59, 999));
        break;
        
      case 'this_week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay()); // Sunday
        startDate.setHours(0, 0, 0, 0);
        break;
        
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
        
      case 'last_week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    }
    
    return { startDate, endDate };
  }
}