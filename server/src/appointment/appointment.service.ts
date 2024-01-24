import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { AppointmentEntity } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShiftsService } from '../shifts/shifts.service';
import { ServicesService } from '../services/services.service';
import { AppointementStatus } from './appointement-status.enum';
import { UserEntity } from '../users/entities/user.entity';
import { ServiceEntity } from '../services/service.entity';
import { ShopService } from '../shop/shop.service';
import { AuthService } from '../auth/auth.service';
import { fr } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppointmentService extends CrudService<AppointmentEntity> {
  constructor(
    @InjectRepository(AppointmentEntity)
    protected repo: Repository<AppointmentEntity>,
    protected eventEmmiter: EventEmitter2,
    private shiftService: ShiftsService,
    private shopService: ShopService,
    private servicesService: ServicesService,
    private readonly configService: ConfigService,
  ) {
    super(repo, eventEmmiter);
  }

  serverURL =
    this.configService.get('NODE_ENV') === 'DEVELOPMENT'
      ? this.configService.get('SERVER_LOCAL_URL')
      : this.configService.get('SERVER_WEB_URL');
  /**
   * Generates an array of numbers within a specified range.
   *
   * @param start The starting number of the range.
   * @param stop The ending number of the range.
   * @param step The increment value between each number in the range.
   * @returns An array of numbers within the specified range.
   */
  arrayRange = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, index) => start + index * step,
    );

  isInRange = (arr, set) => arr.every((i) => set.has(i));

  /**
   * Retrieves the free slots for a specific employee at a given shop on a particular date,
   * filtered by the availability status and the duration of the requested service.
   * @param shopId - The ID of the shop.
   * @param employeeId - The ID of the employee.
   * @param date - The date for which the free slots are requested.
   * @param serviceId - The ID of the requested service.
   * @returns An object containing the free slots that can accommodate the requested service
   * and the number of slots required for the service.
   */
  async freeSlotsByEmployee(shopId, employeeId, date, serviceId, query) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id', 'app.slotNumber'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.employeeId = :employeeId', { employeeId })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', {
        status: AppointementStatus.AVAILABLE,
      })
      .getMany();

    const [shop, service] = await Promise.all([
      this.shopService.findOne(shopId, query),
      this.servicesService.findOne(serviceId, query),
    ]);

    const slotDuration = shop.slotDuration;
    const serviceSlots = Math.max(
      1,
      Math.ceil(service.duration / slotDuration),
    );

    const fs = new Set(freeSlots.map((slot) => slot.slotNumber));

    const freeCurrentServiceSlots = freeSlots.filter((slot) => {
      const start = slot.slotNumber;
      const stop = start + serviceSlots - 1;
      for (let i = start; i <= stop; i++) {
        if (!fs.has(i)) {
          return false;
        }
      }
      return true;
    });

    freeCurrentServiceSlots.map((slot) => {
      slot.uri = `${this.serverURL}/appointment/bookV2?id=${slot.id}&serviceSlots=${serviceSlots}&serviceId=${serviceId}`;
      slot.method = 'PATCH';
    });

    return { freeCurrentServiceSlots, serviceSlots };
  }
  /**
   * Retrieves the free slots by time for a given shop, slot, and date.
   * @param {number} shopId - The ID of the shop.
   * @param {string} slot - The slot value.
   * @param {Date} date - The date value.
   * @returns {Promise<Appointment[]>} - A promise that resolves to an array of free slots.
   */
  async getAvailableSlotsByTime(shopId, timeSlot, selectedDate) {
    const availableSlots = await this.repo
      .createQueryBuilder('appointment')
      .select([
        'appointment.slot',
        'appointment.id',
        'appointment.employeeId',
        'appointment.slotNumber',
      ])
      .where({
        shopId: shopId,
        slot: timeSlot,
        date: selectedDate,
        status: AppointementStatus.AVAILABLE,
      })
      .getMany();

    return availableSlots;
  }

  /**
   * Retrieves the booked slots for a specific employee on a selected date.
   * @param shopId - The ID of the shop.
   * @param employeeId - The ID of the employee.
   * @param selectedDate - The selected date.
   * @returns A Promise that resolves to an array of booked slots.
   */
  async getBookedSlotsByEmployee(shopId, employeeId, selectedDate) {
    const bookedSlots = await this.repo
      .createQueryBuilder('appointment')
      .select(['appointment.slot', 'appointment.id', 'appointment.slotNumber'])
      .where({
        shopId: shopId,
        employeeId: employeeId,
        date: selectedDate,
        status: AppointementStatus.BOOKED,
      })
      .getMany();

    return bookedSlots;
  }

  /**
   * Generates appointment slots based on the provided schedule data.
   * @param scheduleData - The schedule data containing shop and dates information.
   * @returns A promise that resolves to the saved appointment slots.
   */
  async generateAllSlots(scheduleData) {
    const { shopId, dates: scheduleDates } = scheduleData;
    const shopShifts = await this.shiftService.getShiftsByShop(shopId);

    const appointmentSlots = scheduleDates.flatMap((scheduleDateItem) => {
      const appointmentDate = scheduleDateItem.date;
      return scheduleDateItem.shifts.flatMap((shiftDetail) => {
        const assignedEmployee = shiftDetail.employee;
        const matchingShift = shopShifts.find(
          (shopShift) => shopShift.id === shiftDetail.shift.id,
        );
        return matchingShift.slots.map((timeSlot, index) => ({
          slot: timeSlot,
          shopId: shopId,
          date: appointmentDate,
          employee: assignedEmployee,
          slotNumber: index + 1,
        }));
      });
    });

    return await this.repo.save(appointmentSlots);
  }

  /**
   * Books the specified number of free slots for an appointment.
   *
   * @param id - The starting ID of the slots to book.
   * @param serviceSlots - The number of slots to book.
   * @param user - The user entity associated with the appointment.
   * @param service - The service entity associated with the appointment.
   * @returns The updated appointment entities if the booking was successful, otherwise undefined.
   */
  async bookFreeSlots(
    id: number,
    serviceSlots: number,
    user: UserEntity,
    service: ServiceEntity,
  ) {
    const ids = Array.from({ length: serviceSlots }, (_, i) => id + i);

    const updateResult = await this.repo
      .createQueryBuilder()
      .update(AppointmentEntity)
      .set({ status: AppointementStatus.BOOKED, user, service })
      .where({
        id: In(ids),
        status: AppointementStatus.AVAILABLE,
      })
      .returning('*')
      .execute();

    if (updateResult.affected >= serviceSlots) {
      return updateResult.raw;
    }
  }
}
