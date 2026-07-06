import { uploadInterceptorOptions } from "@configs";
import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FilesService } from "./files.service";

@ApiTags("Files")
@Controller({ path: "files", version: "1" })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file", uploadInterceptorOptions))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.uploadSingle(file);
  }

  @Post("upload/bulk")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["files"],
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("files", 10, uploadInterceptorOptions))
  async uploadBulk(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.filesService.uploadBulk(files);
  }

  @Get("serve/:id")
  async serve(
    @Param("id") id: string,
    @Headers("range") range: string,
    @Res() res: Response
  ) {
    await this.filesService.readStream(+id, range, res);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.filesService.findOne(+id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.filesService.remove(+id);
  }
}
