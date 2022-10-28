import * as ClaimVestingError from "./ClaimVestingError"
import * as CloseGrantError from "./CloseGrantError"

export { ClaimVestingError }

export type ClaimVestingErrorKind =
  | ClaimVestingError.NotInClaimableTime
  | ClaimVestingError.NoTokenToClaim
  | ClaimVestingError.Paused
export type ClaimVestingErrorJSON =
  | ClaimVestingError.NotInClaimableTimeJSON
  | ClaimVestingError.NoTokenToClaimJSON
  | ClaimVestingError.PausedJSON

export { CloseGrantError }

export type CloseGrantErrorKind = CloseGrantError.InternalError
export type CloseGrantErrorJSON = CloseGrantError.InternalErrorJSON
