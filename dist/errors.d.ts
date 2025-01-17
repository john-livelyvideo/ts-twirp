/**
 * This module provides Twirp errors according to the Twirp spec.
 */
export declare class TwirpError extends Error {
    statusCode: number;
    message: string;
    name: string;
    isTwirpError: true;
}
declare enum TwirpErrorCode {
    Canceled = "canceled",
    Unknown = "unknown",
    InvalidArgument = "invalid_argument",
    DeadlineExceeded = "deadline_exceeded",
    NotFound = "not_found",
    BadRoute = "bad_route",
    AlreadyExists = "already_exists",
    PermissionDenied = "permission_denied",
    Unauthenticated = "unauthenticated",
    ResourceExhausted = "resource_exhausted",
    FailedPrecondition = "failed_precondition",
    Aborted = "aborted",
    OutOfRange = "out_of_range",
    Unimplemented = "unimplemented",
    Internal = "internal",
    Unavailable = "unavailable",
    DataLoss = "data_loss"
}
export declare class NotFoundError extends TwirpError {
    statusCode: number;
    name: TwirpErrorCode;
}
export declare class InvalidArgumentError extends TwirpError {
    statusCode: number;
    name: TwirpErrorCode;
}
export declare class RequiredArgumentError extends TwirpError {
    statusCode: number;
    name: TwirpErrorCode;
    constructor(argumentName: string);
}
export declare class InternalServerError extends TwirpError {
    statusCode: number;
    name: TwirpErrorCode;
}
export declare class BadRouteError extends TwirpError {
    statusCode: number;
    name: TwirpErrorCode;
}
export declare function twirpErrorFromIntermediary(status: number): TwirpErrorCode;
export {};
