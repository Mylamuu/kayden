import { registry, injectable } from "tsyringe";
import { CommandToken } from "../interfaces/command";

export function Command() {
  return function (target: any) {
    injectable()(target);
    registry([{ token: CommandToken, useClass: target }])(target);
  };
}