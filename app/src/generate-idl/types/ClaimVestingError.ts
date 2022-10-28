import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface NotInClaimableTimeJSON {
  kind: "NotInClaimableTime"
}

export class NotInClaimableTime {
  static readonly discriminator = 0
  static readonly kind = "NotInClaimableTime"
  readonly discriminator = 0
  readonly kind = "NotInClaimableTime"

  toJSON(): NotInClaimableTimeJSON {
    return {
      kind: "NotInClaimableTime",
    }
  }

  toEncodable() {
    return {
      NotInClaimableTime: {},
    }
  }
}

export interface NoTokenToClaimJSON {
  kind: "NoTokenToClaim"
}

export class NoTokenToClaim {
  static readonly discriminator = 1
  static readonly kind = "NoTokenToClaim"
  readonly discriminator = 1
  readonly kind = "NoTokenToClaim"

  toJSON(): NoTokenToClaimJSON {
    return {
      kind: "NoTokenToClaim",
    }
  }

  toEncodable() {
    return {
      NoTokenToClaim: {},
    }
  }
}

export interface PausedJSON {
  kind: "Paused"
}

export class Paused {
  static readonly discriminator = 2
  static readonly kind = "Paused"
  readonly discriminator = 2
  readonly kind = "Paused"

  toJSON(): PausedJSON {
    return {
      kind: "Paused",
    }
  }

  toEncodable() {
    return {
      Paused: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ClaimVestingErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("NotInClaimableTime" in obj) {
    return new NotInClaimableTime()
  }
  if ("NoTokenToClaim" in obj) {
    return new NoTokenToClaim()
  }
  if ("Paused" in obj) {
    return new Paused()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ClaimVestingErrorJSON
): types.ClaimVestingErrorKind {
  switch (obj.kind) {
    case "NotInClaimableTime": {
      return new NotInClaimableTime()
    }
    case "NoTokenToClaim": {
      return new NoTokenToClaim()
    }
    case "Paused": {
      return new Paused()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "NotInClaimableTime"),
    borsh.struct([], "NoTokenToClaim"),
    borsh.struct([], "Paused"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
