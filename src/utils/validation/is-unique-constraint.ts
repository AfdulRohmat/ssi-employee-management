import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { DataSource, EntityManager } from "typeorm";
import { IsUniqueConstraintInput } from "./is-unique";

@ValidatorConstraint({
    name: "isUniqueConstraint", async
        : true
})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) { }
    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const { tableName, column }: IsUniqueConstraintInput = args?.constraints[0];

        const exists = await this.dataSource
            .getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({ [column]: value })
            .getExists();

        return exists ? false : true;
        // return false;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'data sudah ada';
    }

}