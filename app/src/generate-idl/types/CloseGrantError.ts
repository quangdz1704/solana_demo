import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InternalErrorJSON {
  kind: "InternalError"
}

export class InternalError {
  static readonly discriminator = 0
  static readonly kind = "InternalError"
  readonly discriminator = 0
  readonly kind = "InternalError"

  toJSON(): InternalErrorJSON {
    return {
      kind: "InternalError",
    }
  }

  toEncodable() {
    return {
      InternalError: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.CloseGrantErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("InternalError" in obj) {
    return new InternalError()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.CloseGrantErrorJSON
): types.CloseGrantErrorKind {
  switch (obj.kind) {
    case "InternalError": {
      return new InternalError()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "InternalError")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
