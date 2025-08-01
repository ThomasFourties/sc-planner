import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  // Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { AssignClientDto } from './dto/assign-client.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: { user: { sub: string } }) {
    return this.usersService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/:clientId')
  async findByClientId(@Param('clientId') clientId: string) {
    return this.usersService.findByClientId(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id/assign-client')
  // async assignClient(
  //   @Param('id') id: string,
  //   @Body() assignClientDto: AssignClientDto,
  // ) {
  //   return this.usersService.assignClient(id, assignClientDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id/unassign-client')
  // async unassignClient(@Param('id') id: string) {
  //   return this.usersService.unassignClient(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
