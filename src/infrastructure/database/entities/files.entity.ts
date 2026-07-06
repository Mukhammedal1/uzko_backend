import { FILE_TYPE } from "@enums";
import { Column, Entity, Index } from "typeorm";
import { AbstractEntity } from "../abstract.entity";

@Entity({ name: "files" })
@Index(["file_type"])
export class FilesEntity extends AbstractEntity {
  @Column({ length: 500 })
  original_name: string;

  @Column({ type: "enum", enum: FILE_TYPE })
  file_type: FILE_TYPE;

  @Column({ type: "bigint", nullable: true })
  size: number;

  @Column({ length: 1000 })
  url: string;

  @Column({ length: 50 })
  extension: string;
}
