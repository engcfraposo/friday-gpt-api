import { ApiProperty } from '@nestjs/swagger';

export class FileChatDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
