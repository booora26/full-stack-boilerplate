import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { AppointmentEntity } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShiftsService } from '../shifts/shifts.service';
import { ServicesService } from '../services/services.service';
import { AppointementStatus } from './appointement-status.enum';

@Injectable()
export class AppointmentService extends CrudService<AppointmentEntity> {
  constructor(
    @InjectRepository(AppointmentEntity)
    protected repo: Repository<AppointmentEntity>,
    protected eventEmmiter: EventEmitter2,
    private shiftService: ShiftsService,
    private servicesService: ServicesService,
  ) {
    super(repo, eventEmmiter);
  }

  async freeSlotsByEmployee(shopId, employeeId, date, serviceId) {
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

    const slotDuration = 30;
    const service = await this.servicesService.findOne(serviceId);
    let serviceSlots: number;

    service.duration > slotDuration
      ? (serviceSlots = Math.ceil(service.duration / slotDuration))
      : (serviceSlots = 1);

    const freeCurrentServiceSlots = [];

    console.log('free slots', freeSlots);

    const fs = freeSlots.map((slot) => slot.slotNumber);

    freeSlots.map((slot) => {
      const start = slot.slotNumber;
      const stop = start + serviceSlots - 1;
      const arrayRange = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step + 1 },
          (value, index) => start + index * step,
        );
      const range: number[] = arrayRange(start, stop, 1);
      const isInRange = (arr, arr2) => {
        return arr.every((i) => arr2.includes(i));
      };

      isInRange(range, fs) ? freeCurrentServiceSlots.push(slot) : '';
    });

    return { freeCurrentServiceSlots, serviceSlots };
  }
  async freeSlotsByTime(shopId, slot, date) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id', 'app.employeeId', 'app.slotNumber'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.slot = :slot', { slot })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', {
        status: AppointementStatus.AVAILABLE,
      })
      .getMany();

    return freeSlots;
  }
  async bookedSlotsByEmployee(shopId, employeeId, date) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id', 'app.slotNumber'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.employeeId = :employeeId', { employeeId })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', { status: AppointementStatus.BOOKED })
      .getMany();

    return freeSlots;
  }

  async generateAllSlots(schedule) {
    const { shopId, dates } = schedule;
    const shifts = await this.shiftService.getShiftsByShop(shopId);

    const slots = [];
    dates.map((item) => {
      const date = item.date;
      item.shifts.map((shift) => {
        const employeeId = shift.employeeId;
        let i = 0;
        const currentShift = shifts.find((s) => s.id === shift.shiftId);
        currentShift.slots.map((slot) => {
          i++;
          slots.push({ slot, shopId, date, employeeId, slotNumber: i });
        });
      });
    });
    return await this.repo.save(slots);
  }

  async bookFreeSlots(id: number, serviceSlots: number) {
    const ids = [];
    for (let i = 0; i < serviceSlots; i++) {
      ids.push(id + i);
    }
    const slots = await this.repo
      .createQueryBuilder('app')
      .where('app.id IN (:...ids)', { ids })
      .andWhere('app.status = :status', {
        status: AppointementStatus.AVAILABLE,
      })
      .getMany();

    let slotsStatus = true;

    slots.length < serviceSlots ? (slotsStatus = false) : (slotsStatus = true);
    let bookedSlots;
    if (slotsStatus) {
      bookedSlots = await this.repo
        .createQueryBuilder()
        .update(AppointmentEntity)
        .set({ status: AppointementStatus.BOOKED })
        .where({ id: In(ids) })
        .execute();
    }

    return bookedSlots;
  }
}
