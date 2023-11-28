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
    const serviceSlots = Math.max(
      1,
      Math.ceil(service.duration / slotDuration),
    );

    const freeCurrentServiceSlots = [];
    const fs = freeSlots.map((slot) => slot.slotNumber);

    const arrayRange = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step,
      );
    const isInRange = (arr, arr2) => arr.every((i) => arr2.includes(i));

    freeSlots.forEach((slot) => {
      const start = slot.slotNumber;
      const stop = start + serviceSlots - 1;
      const range: number[] = arrayRange(start, stop, 1);

      if (isInRange(range, fs)) {
        freeCurrentServiceSlots.push(slot);
      }
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
    const { shop, dates } = schedule;
    const shifts = await this.shiftService.getShiftsByShop(shop.id);

    const slots = [];
    dates.forEach((item) => {
      const date = item.date;
      item.shifts.forEach((shift) => {
        const employee = shift.employee;
        const currentShift = shifts.find((s) => s.id === shift.shift.id);
        currentShift.slots.forEach((slot, index) => {
          slots.push({
            slot,
            shop,
            date,
            employee,
            slotNumber: index + 1,
          });
        });
      });
    });
    return await this.repo.save(slots);
  }

  async bookFreeSlots(id: number, serviceSlots: number) {
    const ids = Array.from({ length: serviceSlots }, (_, i) => id + i);

    const slots = await this.repo
      .createQueryBuilder('app')
      .where('app.id IN (:...ids)', { ids })
      .andWhere('app.status = :status', {
        status: AppointementStatus.AVAILABLE,
      })
      .getMany();

    if (slots.length >= serviceSlots) {
      return await this.repo
        .createQueryBuilder()
        .update(AppointmentEntity)
        .set({ status: AppointementStatus.BOOKED })
        .where({ id: In(ids) })
        .execute();
    }
  }
}
