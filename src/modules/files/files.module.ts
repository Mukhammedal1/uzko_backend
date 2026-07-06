import { FilesEntity } from "@infrastructure";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { FilesRepository } from "./files.repository";

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity])],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
  exports: [FilesService, FilesRepository],
})
export class FilesModule {}
