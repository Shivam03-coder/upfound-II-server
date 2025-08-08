import { ValidationError } from "./error.utils";

export class GlobalUtils {
  static validateEnum(
    fieldName: string,
    value: string,
    enumType: Record<string, unknown>
  ): void {
    if (!Object.values(enumType).includes(value)) {
      throw new ValidationError(`Invalid ${fieldName} value`);
    }
  }
}
