import { PartialType } from '@nestjs/swagger';
import { CreatePosDto } from './create-pos.dto.js';

export class UpdatePosDto extends PartialType(CreatePosDto) {}
