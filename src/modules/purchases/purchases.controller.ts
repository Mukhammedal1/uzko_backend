// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import { PurchasesService } from './purchases.service';
// import { CreatePurchaseDto } from './dto/create-purchase.dto';
// import { UpdatePurchaseDto } from './dto/update-purchase.dto';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { BusinessId, JwtAuthGuard, UserId } from '@common';

// @ApiTags('Purchases')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @Controller({ version: '1', path: 'purchases' })
// export class PurchasesController {
//   constructor(private readonly purchasesService: PurchasesService) {}

//   @Post()
//   create(
//     @Body() createPurchaseDto: CreatePurchaseDto,
//     @BusinessId() business_id: number,
//     @UserId() user_id: number,
//   ) {
//     return this.purchasesService.create(
//       createPurchaseDto,
//       +business_id,
//       +user_id,
//     );
//   }

//   @Get()
//   findAll(@BusinessId() business_id: number) {
//     return this.purchasesService.findAll(+business_id);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string, @BusinessId() business_id: number) {
//     return this.purchasesService.findOne(+id, +business_id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updatePurchaseDto: UpdatePurchaseDto,
//     @BusinessId() business_id: number,
//     @UserId() user_id: number,
//   ) {
//     return this.purchasesService.update(
//       +id,
//       updatePurchaseDto,
//       +business_id,
//       +user_id,
//     );
//   }

//   @Delete(':id')
//   remove(
//     @Param('id') id: string,
//     @BusinessId() business_id: number,
//     @UserId() user_id: number,
//   ) {
//     return this.purchasesService.remove(+id, +business_id, +user_id);
//   }
// }
