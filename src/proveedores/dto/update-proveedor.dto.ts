import { PartialType } from '@nestjs/swagger';
import { CreateProveedorDto } from './create-proveedor.dto.js';

export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}
