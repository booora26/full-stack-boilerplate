import { Controller } from '@nestjs/common';
import { CrudService } from './crud.service';

@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}
}
